"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, Loader2 } from "lucide-react";

interface Step {
  id: string;
  label: string;
}

const SCRAPE_STEPS: Step[] = [
  { id: "listing", label: "Scanning target listing..." },
  { id: "competitors", label: "Harvesting competitor claims..." },
  { id: "reviews", label: "Extracting sentiment data..." },
];

const ANALYZE_STEPS: Step[] = [
  { id: "claims", label: "Auditing market assertions..." },
  { id: "voices", label: "Mapping emotional clusters..." },
  { id: "gap", label: "Synthesizing gap matrix..." },
  { id: "scripts", label: "Generating script storyboards..." },
  { id: "insight", label: "Finalizing behavioral audit..." },
];

export default function ProgressTracker({ stage }: { stage: "scraping" | "analyzing" }) {
  const steps = stage === "scraping" ? SCRAPE_STEPS : ANALYZE_STEPS;
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const totalSteps = steps.length;
    const interval = setInterval(() => {
      setCurrentStepIndex((prev) => {
        if (prev < totalSteps - 1) return prev + 1;
        return prev;
      });
    }, 3500);

    return () => clearInterval(interval);
  }, [steps.length]);

  useEffect(() => {
    const targetProgress = ((currentStepIndex + 1) / steps.length) * 100;
    const timer = setTimeout(() => setProgress(targetProgress), 100);
    return () => clearTimeout(timer);
  }, [currentStepIndex, steps.length]);

  return (
    <div className="w-full max-w-xl mx-auto space-y-12 py-20 px-10 bg-vanilla border-4 border-prussian shadow-[20px_20px_0px_0px_rgba(0,48,73,0.15)]">
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-1 bg-prussian text-vanilla text-[10px] font-black uppercase tracking-[0.3em] mb-2">
          Engine: Llama-3 Active
        </div>
        <h2 className="text-4xl font-heading text-prussian leading-none uppercase tracking-tighter">
          {stage === "scraping" ? "Data Harvest" : "Intelligence Cycle"}
        </h2>
        <p className="font-sans text-sm text-orange font-medium uppercase tracking-widest">Processing market context in real-time.</p>
      </div>

      <div className="space-y-6">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center gap-6">
            <div className="shrink-0">
              {index < currentStepIndex ? (
                <div className="w-10 h-10 bg-fire rounded-none flex items-center justify-center border-2 border-prussian">
                  <CheckCircle2 className="w-6 h-6 text-vanilla" />
                </div>
              ) : index === currentStepIndex ? (
                <div className="w-10 h-10 bg-maize rounded-none flex items-center justify-center border-2 border-prussian shadow-[5px_5px_0px_0px_rgba(0,48,73,1)]">
                  <Loader2 className="w-6 h-6 text-prussian animate-spin" />
                </div>
              ) : (
                <div className="w-10 h-10 bg-vanilla rounded-none flex items-center justify-center border-2 border-prussian/20">
                  <div className="w-2 h-2 bg-prussian/20" />
                </div>
              )}
            </div>
            <span
              className={`text-xl font-heading uppercase tracking-tighter transition-colors duration-500 ${
                index === currentStepIndex ? "text-prussian" : index < currentStepIndex ? "text-prussian/40" : "text-prussian/20"
              }`}
            >
              {step.label}
            </span>
          </div>
        ))}
      </div>

      <div className="space-y-4 pt-6">
        <div className="h-4 bg-vanilla border-2 border-prussian p-0.5 overflow-hidden">
          <div 
            className="h-full bg-fire transition-all duration-1000 ease-out" 
            style={{ width: `${progress}%` }} 
          />
        </div>
        <div className="flex justify-between items-center text-[10px] font-black text-prussian/40 uppercase tracking-[0.2em]">
          <span>Audit Cycle</span>
          <span className="text-fire">{Math.round(progress)}% Processed</span>
        </div>
      </div>
    </div>
  );
}
