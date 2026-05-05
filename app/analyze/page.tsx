"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AppState, ScrapeInput } from "@/lib/types";
import ProgressTracker from "@/components/ProgressTracker";
import { Button } from "@/components/ui/button";
import { AlertCircle, ArrowLeft, RotateCcw, Share2, Printer, ShieldAlert, Check } from "lucide-react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import InsightSummary from "@/components/InsightSummary";
import GapReportTab from "@/components/tabs/GapReportTab";
import VoiceOfCustomerTab from "@/components/tabs/VoiceOfCustomerTab";
import UGCScriptsTab from "@/components/tabs/UGCScriptsTab";
import { AnalysisResult, ScrapeResult } from "@/lib/types";
import Link from "next/link";

const ResultsDashboard = ({ 
  result, 
  scrapeResult 
}: { 
  result: AnalysisResult; 
  scrapeResult: ScrapeResult 
}) => {
  const [dispatching, setDispatching] = useState(false);
  const [dispatched, setDispatched] = useState(false);

  const handleDispatch = () => {
    setDispatching(true);
    const summary = `
LISTING IQ ANALYSIS REPORT: ${result.productName}
--------------------------------------------------
EXECUTIVE ASSESSMENT:
${result.insightSummary.paragraph}

PRIORITY ACTION:
${result.insightSummary.priorityAction}

Full report available in the ListingIQ terminal.
    `.trim();

    navigator.clipboard.writeText(summary).then(() => {
      setDispatching(false);
      setDispatched(true);
      setTimeout(() => setDispatched(false), 2000);
    }).catch(() => setDispatching(false));
  };

  return (
    <div className="min-h-screen bg-vanilla">
      {/* Top Brand Bar */}
      <div className="bg-prussian text-vanilla py-4 px-8 flex justify-between items-center shadow-2xl border-b-4 border-fire/20">
        <Link href="/" className="font-heading text-2xl tracking-tighter hover:text-maize transition-colors">
          Listing<span className="text-fire">IQ</span>
        </Link>
        <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest opacity-60">
          <span className="hidden sm:inline">Precision Intelligence Terminal v2.0</span>
          <div className="w-2 h-2 rounded-full bg-fire animate-pulse" />
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-6 md:p-12 space-y-16 pb-32">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-10 border-b-2 border-prussian/10 pb-12">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-fire font-black text-xs uppercase tracking-[0.25em]">
              <ShieldAlert className="w-4 h-4" /> Behavioral Audit Result
            </div>
            <h1 className="text-5xl md:text-6xl font-heading text-prussian leading-none tracking-tighter">
              {result.productName}
            </h1>
            <p className="font-sans text-base text-orange font-medium">Market context intelligence report.</p>
          </div>
          <div className="flex gap-4">
            <Button variant="outline" className="border-2 border-prussian/20 bg-vanilla text-prussian font-black uppercase text-[10px] tracking-widest hover:bg-prussian hover:text-vanilla h-12 px-6" onClick={() => window.print()}>
              <Printer className="w-4 h-4 mr-2" /> PDF Export
            </Button>
            <Button 
              className="bg-orange hover:bg-fire text-prussian hover:text-vanilla font-black uppercase text-[10px] tracking-widest h-12 px-6 shadow-xl transition-all"
              onClick={handleDispatch}
            >
              {dispatching ? (
                <>Dispatching...</>
              ) : dispatched ? (
                <><Check className="w-4 h-4 mr-2" /> Dispatched!</>
              ) : (
                <><Share2 className="w-4 h-4 mr-2" /> Dispatch Result</>
              )}
            </Button>
          </div>
        </div>

        <InsightSummary insight={result.insightSummary} />

        <Tabs defaultValue="gap" className="w-full">
          <TabsList className="flex gap-10 bg-transparent border-b-2 border-prussian/5 w-full justify-start h-auto p-0 rounded-none mb-12 overflow-x-auto no-scrollbar">
            <TabsTrigger value="gap" className="pb-4 px-2 rounded-none border-b-4 border-transparent data-[state=active]:border-fire data-[state=active]:bg-transparent data-[state=active]:text-prussian font-heading text-lg uppercase tracking-tight text-prussian/50 transition-all whitespace-nowrap">
              Market Gap Matrix
            </TabsTrigger>
            <TabsTrigger value="voc" className="pb-4 px-2 rounded-none border-b-4 border-transparent data-[state=active]:border-orange data-[state=active]:bg-transparent data-[state=active]:text-prussian font-heading text-lg uppercase tracking-tight text-prussian/50 transition-all whitespace-nowrap">
              Customer Voice
            </TabsTrigger>
            <TabsTrigger value="ugc" className="pb-4 px-2 rounded-none border-b-4 border-transparent data-[state=active]:border-maize data-[state=active]:bg-transparent data-[state=active]:text-prussian font-heading text-lg uppercase tracking-tight text-prussian/50 transition-all whitespace-nowrap">
              UGC Storyboards
            </TabsTrigger>
          </TabsList>
        
          <div className="focus-visible:outline-none">
            <TabsContent value="gap">
              <GapReportTab gapReport={result.gapReport} originalBullets={scrapeResult.yourListing.bullets} />
            </TabsContent>
            <TabsContent value="voc">
              <VoiceOfCustomerTab voc={result.voiceOfCustomer} />
            </TabsContent>
            <TabsContent value="ugc">
              <UGCScriptsTab scripts={result.ugcScripts} />
            </TabsContent>
          </div>
        </Tabs>

        <footer className="pt-20 border-t-2 border-prussian/5 flex flex-col sm:flex-row items-center justify-between gap-6 text-[10px] font-black uppercase tracking-[0.4em] text-prussian/20">
          <p>© 2026 ListingIQ. Terminal Session Terminated.</p>
          <div className="flex gap-10">
            <Link href="/" className="hover:text-fire transition-colors">Initiate New Audit</Link>
            <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="hover:text-orange transition-colors">Return to Top</button>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default function AnalyzePage() {
  const router = useRouter();
  const [state, setState] = useState<AppState>({
    phase: "input",
    scrapeProgress: [],
    analyzeProgress: [],
    scrapeResult: null,
    analysisResult: null,
    error: null,
  });

  const startAnalysis = async (input: ScrapeInput) => {
    try {
      setState((prev) => ({ ...prev, phase: "scraping" }));
      const scrapeResponse = await fetch("/api/scrape", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });

      if (!scrapeResponse.ok) {
        const error = await scrapeResponse.json();
        throw new Error(error.error || "Scraping failed");
      }

      const scrapeResult = await scrapeResponse.json();
      setState((prev) => ({ ...prev, scrapeResult }));

      setState((prev) => ({ ...prev, phase: "analyzing" }));
      const analyzeResponse = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ scrapeResult }),
      });

      if (!analyzeResponse.ok) {
        const error = await analyzeResponse.json();
        throw new Error(error.error || "Analysis failed");
      }

      const analysisResult = await analyzeResponse.json();
      setState((prev) => ({ ...prev, analysisResult, phase: "done" }));
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "An unexpected error occurred";
      setState((prev) => ({ ...prev, phase: "error", error: message }));
    }
  };

  useEffect(() => {
    const inputStr = sessionStorage.getItem("listingiq_input");
    if (!inputStr) {
      router.push("/");
      return;
    }

    const input: ScrapeInput = JSON.parse(inputStr);
    const run = async () => {
      await startAnalysis(input);
    };
    run();
  }, [router]);

  const handleRetry = () => {
    const inputStr = sessionStorage.getItem("listingiq_input");
    if (inputStr) {
      startAnalysis(JSON.parse(inputStr));
    }
  };

  return (
    <div className="min-h-screen bg-vanilla">
      {state.phase === "scraping" && (
        <div className="flex flex-col items-center justify-center min-h-[90vh]">
          <ProgressTracker stage="scraping" />
        </div>
      )}

      {state.phase === "analyzing" && (
        <div className="flex flex-col items-center justify-center min-h-[90vh]">
          <ProgressTracker stage="analyzing" />
        </div>
      )}

      {state.phase === "done" && state.analysisResult && state.scrapeResult && (
        <ResultsDashboard result={state.analysisResult} scrapeResult={state.scrapeResult} />
      )}

      {state.phase === "error" && (
        <div className="flex flex-col items-center justify-center min-h-[90vh] p-6 text-center space-y-10">
          <div className="bg-fire/5 p-10 rounded-full border-4 border-fire/10">
            <AlertCircle className="w-20 h-16 text-fire" />
          </div>
          <div className="space-y-4">
            <h2 className="text-5xl font-heading text-prussian uppercase tracking-tighter">System Error</h2>
            <p className="text-prussian/60 max-w-md text-lg font-medium italic mx-auto">{state.error}</p>
          </div>
          <div className="flex gap-4">
            <Button variant="outline" onClick={() => router.push("/")} className="border-2 border-prussian text-prussian font-black uppercase text-[10px] tracking-widest px-10 h-14">
              <ArrowLeft className="w-4 h-4 mr-2" /> Reset
            </Button>
            <Button onClick={handleRetry} className="bg-fire hover:bg-prussian text-vanilla font-black uppercase text-[10px] tracking-widest px-10 h-14 shadow-2xl transition-all">
              <RotateCcw className="w-4 h-4 mr-2" /> Re-Attempt
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
