# ListingIQ — Complete Technical Blueprint
### HLD + LLD for AI Agent Implementation
**Version 1.0 | Pixii Interview Challenge | "Surprise Us" Category**

---

## 0. MASTER CONTEXT (Read This First)

This document is a complete end-to-end build specification. No assumptions are made. Every decision — tool choice, API call structure, data shape, UI component, state management, error handling — is spelled out explicitly. Build in the exact order described. Do not skip sections.

**What this app does in one sentence:**
Paste your Amazon listing URL + up to 3 competitor URLs → the app scrapes all listings + your reviews → runs 5 sequential/parallel AI analysis calls → outputs a 3-tab dashboard with: (1) a gap matrix showing what competitors say that you don't, with rewritten bullets; (2) emotional clusters from your real customer reviews; (3) five ready-to-film UGC video scripts that are strategically targeted to close your specific gaps.

---

## 1. PROJECT IDENTITY

| Field | Value |
|---|---|
| App Name | ListingIQ |
| Tagline | "Your customers wrote the script. Your competitors set the bar. We close the gap." |
| Target User | Amazon seller / e-commerce brand owner |
| Primary Action | Paste URLs → get actionable content strategy |
| Interview Category | Surprise Us (combination of UGC Script Gen + Competitor Gap Analysis) |
| Minimum Tools Required | 2+ (using: Firecrawl, Google Gemini API, Vercel deployment) |

---

## 2. TECH STACK DECISIONS

Every tool here has a free tier sufficient for demo purposes. No paid plans required to build or demo.

### 2.1 Frontend
| Layer | Tool | Why |
|---|---|---|
| Framework | Next.js 14 (App Router) | SSR + API routes in one project, Vercel native, industry standard |
| Styling | Tailwind CSS | Utility-first, fast to build, no separate CSS files needed |
| UI Components | shadcn/ui | Pre-built accessible components (Tabs, Cards, Badge, Progress) — install only what you use |
| Animations | Framer Motion | Progress states, tab transitions, results reveal |
| Icons | Lucide React | Already bundled with shadcn |
| State Management | React useState + useReducer | No Redux needed — app is single-session, no persistence required |
| HTTP Client | Native fetch API | No axios needed for this complexity level |

### 2.2 Backend
| Layer | Tool | Why |
|---|---|---|
| API Routes | Next.js App Router API routes (`/app/api/`) | No separate Express server needed, keeps repo single |
| Async Orchestration | Native Promise.all + async/await | Parallel scraping calls, then sequential AI calls |
| Environment Variables | `.env.local` + Vercel env settings | API keys never in client bundle |

### 2.3 External APIs
| API | Purpose | Free Tier Limit | Key Name in .env |
|---|---|---|---|
| Firecrawl API | Scrape Amazon listing pages + reviews | 500 pages/month | `FIRECRAWL_API_KEY` |
| Google Gemini API | All 5 analysis + generation calls | $5 free credit on signup | `GEMINI_API_KEY` |
| No other APIs needed | — | — | — |

> **Note on Amazon scraping:** Firecrawl handles JavaScript rendering and anti-bot headers. Do not attempt to use raw `fetch()` or `axios` on Amazon URLs — they will be blocked. Firecrawl is the right tool here.

### 2.4 Deployment
| Layer | Tool | Why |
|---|---|---|
| Hosting | Vercel | Free tier, zero-config Next.js deploy, instant HTTPS |
| Repo | GitHub (public) | Required by challenge rules |
| Domain | Vercel default (`listingiq.vercel.app`) | Free, no custom domain purchase needed |

---

## 3. REPOSITORY STRUCTURE

