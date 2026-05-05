export interface ScrapeInput {
  yourURL: string;
  competitorURL1?: string;
  competitorURL2?: string;
  competitorURL3?: string;
}

export interface ScrapedListing {
  url: string;
  title: string;
  bullets: string[];
  description: string;
  brandStory?: string;
  aplusContent?: string;
  rawText: string;
}

export interface ScrapedReview {
  text: string;
  rating: number;
  helpfulVotes: number;
  title: string;
}

export interface ScrapeResult {
  yourListing: ScrapedListing;
  competitorListings: ScrapedListing[];
  reviews: ScrapedReview[];
  scrapeErrors: string[];
}

export interface ClaimItem {
  claim: string;
  category: string;
  presentInYours: boolean;
  presentInCompetitors: boolean[];
  competitorCount: number;
  prominence: "title" | "bullet" | "description" | "absent";
}

export interface GapReport {
  claims: ClaimItem[];
  topGaps: ClaimItem[];
  rewrittenBullets: string[];
}

export interface ReviewCluster {
  name: string;
  description: string;
  size: number;
  keyPhrases: string[];
  sampleQuotes: string[];
  whichBulletSpeaksToThis: string | null;
}

export interface VoiceOfCustomerReport {
  clusters: ReviewCluster[];
  dominantTheme: string;
}

export interface UGCScript {
  title: string;
  hook: string;
  problemSetup: string;
  productIntro: string;
  transformation: string;
  cta: string;
  stageDirection: string;
  addressesGap: string;
}

export interface UGCScriptsReport {
  scripts: UGCScript[];
}

export interface InsightSummary {
  paragraph: string;
  priorityAction: string;
}

export interface AnalysisResult {
  gapReport: GapReport;
  voiceOfCustomer: VoiceOfCustomerReport;
  ugcScripts: UGCScriptsReport;
  insightSummary: InsightSummary;
  productName: string;
}

export type AppPhase = "input" | "scraping" | "analyzing" | "done" | "error";

export interface AppState {
  phase: AppPhase;
  scrapeProgress: string[];
  analyzeProgress: string[];
  scrapeResult: ScrapeResult | null;
  analysisResult: AnalysisResult | null;
  error: string | null;
}
