import { GapReport, ClaimItem } from "@/lib/types";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Check, Copy, Minus, Trophy, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export default function GapReportTab({ gapReport, originalBullets }: { gapReport: GapReport; originalBullets: string[] }) {
  const copyBullets = () => {
    navigator.clipboard.writeText((gapReport.rewrittenBullets || []).join("\n"));
  };

  const getPriority = (item: ClaimItem) => {
    if (item.competitorCount >= 2 && !item.presentInYours) return { label: "CRITICAL", class: "bg-fire text-vanilla" };
    if (item.competitorCount >= 1 && !item.presentInYours) return { label: "URGENT", class: "bg-orange text-vanilla" };
    return { label: "STABLE", class: "bg-prussian/10 text-prussian/60" };
  };

  return (
    <div className="space-y-24">
      <section className="space-y-8">
        <Accordion type="single" collapsible>
          <AccordionItem value="matrix" className="border-none">
            <AccordionTrigger className="hover:no-underline p-0 py-2 group/trigger [&>svg]:hidden">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 border-l-8 border-fire pl-8 text-left w-full group">
                <div className="space-y-1">
                  <h3 className="text-3xl font-heading text-prussian uppercase tracking-tighter flex items-center gap-3">
                    <Trophy className="w-8 h-8 text-fire" />
                    Strategic Advantage Matrix
                  </h3>
                  <p className="text-prussian/60 font-medium text-xs font-sans">Mapping every market assertion against your brand.</p>
                </div>
                <div className="flex items-center gap-4 bg-prussian text-vanilla px-6 py-3 rounded-full border-2 border-fire group-hover:bg-fire group-hover:text-vanilla transition-all duration-300 shadow-lg group-hover:shadow-fire/20 active:scale-95">
                  <span className="text-[10px] font-black uppercase tracking-widest">View Analysis</span>
                  <div className="transition-transform duration-300 group-aria-expanded/trigger:rotate-180">
                    <ChevronDown className="w-4 h-4 stroke-[3px]" />
                  </div>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pt-8">
              <div className="border-4 border-prussian bg-vanilla shadow-[15px_15px_0px_0px_rgba(0,48,73,0.05)] overflow-hidden">
                <Table>
                  <TableHeader className="bg-prussian">
                    <TableRow className="border-none hover:bg-transparent">
                      <TableHead className="w-[400px] text-vanilla font-black uppercase tracking-widest text-[10px] py-6">Intelligence Point</TableHead>
                      <TableHead className="text-vanilla font-black uppercase tracking-widest text-[10px]">Classification</TableHead>
                      <TableHead className="text-center text-vanilla font-black uppercase tracking-widest text-[10px]">Your Stance</TableHead>
                      <TableHead className="text-center text-vanilla font-black uppercase tracking-widest text-[10px]">Competitor Density</TableHead>
                      <TableHead className="text-center text-vanilla font-black uppercase tracking-widest text-[10px]">Audit Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {(gapReport.claims || []).map((item, idx) => {
                      const priority = getPriority(item);
                      return (
                        <TableRow key={idx} className="border-b-2 border-prussian/5 hover:bg-vanilla transition-colors">
                          <TableCell className="font-heading text-lg text-prussian py-6">{item.claim}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className="text-[10px] font-black uppercase tracking-[0.2em] text-prussian/40 border-prussian/20">
                              {item.category}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-center">
                            {item.presentInYours ? (
                              <div className="w-10 h-10 bg-prussian text-vanilla flex items-center justify-center mx-auto border-2 border-prussian">
                                <Check className="w-5 h-5 stroke-[4px]" />
                              </div>
                            ) : (
                              <div className="w-10 h-10 bg-vanilla flex items-center justify-center mx-auto border-2 border-prussian/10">
                                <Minus className="w-5 h-5 text-prussian/20" />
                              </div>
                            )}
                          </TableCell>
                          <TableCell className="text-center">
                            <div className="flex justify-center gap-2">
                              {(item.presentInCompetitors || []).map((present, i) => (
                                <div
                                  key={i}
                                  className={`w-3 h-3 ${present ? "bg-orange" : "bg-prussian/5"} border-2 border-prussian/10`}
                                  title={`Competitor ${i + 1}`}
                                />
                              ))}
                            </div>
                          </TableCell>
                          <TableCell className="text-center">
                            <Badge className={`${priority.class} border-none font-black text-[9px] tracking-widest px-3 py-1`}>
                              {priority.label}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </section>

      <section className="space-y-10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 border-l-8 border-orange pl-8">
          <div className="space-y-1">
            <h3 className="text-3xl font-heading text-prussian uppercase tracking-tighter">Market-Closing Updates</h3>
            <p className="text-prussian/60 font-medium text-xs font-sans">Engine-optimized copy designed to neutralize competitor advantages and close your content gaps.</p>
          </div>
          <Button className="bg-prussian hover:bg-fire text-vanilla font-black uppercase text-[10px] tracking-widest h-12 px-8 shadow-xl transition-all" onClick={copyBullets}>
            <Copy className="w-4 h-4 mr-3" /> Export New Copy
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="space-y-6">
            <div className="bg-vanilla border-l-4 border-prussian/20 p-4 mb-6">
              <h4 className="text-[10px] font-black text-prussian/40 uppercase tracking-[0.3em] flex items-center gap-3 mb-2">
                Phase 01: Baseline
              </h4>
              <p className="text-xs text-prussian/60 font-medium">Your current listing bullet points as they appear on the marketplace.</p>
            </div>
            <div className="space-y-4">
              {originalBullets
                .filter(bullet => {
                  // Filter out links (markdown style [text](url))
                  const hasLink = /\[.*\]\(.*\)/.test(bullet);
                  // Filter out very short or empty strings (like single words or breadcrumbs)
                  return bullet.trim().length > 20 && !hasLink;
                })
                .map((bullet, i) => (
                  <div key={i} className="p-8 bg-vanilla border-2 border-prussian/5 text-[15px] text-prussian/50 leading-relaxed font-medium">
                    {bullet}
                  </div>
                ))}
              {originalBullets.filter(bullet => bullet.trim().length > 20 && !/\[.*\]\(.*\)/.test(bullet)).length === 0 && (
                <div className="p-8 bg-vanilla border-2 border-dashed border-prussian/10 text-[15px] text-prussian/30 italic text-center leading-relaxed font-medium">
                  No standard bullet points detected in the source listing.
                </div>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-fire/5 border-l-4 border-fire p-4 mb-6">
              <h4 className="text-[10px] font-black text-fire uppercase tracking-[0.3em] flex items-center gap-3 mb-2">
                Phase 02: Optimization
              </h4>
              <p className="text-xs text-fire/70 font-medium">Strategically rewritten bullets incorporating missing market claims to dominate competitors.</p>
            </div>
            <div className="space-y-4">
              {(gapReport.rewrittenBullets || []).map((bullet, i) => (
                <div key={i} className="p-8 bg-prussian text-vanilla text-[16px] leading-relaxed font-medium border-l-8 border-fire shadow-2xl shadow-prussian/20 relative group">
                  <div className="absolute top-0 right-0 p-4 opacity-5">
                    <Trophy className="w-12 h-12" />
                  </div>
                  <div className="flex gap-6">
                    <span className="text-fire font-black text-2xl font-heading shrink-0">0{i + 1}</span>
                    <span>{bullet}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