```
listingiq/
├── app/
│   ├── page.tsx                    ← Landing / Input page
│   ├── layout.tsx                  ← Root layout, fonts, metadata
│   ├── globals.css                 ← Tailwind base styles
│   ├── analyze/
│   │   └── page.tsx                ← Results dashboard page
│   └── api/
│       ├── scrape/
│       │   └── route.ts            ← API Route: triggers all Firecrawl scraping
│       └── analyze/
│           └── route.ts            ← API Route: runs all 5 Claude calls
├── components/
│   ├── InputForm.tsx               ← URL input form component
│   ├── ProgressTracker.tsx         ← Live processing steps UI
│   ├── tabs/
│   │   ├── GapReportTab.tsx        ← Tab 1: competitor gap matrix
│   │   ├── VoiceOfCustomerTab.tsx  ← Tab 2: review clusters
│   │   └── UGCScriptsTab.tsx       ← Tab 3: video scripts
│   ├── InsightSummary.tsx          ← Bottom synthesis paragraph
│   └── ui/                         ← shadcn components (auto-generated)
├── lib/
│   ├── firecrawl.ts                ← Firecrawl API wrapper functions
│   ├── claude.ts                   ← Anthropic API wrapper functions
│   ├── prompts.ts                  ← All Claude prompt templates (centralized)
│   └── types.ts                    ← All TypeScript interfaces
├── .env.local                      ← API keys (gitignored)
├── .env.example                    ← Template for keys (committed to repo)
├── next.config.js
├── tailwind.config.js
├── tsconfig.json
└── README.md
```

---

## 4. DATA TYPES (types.ts) — Define These First

Before writing any logic, define all data shapes. Every API response and every component prop maps to one of these.

```
ScrapeInput {
  yourURL: string
  competitorURL1?: string
  competitorURL2?: string
  competitorURL3?: string
}

ScrapedListing {
  url: string
  title: string
  bullets: string[]          ← array of bullet point strings
  description: string
  brandStory?: string
  aplusContent?: string
  rawText: string            ← full concatenated text for Claude
}

ScrapedReview {
  text: string
  rating: number             ← 1-5
  helpfulVotes: number
  title: string
}

ScrapeResult {
  yourListing: ScrapedListing
  competitorListings: ScrapedListing[]
  reviews: ScrapedReview[]
  scrapeErrors: string[]     ← non-fatal: log which URLs partially failed
}

ClaimItem {
  claim: string              ← e.g. "third-party tested"
  category: string           ← e.g. "Trust & Credibility"
  presentInYours: boolean
  presentInCompetitors: boolean[]   ← one boolean per competitor
  competitorCount: number    ← how many competitors mention it
  prominence: "title" | "bullet" | "description" | "absent"
}

GapReport {
  claims: ClaimItem[]
  topGaps: ClaimItem[]       ← top 5 sorted by competitorCount desc
  rewrittenBullets: string[] ← 5 rewritten bullet strings
}

ReviewCluster {
  name: string               ← e.g. "The Skeptic"
  description: string        ← one sentence about this persona
  size: number               ← estimated % of reviews in this cluster
  keyPhrases: string[]       ← 3-4 actual phrases from real reviews
  sampleQuotes: string[]     ← 2-3 actual review quote snippets
  whichBulletSpeaksToThis: string | null
}

VoiceOfCustomerReport {
  clusters: ReviewCluster[]  ← 4-6 clusters
  dominantTheme: string      ← single sentence summary
}

UGCScript {
  title: string              ← e.g. "The Skeptic"
  hook: string               ← first 3 seconds
  problemSetup: string       ← seconds 4-8
  productIntro: string       ← seconds 9-13
  transformation: string     ← seconds 14-23
  cta: string                ← seconds 24-30
  stageDirection: string     ← filming instruction
  addressesGap: string       ← which gap from GapReport this targets
}

UGCScriptsReport {
  scripts: UGCScript[]       ← exactly 5 scripts
}

InsightSummary {
  paragraph: string          ← 3-5 sentence synthesis
  priorityAction: string     ← single most important action
}

AnalysisResult {
  gapReport: GapReport
  voiceOfCustomer: VoiceOfCustomerReport
  ugcScripts: UGCScriptsReport
  insightSummary: InsightSummary
  productName: string        ← extracted from listing title
}

AppState {
  phase: "input" | "scraping" | "analyzing" | "done" | "error"
  scrapeProgress: string[]   ← list of completed scrape steps
  analyzeProgress: string[]  ← list of completed analysis steps
  scrapeResult: ScrapeResult | null
  analysisResult: AnalysisResult | null
  error: string | null
}
```

---

## 5. HIGH-LEVEL ARCHITECTURE (HLD)

### 5.1 System Flow Diagram

