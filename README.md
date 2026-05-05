# ListingIQ

**"Your customers wrote the script. Your competitors set the bar. We close the gap."**

ListingIQ is an AI-powered Amazon listing optimizer that analyzes your listing against competitors, identifies strategic gaps, and generates ready-to-film UGC (User-Generated Content) video scripts based on real customer reviews.

## 🚀 Features

- **Competitor Gap Matrix:** See exactly what claims your competitors are making that you aren't.
- **AI Bullet Rewrites:** Automatically update your listing bullets to close high-priority gaps.
- **Voice of Customer Clustering:** Emotional analysis of your reviews to identify distinct customer personas.
- **UGC Script Generator:** 5 custom video scripts targeting your specific customer segments and closing competitor gaps.
- **Strategic Summary:** A senior consultant-level synthesis of your listing's biggest vulnerabilities and opportunities.

## 🛠️ Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Styling:** Tailwind CSS
- **UI Components:** shadcn/ui + Framer Motion
- **Scraping:** [Firecrawl](https://firecrawl.dev) (Anti-bot + Markdown)
- **AI Analysis:** [Google Gemini Flash](https://deepmind.google/technologies/gemini/)
- **Deployment:** Vercel

## 🏁 Getting Started

### Prerequisites

You will need API keys for:
1. **Firecrawl API** (Free tier available)
2. **Gemini API**

### Installation

1. Clone the repository:
   ```bash
   git clone <repo-url>
   cd listingiq
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env.local` file in the root directory:
   ```env
   FIRECRAWL_API_KEY=your_firecrawl_key_here
   GEMINI_API_KEY=your_gemini_key_here
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 📐 Architecture

1. **Scrape Phase:** Parallel requests to Firecrawl for the user listing, up to 3 competitors, and the user's reviews.
2. **Analysis Phase:** A 5-step orchestrated Gemini Flash pipeline:
   - Extract claims from all listings.
   - Cluster reviews into emotional personas.
   - Build a gap report by comparing claims.
   - Generate UGC scripts targeting clusters and gaps.
   - Synthesize a final strategic insight.
3. **Frontend:** A single-session state machine that guides the user from input to analysis to a rich dashboard.

---

Built for the Pixii Interview Challenge.
