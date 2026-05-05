"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Loader2, Target, Flame, ChevronRight } from "lucide-react";

export default function InputForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [yourURL, setYourURL] = useState("");
  const [competitor1, setCompetitor1] = useState("");
  const [competitor2, setCompetitor2] = useState("");
  const [competitor3, setCompetitor3] = useState("");
  const [showComp2, setShowComp2] = useState(false);
  const [showComp3, setShowComp3] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!yourURL || !yourURL.includes("amazon.com")) {
      alert("Please enter a valid Amazon URL for your listing.");
      return;
    }

    setLoading(true);
    const inputData = {
      yourURL,
      competitorURL1: competitor1,
      competitorURL2: competitor2,
      competitorURL3: competitor3,
    };

    sessionStorage.setItem("listingiq_input", JSON.stringify(inputData));
    router.push("/analyze");
  };

  const handleExample = () => {
    setYourURL("https://www.amazon.com/dp/B0013OQGO6"); // NOW Magnesium
    setCompetitor1("https://www.amazon.com/dp/B000BD0RT0"); // Nature's Bounty
    setShowComp2(true);
    setCompetitor2("https://www.amazon.com/dp/B07S65S67N"); // Garden of Life
  };

  return (
    <Card className="w-full border-none shadow-none bg-vanilla/50">
      <CardHeader className="bg-prussian px-8 py-12 space-y-3 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-5">
            <Target className="w-32 h-32 text-vanilla" />
        </div>
        <div className="flex items-center gap-3 text-maize relative z-10">
          <Target className="w-5 h-5" />
          <span className="text-[10px] font-black uppercase tracking-[0.3em]">Audit Calibration</span>
        </div>
        <CardTitle className="text-4xl font-heading text-vanilla leading-none uppercase tracking-tighter relative z-10">
          Target Parameters
        </CardTitle>
        <CardDescription className="text-vanilla/60 font-medium text-lg leading-relaxed max-w-md relative z-10">
          Initialize the engine by providing your product URL and key market competitors.
        </CardDescription>
      </CardHeader>
      
      <CardContent className="p-8 lg:p-12 bg-vanilla">
        <form onSubmit={handleSubmit} className="space-y-12">
          <div className="space-y-4">
            <label className="text-xs font-black text-prussian uppercase tracking-[0.2em] flex items-center gap-2.5">
              <div className="w-2 h-2 bg-fire rounded-full" />
              Primary Product Listing
            </label>
            <div className="relative group">
              <Input
                placeholder="https://www.amazon.com/dp/..."
                value={yourURL}
                onChange={(e) => setYourURL(e.target.value)}
                required
                className="h-16 border-2 border-prussian/10 bg-vanilla focus-visible:ring-maize focus-visible:border-maize text-prussian font-medium rounded-2xl px-6 transition-all group-hover:border-prussian/20"
              />
            </div>
          </div>

          <div className="space-y-8">
            <div className="flex items-center justify-between border-b border-prussian/5 pb-2">
              <label className="text-xs font-black text-prussian uppercase tracking-[0.2em] flex items-center gap-2.5">
                <div className="w-2 h-2 bg-orange rounded-full" />
                Category Benchmarks
              </label>
              <span className="text-[10px] font-bold text-prussian/30 uppercase tracking-widest">3 Max</span>
            </div>
            
            <div className="grid gap-4">
              <Input
                placeholder="Competitor 1 URL (Recommended)"
                value={competitor1}
                onChange={(e) => {
                  setCompetitor1(e.target.value);
                  if (e.target.value && !showComp2) setShowComp2(true);
                }}
                className="h-14 border-2 border-prussian/10 bg-vanilla focus-visible:border-orange text-prussian rounded-xl px-5"
              />

              {showComp2 && (
                <Input
                  placeholder="Competitor 2 URL"
                  value={competitor2}
                  onChange={(e) => {
                    setCompetitor2(e.target.value);
                    if (e.target.value && !showComp3) setShowComp3(true);
                  }}
                  className="h-14 border-2 border-prussian/10 bg-vanilla focus-visible:border-orange text-prussian rounded-xl px-5 animate-in slide-in-from-top-4"
                />
              )}

              {showComp3 && (
                <Input
                  placeholder="Competitor 3 URL"
                  value={competitor3}
                  onChange={(e) => setCompetitor3(e.target.value)}
                  className="h-14 border-2 border-prussian/10 bg-vanilla focus-visible:border-orange text-prussian rounded-xl px-5 animate-in slide-in-from-top-4"
                />
              )}
            </div>

            {!showComp3 && (
              <button
                type="button"
                className="text-orange hover:text-fire text-xs font-black uppercase tracking-widest flex items-center gap-2 px-1 transition-all group"
                onClick={() => {
                  if (!showComp2) setShowComp2(true);
                  else setShowComp3(true);
                }}
              >
                <div className="p-1 bg-orange/10 rounded-md group-hover:bg-fire/10 transition-colors">
                    <Plus className="w-4 h-4 stroke-[3px]" />
                </div>
                Add comparison point
              </button>
            )}
          </div>

          <div className="pt-8 flex flex-col gap-6">
            <Button 
              type="submit" 
              className="w-full bg-fire hover:bg-prussian text-vanilla font-black uppercase tracking-[0.25em] h-20 rounded-2xl shadow-2xl shadow-fire/30 transition-all duration-500 active:scale-[0.98] group flex items-center justify-center border-b-8 border-prussian/20" 
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-4 h-6 w-6 animate-spin" />
                  Calibrating System...
                </>
              ) : (
                <>
                  <Flame className="w-6 h-6 mr-4 fill-current group-hover:animate-pulse transition-all" />
                  Run Intelligence Audit
                  <ChevronRight className="w-6 h-6 ml-4 opacity-30 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </Button>
            
            <button
              type="button"
              className="text-prussian/40 hover:text-prussian text-xs font-bold uppercase tracking-[0.2em] py-3 transition-colors flex items-center justify-center gap-2"
              onClick={handleExample}
              disabled={loading}
            >
              <div className="w-1 h-1 bg-prussian/20 rounded-full" />
              Load Industry Sample (Magnesium)
              <div className="w-1 h-1 bg-prussian/20 rounded-full" />
            </button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