```
[Browser: User Input Page]
         │
         │ POST /api/scrape  { yourURL, competitor1, competitor2, competitor3 }
         ▼
[Next.js API Route: /api/scrape]
         │
         ├── Firecrawl.scrape(yourURL)           ─┐
         ├── Firecrawl.scrape(competitor1URL)     ├─ Promise.all (parallel)
         ├── Firecrawl.scrape(competitor2URL)     ├─ all fire simultaneously
         ├── Firecrawl.scrape(competitor3URL)     ┘
         └── Firecrawl.scrapeReviews(yourURL)    ─── separate call
         │
         │ Returns: ScrapeResult
         ▼
[Browser: receives ScrapeResult, stores in state]
         │
         │ POST /api/analyze  { scrapeResult: ScrapeResult }
         ▼
[Next.js API Route: /api/analyze]
         │
         ├── Claude Call 1: extractClaims(allListings) → ClaimItem[]
         ├── Claude Call 2: clusterReviews(reviews) → ReviewCluster[]
         │   (Calls 1 and 2 run in parallel via Promise.all)
         │
         ├── Claude Call 3: buildGapReport(claims, yourListing) → GapReport
         ├── Claude Call 4: generateScripts(clusters, topGaps, yourListing) → UGCScript[]
         │   (Calls 3 and 4 run in parallel — both depend on Calls 1+2)
         │
         └── Claude Call 5: generateInsight(gapReport, voiceReport, productName) → InsightSummary
             (Call 5 runs last — depends on 3+4)
         │
         │ Returns: AnalysisResult
         ▼
[Browser: Results Dashboard — 3 Tabs + Insight Summary]
```

### 5.2 Page Routing

| Route | Component | Purpose |
|---|---|---|
| `/` | `app/page.tsx` | Input form — URL entry |
| `/analyze` | `app/analyze/page.tsx` | Processing + Results dashboard |

There are only 2 pages. Navigation from `/` to `/analyze` happens after the user submits URLs. The `/analyze` page handles both the loading state and the results state using `AppState.phase`.

### 5.3 State Flow in Browser

```
AppState.phase transitions:

"input"
   │ (user submits form)
   ▼
"scraping"
   │ (POST /api/scrape completes)
   ▼
"analyzing"
   │ (POST /api/analyze completes)
   ▼
"done"

Any API error at any step → "error"
```

The phase drives what the `/analyze` page renders:
- `scraping` → show ProgressTracker with scrape steps
- `analyzing` → show ProgressTracker with analysis steps
- `done` → show full 3-tab dashboard
- `error` → show error message with retry button

---

## 6. LOW-LEVEL DESIGN (LLD)

### 6.1 lib/firecrawl.ts

This file contains all Firecrawl interactions. Two functions only.

**Function 1: `scrapeListingPage(url: string): Promise<ScrapedListing>`**

- Calls Firecrawl `/v1/scrape` endpoint with the URL
- Firecrawl parameters to set:
  - `formats: ["markdown"]` — get clean text, not raw HTML
  - `onlyMainContent: true` — strips navigation, footer, ads
  - `waitFor: 2000` — wait 2 seconds for JS to render (Amazon is JS-heavy)
- After receiving markdown, extract structured fields:
  - Title: look for the first H1 in the markdown
  - Bullets: look for list items (`- `) in the "About this item" section
  - Description: the paragraph section after bullets
  - rawText: the entire markdown string (passed to Claude)
- Return a `ScrapedListing` object
- If the URL is empty string (competitor slot not filled), return null — the caller handles nulls

**Function 2: `scrapeReviews(url: string): Promise<ScrapedReview[]>`**

- Amazon reviews are on a different URL pattern: `{productURL}` → navigate to reviews tab
- Firecrawl parameters:
  - The reviews URL format is: `https://www.amazon.com/product-reviews/{ASIN}/`
  - Extract ASIN from the product URL first (regex: `/\/dp\/([A-Z0-9]{10})/`)
  - Construct reviews URL: `https://www.amazon.com/product-reviews/{ASIN}/?sortBy=helpful&pageNumber=1`
  - Scrape pages 1 and 2 (two separate calls) to get ~20 reviews per page = ~40 reviews total
  - `formats: ["markdown"]`
  - `onlyMainContent: true`
- Parse the markdown to extract individual reviews:
  - Each review block has: star rating (look for "X.0 out of 5 stars"), title (bold text after rating), body text
  - Return array of `ScrapedReview` objects
- If fewer than 5 reviews scraped, still return what you have — do not throw

### 6.2 lib/prompts.ts

This is the most important file in the project. All 5 Claude prompts live here as exported constants. Write them carefully.

**PROMPT_1_EXTRACT_CLAIMS**

