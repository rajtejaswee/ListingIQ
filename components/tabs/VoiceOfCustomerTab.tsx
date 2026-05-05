import { VoiceOfCustomerReport } from "@/lib/types";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, MessageSquare, Quote, Users } from "lucide-react";

export default function VoiceOfCustomerTab({ voc }: { voc: VoiceOfCustomerReport }) {
  return (
    <div className="space-y-16">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 border-l-8 border-orange pl-8">
        <div className="space-y-1">
          <h3 className="text-3xl font-heading text-prussian uppercase tracking-tighter flex items-center gap-4">
            <Users className="w-8 h-8 text-orange" />
            Psychographic Market Segments
          </h3>
          <p className="text-prussian/60 font-medium text-xs font-sans">Unlocking the emotional drivers behind every transaction.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {(voc.clusters || []).map((cluster, idx) => (
          <Card key={idx} className="border-4 border-prussian bg-vanilla rounded-none flex flex-col h-full shadow-[10px_10px_0px_0px_rgba(0,48,73,0.05)] hover:shadow-[15px_15px_0px_0px_rgba(247,127,0,0.1)] transition-all group overflow-hidden">
            <CardHeader className="pb-6 border-b-2 border-prussian/5 bg-vanilla/30">
              <div className="flex justify-between items-start gap-4">
                <CardTitle className="text-2xl font-heading text-prussian leading-none uppercase">{cluster.name}</CardTitle>
                <div className="flex flex-col items-end gap-1 shrink-0">
                  <span className="text-2xl font-heading text-fire">{cluster.size}%</span>
                  <span className="text-[9px] font-black text-prussian/40 uppercase tracking-widest">Prevalence</span>
                </div>
              </div>
              <p className="text-[17px] text-prussian/70 font-medium leading-relaxed italic mt-4 border-l-4 border-orange pl-4">&quot;{cluster.description}&quot;</p>
            </CardHeader>
            
            <CardContent className="space-y-10 flex-grow py-10">
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-[10px] font-black text-prussian/30 uppercase tracking-[0.3em]">
                  <MessageSquare className="w-4 h-4" /> Semantic Markers
                </div>
                <div className="flex flex-wrap gap-2">
                  {(cluster.keyPhrases || []).map((phrase, i) => (
                    <Badge key={i} variant="secondary" className="bg-prussian text-vanilla border-none px-3 py-1 font-black uppercase text-[9px] tracking-widest group-hover:bg-orange transition-colors">
                      {phrase}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex items-center gap-3 text-[10px] font-black text-prussian/30 uppercase tracking-[0.3em]">
                  <Quote className="w-4 h-4" /> Field Intelligence
                </div>
                <div className="space-y-5">
                  {(cluster.sampleQuotes || []).map((quote, i) => (
                    <div key={i} className="text-[15px] text-prussian/80 pl-6 border-l-2 border-prussian/10 leading-relaxed font-medium">
                      {quote}
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>

            <CardFooter className="bg-prussian py-6 px-8">
              {cluster.whichBulletSpeaksToThis ? (
                <div className="text-[11px] text-vanilla/60 flex items-start gap-3 leading-snug uppercase tracking-widest font-black">
                  <div className="w-2 h-2 bg-fire mt-1 shrink-0" />
                  <span>
                    <span className="text-fire mr-2">Secured by:</span> {cluster.whichBulletSpeaksToThis}
                  </span>
                </div>
              ) : (
                <div className="text-[11px] text-maize flex items-start gap-3 leading-snug uppercase tracking-widest font-black italic">
                  <AlertTriangle className="w-4 h-4 shrink-0 text-maize" />
                  <span>Vulnerability: No counter-measure detected in current copy.</span>
                </div>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
