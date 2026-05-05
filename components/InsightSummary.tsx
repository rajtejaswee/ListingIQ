import { InsightSummary as InsightType } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, ShieldAlert, Lightbulb } from "lucide-react";

export default function InsightSummary({ insight }: { insight: InsightType }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
      <Card className="lg:col-span-2 border-4 border-prussian bg-vanilla shadow-[12px_12px_0px_0px_rgba(0,48,73,0.08)] rounded-none overflow-hidden border-prussian/10">
        <CardContent className="p-10 space-y-6">
          <div className="flex items-center gap-3 text-fire font-black text-[10px] uppercase tracking-[0.3em]">
            <Lightbulb className="w-5 h-5" /> Executive Assessment
          </div>
          <p className="text-2xl text-prussian leading-tight font-heading uppercase tracking-tighter">
            {insight.paragraph}
          </p>
        </CardContent>
      </Card>

      <Card className="bg-fire border-none shadow-[12px_12px_0px_0px_rgba(214,40,40,0.15)] rounded-none relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10">
            <TrendingUp className="w-24 h-24 text-vanilla" />
        </div>
        <CardContent className="p-10 h-full flex flex-col justify-between space-y-10 relative z-10">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-vanilla/60 font-black text-[10px] uppercase tracking-widest">
              Critical Priority
            </div>
            <h4 className="text-3xl font-heading text-vanilla leading-none uppercase tracking-tighter">
              {insight.priorityAction}
            </h4>
          </div>
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-prussian text-vanilla text-[10px] font-black uppercase tracking-[0.2em] w-fit shadow-2xl">
            <ShieldAlert className="w-4 h-4" /> Immediate Impact
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