Input variables: `yourListingRawText`, `competitor1RawText`, `competitor2RawText`, `competitor3RawText`

Instructions to Claude:
- You will receive the full text of an Amazon product listing (the user's) and up to 3 competitor listings
- Extract every distinct marketing claim or feature assertion from ALL listings combined
- For each claim, determine: which listings mention it, how prominently (title/bullet/description/absent)
- Group claims into categories: Trust & Credibility, Ingredients/Materials, Health Benefits, Product Specs, Guarantee/Policy, Manufacturing, Certifications
- Return a JSON array of ClaimItem objects (provide the exact schema in the prompt)
- Be specific — "third-party tested" and "NSF certified" are different claims
- Include claims from ALL listings, even if only one listing mentions it

**PROMPT_2_CLUSTER_REVIEWS**

Input variables: `reviewsText` (all reviews concatenated with separators)

Instructions to Claude:
- You will receive Amazon customer reviews for a product
- Identify 4-6 distinct emotional clusters — groups of customers who bought for the same reason and experienced a similar transformation arc
- For each cluster: give it a memorable short name ("The Skeptic", "The Chronic Sufferer"), write a one-sentence description of who this person is, estimate what percentage of reviews match this pattern, extract 3-4 actual short phrases from the reviews verbatim, pick 2 sample quotes (under 30 words each), and note if any current listing bullet speaks to this persona (or say null)
- Return JSON matching the ReviewCluster schema exactly
- Cluster names should be persona-based, not topic-based. Not "Sleep Reviews" but "The Desperate Sleeper"

**PROMPT_3_BUILD_GAP_REPORT**

Input variables: `claimsJSON` (output of Prompt 1), `yourListingBullets` (array of 5 bullet strings), `productName`

Instructions to Claude:
- You will receive a claims analysis and the user's current listing bullets
- Identify the top 5 gaps: claims that 2 or more competitors make that the user's listing does not make
- Rank gaps by number of competitors who mention them (descending)
- Rewrite the user's 5 bullet points to close as many of the top gaps as possible
- Rules for rewriting: keep all factual product details from the original bullets, add the missing claim language naturally, do not invent specifications you don't know, keep each bullet under 250 characters, maintain a customer-benefit-first structure
- Return JSON with `topGaps: ClaimItem[]` and `rewrittenBullets: string[]`

**PROMPT_4_GENERATE_SCRIPTS**

Input variables: `clustersJSON` (output of Prompt 2), `topGapsJSON` (from Prompt 3 output), `productName`, `productCategory`

Instructions to Claude:
- You will receive customer persona clusters and the top competitor gaps
- Generate exactly 5 UGC video scripts, each targeting one persona cluster
- Each script must: use the actual phrases and quote language from that cluster's reviews (not invented), be structured in exactly 5 parts (hook/problem/introduce/transform/cta), be 28-32 seconds when read aloud at natural pace, feel authentic and human — NOT like a brand ad, include a stage direction for the person filming
- Tag each script with which gap from topGaps it addresses most directly
- Return JSON array of exactly 5 UGCScript objects

**PROMPT_5_INSIGHT_SUMMARY**

Input variables: `gapReportJSON`, `voiceOfCustomerJSON`, `productName`, `competitorCount`

Instructions to Claude:
- You will receive the gap analysis and voice of customer data for an Amazon listing
- Write a 3-5 sentence synthesis paragraph that: identifies the single biggest vulnerability in the user's current listing, connects it to what customers are actually saying, and tells the user exactly what kind of content shift would have the highest impact
- Write a single `priorityAction` sentence: the one thing they should do first
- Tone: direct, confident, like a senior consultant. No hedging. No "consider" or "might". Say what's true.
- Return JSON: `{ paragraph: string, priorityAction: string }`

### 6.3 lib/claude.ts

This file wraps the Anthropic API. One function per Claude call.

**Base function: `callClaude(prompt: string, systemPrompt: string): Promise<string>`**
- Uses `claude-3-5-sonnet-20241022` model (latest Sonnet — balance of speed and quality)
- `max_tokens: 4096` for all calls except scripts (use 6000 for scripts)
- `temperature: 0` for analysis calls (deterministic, structured JSON)
- `temperature: 0.3` for script generation (slight creativity, still consistent)
- Always wrap in try/catch — if Claude throws, return a structured error object

**Five exported functions, each calls the base:**
1. `extractClaims(listings: ScrapedListing[]): Promise<ClaimItem[]>`
2. `clusterReviews(reviews: ScrapedReview[]): Promise<ReviewCluster[]>`
3. `buildGapReport(claims: ClaimItem[], yourListing: ScrapedListing): Promise<GapReport>`
4. `generateScripts(clusters: ReviewCluster[], topGaps: ClaimItem[], listing: ScrapedListing): Promise<UGCScript[]>`
5. `generateInsight(gapReport: GapReport, voc: VoiceOfCustomerReport, productName: string): Promise<InsightSummary>`

**JSON parsing strategy for all Claude responses:**
- All prompts instruct Claude to return raw JSON only — no markdown code fences, no explanation
- Wrap `JSON.parse(response)` in try/catch
- If parse fails: strip any accidental ``` fences with regex, then retry parse once
- If second parse fails: log the raw response and return a fallback empty structure

### 6.4 app/api/scrape/route.ts

This is the backend API route that the browser calls first.

**Method:** POST

**Request body:** `ScrapeInput`

**Processing steps:**
1. Validate that `yourURL` is present and is a valid Amazon URL (contains `amazon.com` and `/dp/` or `/gp/`)
2. Filter competitor URLs — remove empty strings, validate format
3. Fire `Promise.all`:
   - `scrapeListingPage(yourURL)`
   - `scrapeListingPage(comp1URL)` (if present)
   - `scrapeListingPage(comp2URL)` (if present)
   - `scrapeListingPage(comp3URL)` (if present)
   - `scrapeReviews(yourURL)` (always)
4. All 5 calls happen simultaneously — Firecrawl can handle concurrent requests
5. Handle partial failures gracefully: if a competitor URL fails, continue with the others and add an error message to `scrapeErrors`
6. Return `ScrapeResult` as JSON with status 200
7. If `yourURL` scrape fails completely, return status 422 with error message

**Response:** `ScrapeResult`

**Timeout consideration:** Set a 30-second timeout on this route. Vercel functions default to 10 seconds on hobby tier — this may need `export const maxDuration = 60` at the top of the route file (Vercel supports this for API routes).

### 6.5 app/api/analyze/route.ts

This is the backend API route that runs all Claude calls.

**Method:** POST

**Request body:** `{ scrapeResult: ScrapeResult }`

**Processing steps (exact order matters):**

```
Step A: Run in parallel (Promise.all):
  - extractClaims([yourListing, ...competitorListings])  → claimsData
  - clusterReviews(reviews)                              → clustersData

Step B: Run in parallel (Promise.all, waits for Step A):
  - buildGapReport(claimsData, yourListing)              → gapReport
  - (clustersData is already ready, no call needed)

Step C: Run in parallel (Promise.all, waits for Step B):
  - generateScripts(clustersData, gapReport.topGaps, yourListing)  → scripts
  - (gapReport is already ready)

Step D: Run last (waits for Step C):
  - generateInsight(gapReport, { clusters: clustersData }, productName)  → insight

Step E: Assemble and return AnalysisResult
```

**Why this exact order:**
- Claims extraction and review clustering have no dependency on each other → parallel
- Gap report needs claims data → waits for Step A
- Scripts need both clusters AND the gap data → waits for both A and B
- Insight needs everything → runs last

**Timeout:** Set `export const maxDuration = 120` — 5 Claude calls with 4096 tokens each can take 30-60 seconds total

**Response:** `AnalysisResult`

### 6.6 app/page.tsx — Input Page

**What it renders:** A centered single-column form

**Components used:**
- `InputForm` component (see below)
- App name + tagline header
- Brief 2-line explanation of what it does

**On form submit:**
1. Validate inputs (yourURL required, competitors optional)
2. Store URLs in sessionStorage (so `/analyze` page can access them)
3. Navigate to `/analyze`

**No API calls happen on this page.** The input page is purely UI.

### 6.7 components/InputForm.tsx

**Fields:**
- "Your Amazon listing URL" — required, text input, full width
- "Competitor 1 URL" — optional, text input
- "Competitor 2 URL" — optional, text input
- "Competitor 3 URL" — optional, text input
- "Analyze My Listing" — submit button

**Validation rules:**
- yourURL: must be non-empty, must contain `amazon.com`
- competitor URLs: if non-empty, must contain `amazon.com`
- Show inline error messages below each field that fails validation
- Disable submit button while validating

**UX details:**
- Add a "Try with example" button that pre-fills a real Amazon supplement URL so the interviewer can demo without typing
- The competitor URL fields should have a small "+ Add competitor" pattern — show field 1 by default, reveal field 2 when field 1 is filled, reveal field 3 when field 2 is filled. Reduces visual complexity.

### 6.8 app/analyze/page.tsx — Results Page

**On mount:**
1. Read URLs from sessionStorage
2. If no URLs found, redirect back to `/`
3. Set `phase = "scraping"`
4. Call `POST /api/scrape` with the URLs
5. On scrape success: set `scrapeResult` in state, set `phase = "analyzing"`
6. Call `POST /api/analyze` with the scrapeResult
7. On analyze success: set `analysisResult` in state, set `phase = "done"`
8. On any error: set `phase = "error"`, set error message

**Rendering logic:**
```
if phase === "scraping" → render <ProgressTracker stage="scraping" />
if phase === "analyzing" → render <ProgressTracker stage="analyzing" />
if phase === "done" → render full dashboard
if phase === "error" → render error state with retry button
```

### 6.9 components/ProgressTracker.tsx

**Props:** `stage: "scraping" | "analyzing"`

**Scraping stage shows these steps with animated checkmarks as they complete:**
- "Fetching your listing..."
- "Fetching competitor listings..."
- "Gathering customer reviews..."

**Analyzing stage shows:**
- "Extracting competitor claims..."
- "Clustering customer voices..."
- "Building gap report..."
- "Writing UGC scripts..."
- "Generating insight summary..."

**Implementation note:** The backend calls don't stream progress — they return all at once. So simulate progress visually: tick each step off on a timer (every 4 seconds) while the actual API call is pending. When the API call returns, immediately tick all remaining steps and advance. This feels like real progress without requiring WebSockets.

### 6.10 The Results Dashboard

**Layout:** Full-width page with:
- Product name at top (extracted from listing title)
- `InsightSummary` component pinned below the product name (always visible)
- Three-tab navigation: "Gap Report" | "Customer Voices" | "UGC Scripts"
- Tab content area below

### 6.11 components/tabs/GapReportTab.tsx

**Section 1: Gap Matrix Table**

A table with columns: Claim | Category | You | Comp 1 | Comp 2 | Comp 3 | Priority

Each row is one `ClaimItem`. The You/Comp columns show ✅ or ❌. The Priority column shows a badge: "HIGH" (3 competitors have it, you don't), "MEDIUM" (2 competitors), "LOW" (1 competitor or you already have it).

Sort: HIGH priority rows first, then MEDIUM, then LOW. Top 5 HIGH priority rows have a highlighted background.

**Section 2: Rewritten Bullets**

Two-column layout:
- Left column: "Your Current Bullets" (5 original bullets)
- Right column: "Rewritten Bullets" (5 rewritten bullets from gapReport)

Each rewritten bullet that closes a gap has the gap-closing text highlighted (use a yellow/amber highlight on those specific words).

"Copy All Rewritten Bullets" button at the bottom — copies all 5 as a formatted text block to clipboard.

### 6.12 components/tabs/VoiceOfCustomerTab.tsx

**Layout:** Grid of cluster cards (2 columns on desktop, 1 on mobile)

**Each cluster card shows:**
- Cluster name in large text ("The Skeptic")
- Cluster description (one sentence)
- Size badge ("~28% of reviews")
- 3-4 key phrases as pill/badge components
- 2 sample quotes in italic, visually distinguished
- Footer line: "Current bullet addressing this: [bullet text]" OR "⚠️ No current bullet speaks to this audience"

**The "⚠️ No current bullet" indicator is important** — it visually shows the seller which customer segments they're ignoring.

### 6.13 components/tabs/UGCScriptsTab.tsx

**Layout:** Vertical stack of script cards (one per script)

**Each script card:**
- Header: Script title ("Script 2: The Researcher") + gap tag badge ("Closes gap: Third-party testing")
- Collapsible sections for each part:
  - 🎬 HOOK (first 3 seconds)
  - 😔 PROBLEM SETUP
  - 📦 INTRODUCE PRODUCT
  - ✨ TRANSFORMATION
  - 👆 CALL TO ACTION
- Stage direction in a separate box with camera icon, different background color
- "Copy Script" button per card — copies the full formatted script to clipboard
- Running time estimate badge: "~30 seconds"

**Default state:** First script is expanded. Others are collapsed. User expands to read.

### 6.14 components/InsightSummary.tsx

**Visual treatment:** A distinct full-width card at the top of the results page, visually separated from the tabs. Use a different background color or a left border accent to make it feel like a "consultant's memo."

**Contents:**
- Small label: "STRATEGIC SUMMARY"
- The 3-5 sentence paragraph
- Divider
- Bold label: "YOUR #1 PRIORITY:"
- The `priorityAction` sentence in larger text

---

## 7. ERROR HANDLING STRATEGY

Handle these failure modes explicitly:

| Failure | Cause | User-facing message | Recovery |
|---|---|---|---|
| Invalid Amazon URL | User typed wrong URL | "That doesn't look like an Amazon product URL. Check that it contains amazon.com and a product ID." | Stay on input page, highlight field |
| Firecrawl scrape fails | Amazon blocked, URL wrong, Firecrawl limit hit | "Couldn't fetch that listing. Try a different URL or check your internet connection." | Show retry button |
| Competitor scrape fails (partial) | One competitor URL blocked | "Couldn't fetch Competitor 2 — continuing with available data." | Non-fatal, continue analysis with fewer competitors |
| Claude API error | Rate limit, key invalid, timeout | "AI analysis failed. Please try again in a moment." | Retry button reruns only `/api/analyze` with cached scrape data |
| Claude returns invalid JSON | Prompt hallucination | Fallback: retry once with "return ONLY valid JSON, no markdown" prefix | If second attempt fails, show partial results with error flag |
| Vercel timeout | Too many large pages | "Analysis timed out. Try with fewer competitor URLs." | Show retry with suggestion to remove a competitor URL |

---

## 8. ENVIRONMENT VARIABLES

File: `.env.local` (gitignored)
```
FIRECRAWL_API_KEY=fc-xxxxxxxxxxxx
GEMINI_API_KEY=sk-ant-xxxxxxxxxxxx
```

File: `.env.example` (committed to repo)
```
FIRECRAWL_API_KEY=your_firecrawl_key_here
GEMINI_API_KEY=your_anthropic_key_here
```

Never expose these keys client-side. All API calls that use these keys happen in `/app/api/` routes only (server-side). The browser never touches the keys.

---

## 9. BUILD ORDER — Exact Sequence for AI Agent

Build in this exact order. Each step is independently testable before moving to the next.

### Phase 1: Project Scaffold (30 min)
1. `npx create-next-app@latest listingiq --typescript --tailwind --app` 
2. Install dependencies: `npm install framer-motion lucide-react`
3. Install shadcn: `npx shadcn-ui@latest init` → select default theme
4. Add shadcn components: `npx shadcn-ui@latest add tabs card badge progress button input`
5. Create all folder structure (all empty files) as specified in section 3
6. Define all TypeScript interfaces in `lib/types.ts`
7. Create `.env.local` with real keys, `.env.example` with placeholders
8. Verify `npm run dev` starts without errors

### Phase 2: Firecrawl Integration (45 min)
1. Write `lib/firecrawl.ts` — both functions
2. Test `scrapeListingPage` with a real Amazon URL in isolation (write a small test script)
3. Test `scrapeReviews` with a real Amazon URL — verify you get review objects back
4. Log the raw markdown output — understand the structure before moving on
5. Adjust the markdown parsing logic based on what you actually see

### Phase 3: Claude Prompts + Wrapper (60 min)
1. Write all 5 prompts in `lib/prompts.ts`
2. Test each prompt manually in Claude.ai first — paste in sample scrape data and verify the JSON output shape matches the TypeScript types
3. Adjust prompts until the JSON output is clean and parseable
4. Write `lib/claude.ts` base function + 5 exported functions
5. Test one Claude function in isolation with hardcoded sample data

### Phase 4: API Routes (45 min)
1. Write `app/api/scrape/route.ts` — implement the parallel Firecrawl calls
2. Test with Postman or curl: POST to `/api/scrape` with a real Amazon URL, verify `ScrapeResult` comes back
3. Write `app/api/analyze/route.ts` — implement the 5-step Claude orchestration
4. Test with the `ScrapeResult` from step 2: POST to `/api/analyze`, verify `AnalysisResult` comes back
5. Console log the full results — read them and check quality before building UI

### Phase 5: Input Page + Navigation (30 min)
1. Write `components/InputForm.tsx`
2. Write `app/page.tsx` with the form, validation, sessionStorage write, and navigation
3. Test: fill in a URL, submit, verify you land on `/analyze` and the URLs are in sessionStorage

### Phase 6: Processing State + Progress UI (30 min)
1. Write `components/ProgressTracker.tsx` with the timer-based step animation
2. Write the `app/analyze/page.tsx` state machine (phase transitions, API calls on mount)
3. Test: submit from input page, watch the progress tracker animate while API calls run
4. Verify phase transitions correctly from scraping → analyzing → done

### Phase 7: Results Dashboard (90 min)
Build tabs in this order:

1. `components/InsightSummary.tsx` — simplest, just renders a paragraph
2. `components/tabs/GapReportTab.tsx` — the table and rewritten bullets
3. `components/tabs/VoiceOfCustomerTab.tsx` — the cluster cards grid
4. `components/tabs/UGCScriptsTab.tsx` — the collapsible script cards
5. Wire all tabs into `app/analyze/page.tsx`
6. Test the full end-to-end flow: input → progress → results on all 3 tabs

### Phase 8: Polish + Copy (30 min)
1. Add copy-to-clipboard functionality on rewritten bullets and scripts
2. Add "Try with example" button on input form
3. Add error states and retry buttons
4. Verify mobile layout is usable (Tailwind responsive classes)

### Phase 9: Deploy (20 min)
1. Push to GitHub (public repo)
2. Connect repo to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy and test the live URL
5. Run one full end-to-end test on the live URL

---

## 10. DEMO SCRIPT (for 3-minute video)

**0:00 - 0:20** — Problem statement: "Amazon sellers spend hours manually reading competitor listings and reviews. Nobody synthesizes it into ready-to-use content."

**0:20 - 0:40** — Show the input page. Paste a real Amazon supplement URL + 2 competitor URLs. Hit Analyze. Show the progress tracker animating.

**0:40 - 1:20** — Show Tab 1 (Gap Report). Point at the matrix. Show the ❌ marks. Show one rewritten bullet with the gap-closing text highlighted. Click "Copy All."

**1:20 - 2:00** — Show Tab 2 (Customer Voices). Click on "The Skeptic" cluster card. Read one sample quote. Point at the ⚠️ "no bullet addresses this" warning.

**2:00 - 2:40** — Show Tab 3 (UGC Scripts). Expand Script 1. Read the hook aloud. Point at the gap tag. Show the stage direction.

**2:40 - 3:00** — Show the Insight Summary at the top. Read the priority action. Close with: "This entire analysis — competitor gaps, customer voice, and 5 ready-to-film scripts — runs in under 60 seconds from a single URL."

---

## 11. INTERVIEW TALKING POINTS

**On architecture decisions:**
> "I separated scraping and analysis into two API calls so that if the AI analysis needs to be retried, we don't have to re-scrape Amazon. The scrape result is cached in component state."

**On the Claude prompt design:**
> "The most important decision was making Calls 1 and 2 independent so they can run in parallel. Claims extraction doesn't need review data, and review clustering doesn't need listing data. That cuts the analysis time roughly in half."

**On Firecrawl choice:**
> "Raw fetch calls to Amazon get blocked immediately. Firecrawl handles JavaScript rendering and anti-bot headers, which is why I used it over writing my own scraper."

**On the combination insight:**
> "Either tool alone is useful. But the magic is in Call 4 — the script generation prompt receives BOTH the review clusters AND the top gaps. That's why each script isn't just authentic customer language — it's authentic customer language targeted at the exact gap your competitors are exploiting."

**On limitations (shows maturity):**
> "This is a point-in-time snapshot. The real production version would run this weekly and track gap scores over time — so you'd know if a competitor added 'third-party tested' to their title last Tuesday. That's the roadmap, not a flaw."

---

## 12. README.md CONTENT (for GitHub)

The README should contain:
1. One-line description
2. Screenshot of the results dashboard
3. How to run locally (clone, add .env keys, npm install, npm run dev)
4. How to deploy (Vercel one-click deploy button)
5. Architecture overview (3 sentences)
6. Tools used: Firecrawl, Google Gemini API, Next.js, Vercel
7. Link to live demo
```