import Groq from "groq-sdk";
import {
  ClaimItem,
  ReviewCluster,
  GapReport,
  UGCScript,
  InsightSummary,
  ScrapedListing,
  ScrapedReview,
  VoiceOfCustomerReport,
} from "./types";
import {
  PROMPT_1_EXTRACT_CLAIMS,
  PROMPT_2_CLUSTER_REVIEWS,
  PROMPT_3_BUILD_GAP_REPORT,
  PROMPT_4_GENERATE_SCRIPTS,
  PROMPT_5_INSIGHT_SUMMARY,
} from "./prompts";

let groq: Groq | null = null;

function getGroq() {
  if (groq) return groq;
  const key = process.env.GROQ_API_KEY;
  if (!key) {
    throw new Error("GROQ_API_KEY is not set");
  }
  groq = new Groq({ apiKey: key });
  return groq;
}

async function callGroq(
  prompt: string,
  systemInstruction: string = "You are an expert Amazon listing analyst. Return ONLY raw JSON. No markdown fences, no explanation.",
  modelName: string = "llama-3.1-8b-instant",
  temperature: number = 0,
  retryCount: number = 0
): Promise<any> { // eslint-disable-line @typescript-eslint/no-explicit-any
  const client = getGroq();

  try {
    const response = await client.chat.completions.create({
      messages: [
        { role: "system", content: systemInstruction },
        { role: "user", content: prompt },
      ],
      model: modelName,
      temperature: temperature,
      response_format: { type: "json_object" },
    });

    const text = response.choices[0]?.message?.content || "";

    if (!text) {
      throw new Error("Groq returned an empty response.");
    }

    try {
      return JSON.parse(text);
    } catch {
      console.error("JSON Parse Error. Raw text:", text);
      throw new Error("Invalid JSON response from Groq");
    }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    
    // Handle rate limits with exponential backoff
    if (message.includes("429") && retryCount < 3) {
      const waitTime = Math.pow(2, retryCount + 1);
      console.log(`Groq rate limited. Retrying in ${waitTime}s...`);
      await new Promise(resolve => setTimeout(resolve, waitTime * 1000));
      return callGroq(prompt, systemInstruction, modelName, temperature, retryCount + 1);
    }
    
    console.error("Error calling Groq:", error);
    throw error;
  }
}

export async function extractClaims(listings: ScrapedListing[]): Promise<ClaimItem[]> {
  const yourListing = listings[0];
  const competitors = listings.slice(1);

  // Truncate more aggressively to stay within free tier TPD (approx 1000 tokens per listing)
  const truncate = (text: string) => text.length > 4000 ? text.substring(0, 4000) + "..." : text;

  const prompt = PROMPT_1_EXTRACT_CLAIMS.replace("{{yourListingRawText}}", truncate(yourListing.rawText)).replace(
    "{{competitorRawTexts}}",
    competitors.map((c, i) => `COMPETITOR ${i + 1}:\n${truncate(c.rawText)}`).join("\n\n")
  );

  const result = await callGroq(prompt);
  return result.claims || [];
}

export async function clusterReviews(reviews: ScrapedReview[]): Promise<VoiceOfCustomerReport> {
  const reviewsText = reviews
    .map((r, i) => `REVIEW ${i + 1} (${r.rating} stars): ${r.title}\n${r.text}`)
    .join("\n\n");

  const truncatedReviews = reviewsText.length > 8000 ? reviewsText.substring(0, 8000) + "..." : reviewsText;

  const prompt = PROMPT_2_CLUSTER_REVIEWS.replace("{{reviewsText}}", truncatedReviews);

  const result = await callGroq(prompt);
  return result;
}

export async function buildGapReport(claims: ClaimItem[], yourListing: ScrapedListing): Promise<GapReport> {
  const claimsJSON = JSON.stringify(claims);
  const prompt = PROMPT_3_BUILD_GAP_REPORT.replace(
    "{{claimsJSON}}", 
    claimsJSON.length > 10000 ? claimsJSON.substring(0, 10000) + "..." : claimsJSON
  ).replace(
    "{{yourListingBullets}}",
    yourListing.bullets.join("\n")
  );

  const result = await callGroq(prompt);
  return {
    ...result,
    claims: claims
  };
}

export async function generateScripts(
  clusters: ReviewCluster[],
  topGaps: ClaimItem[]
): Promise<UGCScript[]> {
  const clustersJSON = JSON.stringify(clusters);
  const topGapsJSON = JSON.stringify(topGaps);

  const prompt = PROMPT_4_GENERATE_SCRIPTS.replace(
    "{{clustersJSON}}", 
    clustersJSON.length > 8000 ? clustersJSON.substring(0, 8000) + "..." : clustersJSON
  ).replace(
    "{{topGapsJSON}}", 
    topGapsJSON.length > 4000 ? topGapsJSON.substring(0, 4000) + "..." : topGapsJSON
  );

  const result = await callGroq(prompt, "You are an expert UGC scriptwriter.", "llama-3.1-8b-instant", 0.7);
  return result.scripts || [];
}


export async function generateInsight(
  gapReport: GapReport,
  voiceReport: VoiceOfCustomerReport
): Promise<InsightSummary> {
  const gapReportJSON = JSON.stringify(gapReport);
  const voiceReportJSON = JSON.stringify(voiceReport);

  const prompt = PROMPT_5_INSIGHT_SUMMARY.replace(
    "{{gapReportJSON}}", 
    gapReportJSON.length > 10000 ? gapReportJSON.substring(0, 10000) + "..." : gapReportJSON
  ).replace(
    "{{voiceReportJSON}}", 
    voiceReportJSON.length > 10000 ? voiceReportJSON.substring(0, 10000) + "..." : voiceReportJSON
  );

  const result = await callGroq(prompt);
  return result;
}
