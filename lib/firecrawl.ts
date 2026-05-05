import { ScrapedListing, ScrapedReview } from "./types";

const FIRECRAWL_API_KEY = process.env.FIRECRAWL_API_KEY;
const FIRECRAWL_API_URL = "https://api.firecrawl.dev/v1/scrape";

export async function scrapeListingPage(url: string): Promise<ScrapedListing | null> {
  if (!url) return null;

  if (!FIRECRAWL_API_KEY) {
    throw new Error("FIRECRAWL_API_KEY is not set in environment variables");
  }

  try {
    const response = await fetch(FIRECRAWL_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${FIRECRAWL_API_KEY}`,
      },
      body: JSON.stringify({
        url,
        formats: ["markdown"],
        onlyMainContent: true,
        waitFor: 2000,
      }),
    });

    if (!response.ok) {
      throw new Error(`Firecrawl error: ${response.statusText}`);
    }

    const data = await response.json();
    const markdown = data.data?.markdown || "";

    // Basic extraction logic from markdown
    // Title is usually the first # line
    const titleMatch = markdown.match(/^#\s+(.*)/m);
    const title = titleMatch ? titleMatch[1] : "Unknown Product";

    // Bullets: Look for list items in "About this item" section or just generic list items
    const bullets: string[] = [];
    const bulletLines = markdown.match(/^\s*-\s+(.*)/gm);
    if (bulletLines) {
      bulletLines.slice(0, 10).forEach((line: string) => {
        bullets.push(line.replace(/^\s*-\s+/, "").trim());
      });
    }

    // Description: Everything else
    const description = markdown.substring(0, 1000); // Placeholder for description extraction

    return {
      url,
      title,
      bullets: bullets.length > 0 ? bullets : ["No bullets found"],
      description,
      rawText: markdown,
    };
  } catch (error) {
    console.error(`Error scraping ${url}:`, error);
    throw error;
  }
}

export async function scrapeReviews(url: string): Promise<ScrapedReview[]> {
  const asinMatch = url.match(/\/(?:dp|gp\/product)\/([A-Z0-9]{10})/i);
  if (!asinMatch) return [];

  const asin = asinMatch[1];
  const reviewsUrl = `https://www.amazon.com/product-reviews/${asin}/?sortBy=helpful&pageNumber=1`;

  if (!FIRECRAWL_API_KEY) {
    throw new Error("FIRECRAWL_API_KEY is not set in environment variables");
  }

  try {
    const response = await fetch(FIRECRAWL_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${FIRECRAWL_API_KEY}`,
      },
      body: JSON.stringify({
        url: reviewsUrl,
        formats: ["markdown"],
        onlyMainContent: true,
        waitFor: 2000,
      }),
    });

    if (!response.ok) {
      throw new Error(`Firecrawl error: ${response.statusText}`);
    }

    const data = await response.json();
    const markdown = data.data?.markdown || "";

    // Parse reviews from markdown
    // This is a simplified parser, real world would be more robust
    const reviews: ScrapedReview[] = [];
    const reviewBlocks = markdown.split(/(\d\.0 out of 5 stars)/);

    for (let i = 1; i < reviewBlocks.length; i += 2) {
      const rating = parseInt(reviewBlocks[i].charAt(0));
      const content = reviewBlocks[i + 1] || "";
      const lines = content.trim().split("\n");
      const title = lines[0]?.trim() || "Review";
      const text = lines.slice(1).join(" ").trim().substring(0, 500);

      if (text) {
        reviews.push({
          rating,
          title,
          text,
          helpfulVotes: 0, // Placeholder
        });
      }
    }

    return reviews.slice(0, 20); // Limit to 20 for now
  } catch (error) {
    console.error(`Error scraping reviews for ${url}:`, error);
    return [];
  }
}
