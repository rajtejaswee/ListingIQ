import { UGCScriptsReport, UGCScript } from "@/lib/types";
import { Camera, Copy, Play, Film, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useState } from "react";

export default function UGCScriptsTab({ scripts }: { scripts: UGCScriptsReport }) {
  const [copiedId, setCopiedId] = useState<number | null>(null);

  const copyScript = (script: UGCScript, idx: number) => {
    const text = `
TITLE: ${script.title}
GAP ADDRESSED: ${script.addressesGap}

🎬 HOOK: ${script.hook}
😔 PROBLEM: ${script.problemSetup}
📦 INTRODUCE: ${script.productIntro}
✨ TRANSFORMATION: ${script.transformation}
👆 CTA: ${script.cta}

🎥 STAGE DIRECTION: ${script.stageDirection}
    `.trim();
    
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(() => {
        setCopiedId(idx);
        setTimeout(() => setCopiedId(null), 2000);
      }).catch(err => {
        console.error('Failed to copy: ', err);
      });
    } else {
      // Fallback for older browsers
      const textArea = document.createElement("textarea");
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand('copy');
        setCopiedId(idx);
        setTimeout(() => setCopiedId(null), 2000);
      } catch (err) {
        console.error('Fallback copy failed: ', err);
      }
      document.body.removeChild(textArea);
    }
  };

  return (
    <div className="space-y-16">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 border-l-8 border-maize pl-8">
        <div className="space-y-1">
          <h3 className="text-3xl font-heading text-[#003049] uppercase tracking-tighter flex items-center gap-4">
            <Film className="w-8 h-8 text-maize" />
            UGC Content Architect
          </h3>
          <p className="text-prussian/60 font-medium text-xs font-sans">Engine-scripted storyboards for psychological resonance.</p>
        </div>
      </div>

      <Accordion className="w-full space-y-6">
        {(scripts.scripts || []).map((script, idx) => (
          <AccordionItem key={idx} value={`script-${idx}`} className="border-4 border-prussian bg-vanilla rounded-none shadow-[10px_10px_0px_0px_rgba(0,48,73,0.05)] overflow-hidden">
            <AccordionTrigger className="p-0 hover:no-underline group">
              <div className="w-full p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6 text-left">
                <div className="space-y-2">
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-fire text-vanilla rounded-none shadow-lg group-data-[state=open]:bg-prussian transition-colors">
                      <Play className="w-4 h-4 fill-current" />
                    </div>
                    <h4 className="text-2xl font-heading text-prussian uppercase tracking-tighter leading-none">{script.title}</h4>
                  </div>
                  <div className="flex items-center gap-2 text-[10px] font-black text-prussian/40 uppercase tracking-[0.2em] pl-14">
                    Addressing Vulnerability: <span className="text-orange">{script.addressesGap}</span>
                  </div>
                </div>
                <div className="hidden sm:block mr-8">
                   <span className="text-[10px] font-black uppercase tracking-widest text-prussian/20 group-data-[state=open]:text-fire transition-colors">
                     {idx === 0 ? "Featured Strategy" : `Storyboard 0${idx + 1}`}
                   </span>
                </div>
              </div>
            </AccordionTrigger>
            
            <AccordionContent className="p-0 border-t-4 border-prussian">
              <div className="p-8 sm:p-12 space-y-12">
                <div className="flex justify-end">
                  <Button
                    className="bg-prussian hover:bg-fire text-vanilla font-black uppercase text-[10px] tracking-widest h-10 px-6 shadow-xl transition-all rounded-none"
                    onClick={(e) => {
                      e.stopPropagation();
                      copyScript(script, idx);
                    }}
                  >
                    {copiedId === idx ? (
                      <><Check className="w-4 h-4 mr-3" /> Copied!</>
                    ) : (
                      <><Copy className="w-4 h-4 mr-3" /> Export Storyboard</>
                    )}
                  </Button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
                  <div className="lg:col-span-7 space-y-12 relative">
                    <div className="absolute left-[21px] top-4 bottom-4 w-1 bg-prussian/5" />
                    
                    <ScriptPhase label="The Hook" time="0.0s" content={script.hook} active />
                    <ScriptPhase label="The Conflict" time="3.5s" content={script.problemSetup} />
                    <ScriptPhase label="The Resolution" time="12.0s" content={script.productIntro} />
                    <ScriptPhase label="The Transformation" time="20.0s" content={script.transformation} />
                    <ScriptPhase label="The Call" time="28.0s" content={script.cta} />
                  </div>

                  <div className="lg:col-span-5 space-y-8">
                    <div className="p-10 bg-vanilla border-4 border-prussian space-y-6 shadow-2xl relative">
                      <div className="absolute -top-4 -right-4 w-12 h-12 bg-fire border-4 border-prussian flex items-center justify-center text-vanilla">
                        <Camera className="w-6 h-6" />
                      </div>
                      <div className="flex items-center gap-3 text-fire text-[10px] font-black uppercase tracking-[0.3em]">
                        Directorial Guidance
                      </div>
                      <p className="text-prussian text-xl leading-relaxed font-medium italic">
                        &quot;{script.stageDirection}&quot;
                      </p>
                    </div>
                    
                    <div className="p-10 border-4 border-dashed border-prussian/10 flex items-start gap-6 bg-prussian/5">
                      <div className="p-3 bg-prussian text-vanilla shrink-0">
                        <Film className="w-6 h-6" />
                      </div>
                      <p className="text-sm text-prussian/50 font-bold uppercase tracking-widest leading-relaxed">
                        <span className="text-fire block mb-2">Production Protocol:</span>
                        High-frequency cuts required. 4K vertical orientation. Mobile-first lighting.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}

function ScriptPhase({ label, time, content, active = false }: { label: string; time: string; content: string; active?: boolean }) {
  return (
    <div className="relative pl-16">
      <div className={`absolute left-0 top-1.5 w-11 h-11 border-4 border-prussian bg-vanilla flex items-center justify-center ${active ? 'bg-fire text-vanilla shadow-[5px_5px_0px_0px_rgba(0,48,73,1)]' : 'text-prussian/20'}`}>
        <span className="text-[10px] font-black">{time}</span>
      </div>
      <div className="flex items-center gap-4 mb-3">
        <span className={`text-[10px] font-black uppercase tracking-[0.3em] ${active ? 'text-fire' : 'text-prussian/30'}`}>{label}</span>
      </div>
      <p className={`text-2xl font-heading uppercase tracking-tighter leading-tight transition-colors duration-500 ${active ? 'text-prussian' : 'text-prussian/40'}`}>
        {content}
      </p>
    </div>
  );
}
