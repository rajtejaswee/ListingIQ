import { NextRequest, NextResponse } from "next/server";
import { scrapeListingPage, scrapeReviews } from "@/lib/firecrawl";
import { ScrapeInput, ScrapeResult, ScrapedListing } from "@/lib/types";

export const maxDuration = 60; // Vercel setting

export async function POST(req: NextRequest) {
  try {
    const body: ScrapeInput = await req.json();
    const { yourURL, competitorURL1, competitorURL2, competitorURL3 } = body;

    if (!yourURL || !yourURL.includes("amazon.com")) {
      return NextResponse.json({ error: "Invalid Amazon URL" }, { status: 400 });
    }

    const competitorURLs = [competitorURL1, competitorURL2, competitorURL3].filter(
      (url): url is string => !!url && url.includes("amazon.com")
    );

    console.log(`Starting scrape for ${yourURL}`);
    console.log(`Competitors: ${competitorURLs.length}`);

    const scrapeErrors: string[] = [];

    // Promise.all for parallel scraping
    const [yourListing, reviews, ...competitorListingsResults] = await Promise.all([
      scrapeListingPage(yourURL).catch((err) => {
        console.error(`Error scraping your listing: ${err.message}`);
        throw err;
      }),
      scrapeReviews(yourURL).catch((err) => {
        console.warn(`Error scraping reviews: ${err.message}`);
        return [];
      }),
      ...competitorURLs.map((url) =>
        scrapeListingPage(url).catch((err) => {
          console.warn(`Error scraping competitor ${url}: ${err.message}`);
          scrapeErrors.push(`Failed to scrape ${url}: ${err.message}`);
          return null;
        })
      ),
    ]);

    console.log("Scrape complete!");

    if (!yourListing) {
      return NextResponse.json({ error: "Failed to scrape your listing" }, { status: 422 });
    }

    const result: ScrapeResult = {
      yourListing,
      competitorListings: competitorListingsResults.filter((l): l is ScrapedListing => !!l),
      reviews,
      scrapeErrors,
    };

    return NextResponse.json(result);
  } catch (error: unknown) {
    console.error("Scrape API error:", error);
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
