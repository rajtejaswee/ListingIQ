import { NextRequest, NextResponse } from "next/server";
import {
  extractClaims,
  clusterReviews,
  buildGapReport,
  generateScripts,
  generateInsight,
} from "@/lib/groq";
import { AnalysisResult } from "@/lib/types";

import { cleanTitle } from "@/lib/utils";

export const maxDuration = 120; // Vercel setting

export async function POST(req: NextRequest) {
  try {
    const { scrapeResult } = await req.json();

    if (!scrapeResult || !scrapeResult.yourListing) {
      return NextResponse.json({ error: "Missing scrape result" }, { status: 400 });
    }

    const { yourListing, competitorListings, reviews } = scrapeResult;

    console.log(`Starting analysis for: ${yourListing.title}`);

    // Step A: Run sequentially to respect free tier rate limits
    console.log("Step 1/5: Extracting claims...");
    const claimsData = await extractClaims([yourListing, ...competitorListings]);

    console.log("Step 2/5: Clustering reviews...");
    const voiceOfCustomer = await clusterReviews(reviews);

    // Step B: Build Gap Report (needs claims)
    console.log("Step 3/5: Building gap report...");
    const gapReport = await buildGapReport(claimsData, yourListing);

    // Step C: Generate Scripts (needs clusters and gap report)
    console.log("Step 4/5: Generating UGC scripts...");
    const ugcScripts = await generateScripts(voiceOfCustomer.clusters, gapReport.topGaps);

    // Step D: Generate Insight (needs everything)
    console.log("Step 5/5: Generating final insight...");
    const insightSummary = await generateInsight(gapReport, voiceOfCustomer);

    console.log("Analysis complete!");

    const result: AnalysisResult = {
      gapReport,
      voiceOfCustomer,
      ugcScripts: { scripts: ugcScripts },
      insightSummary,
      productName: cleanTitle(yourListing.title),
    };

    return NextResponse.json(result);
  } catch (error: unknown) {
    console.error("Analyze API error:", error);
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
