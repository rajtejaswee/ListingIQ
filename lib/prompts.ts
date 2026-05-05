export const PROMPT_1_EXTRACT_CLAIMS = `
You will receive the full text of an Amazon product listing (the user's) and up to 3 competitor listings.
Extract every distinct marketing claim or feature assertion from ALL listings combined.
For each claim, determine: which listings mention it, how prominently (title/bullet/description/absent).
Group claims into categories: Trust & Credibility, Ingredients/Materials, Health Benefits, Product Specs, Guarantee/Policy, Manufacturing, Certifications.
Return a JSON array of ClaimItem objects.

Schema:
{
  "claims": [
    {
      "claim": "string",
      "category": "string",
      "presentInYours": boolean,
      "presentInCompetitors": boolean[],
      "competitorCount": number,
      "prominence": "title" | "bullet" | "description" | "absent"
    }
  ]
}

Input:
USER LISTING:
{{yourListingRawText}}

COMPETITORS:
{{competitorRawTexts}}
`;

export const PROMPT_2_CLUSTER_REVIEWS = `
You will receive Amazon customer reviews for a product.
Identify 4-6 distinct emotional clusters — groups of customers who bought for the same reason and experienced a similar transformation arc.
For each cluster: give it a memorable short name ("The Skeptic", "The Chronic Sufferer"), write a one-sentence description of who this person is, estimate what percentage of reviews match this pattern, extract 3-4 actual short phrases from the reviews verbatim, pick 2 sample quotes (under 30 words each), and note if any current listing bullet speaks to this persona (or say null).
Return JSON matching the ReviewCluster schema.

Schema:
{
  "clusters": [
    {
      "name": "string",
      "description": "string",
      "size": number,
      "keyPhrases": ["string"],
      "sampleQuotes": ["string"],
      "whichBulletSpeaksToThis": "string" | null
    }
  ],
  "dominantTheme": "string"
}

Input:
REVIEWS:
{{reviewsText}}
`;

export const PROMPT_3_BUILD_GAP_REPORT = `
You will receive a claims analysis and the user's current listing bullets.
Identify the top 5 gaps: claims that 2 or more competitors make that the user's listing does not make.
Rank gaps by number of competitors who mention them (descending).
Rewrite the user's 5 bullet points to close as many of the top gaps as possible.
Rules for rewriting: keep all factual product details from the original bullets, add the missing claim language naturally, do not invent specifications you don't know, keep each bullet under 250 characters, maintain a customer-benefit-first structure.
Return JSON with topGaps and rewrittenBullets.

Schema:
{
  "topGaps": [
    {
      "claim": "string",
      "category": "string",
      "presentInYours": boolean,
      "presentInCompetitors": boolean[],
      "competitorCount": number,
      "prominence": "title" | "bullet" | "description" | "absent"
    }
  ],
  "rewrittenBullets": ["string"]
}

Input:
CLAIMS DATA:
{{claimsJSON}}

YOUR BULLETS:
{{yourListingBullets}}
`;

export const PROMPT_4_GENERATE_SCRIPTS = `
You will receive customer persona clusters and the top competitor gaps.
Generate exactly 5 UGC video scripts, each targeting one persona cluster.
Each script must: use the actual phrases and quote language from that cluster's reviews, be structured in exactly 5 parts (hook/problem/introduce/transform/cta), be 28-32 seconds when read aloud at natural pace, feel authentic and human, include a stage direction for the person filming.
Tag each script with which gap from topGaps it addresses most directly.
Return JSON array of exactly 5 UGCScript objects.

Schema:
{
  "scripts": [
    {
      "title": "string",
      "hook": "string",
      "problemSetup": "string",
      "productIntro": "string",
      "transformation": "string",
      "cta": "string",
      "stageDirection": "string",
      "addressesGap": "string"
    }
  ]
}

Input:
CLUSTERS:
{{clustersJSON}}

TOP GAPS:
{{topGapsJSON}}
`;

export const PROMPT_5_INSIGHT_SUMMARY = `
You will receive the gap analysis and voice of customer data for an Amazon listing.
Write a 3-5 sentence synthesis paragraph that: identifies the single biggest vulnerability in the user's current listing, connects it to what customers are actually saying, and tells the user exactly what kind of content shift would have the highest impact.
Write a single priorityAction sentence: the one thing they should do first.
Tone: direct, confident, like a senior consultant. No hedging.
Return JSON: { "paragraph": "string", "priorityAction": "string" }

Input:
GAP REPORT:
{{gapReportJSON}}

VOICE OF CUSTOMER:
{{voiceReportJSON}}
`;
