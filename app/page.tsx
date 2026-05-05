"use client";

import InputForm from "@/components/InputForm";
import { Sparkles, Trophy, Users, BarChart3 } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-vanilla selection:bg-orange/20 font-sans">
      <main className="max-w-6xl mx-auto px-6 py-20 lg:py-32 space-y-24">
        {/* Hero Section */}
        <div className="flex flex-col items-center text-center space-y-10">
          <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-prussian text-vanilla text-[10px] font-black uppercase tracking-widest shadow-lg">
            <Sparkles className="w-3 h-3 fill-maize text-maize" />
            Competitive Intelligence Engine
          </div>
          
          <div className="space-y-4">
            <h1 className="text-7xl sm:text-9xl font-heading text-prussian leading-[0.85] tracking-tighter">
              Listing<span className="text-fire">IQ</span>
            </h1>
            <p className="font-sans text-xl text-orange leading-tight font-medium">
              Your customers wrote the script.
            </p>
          </div>

          <p className="text-lg sm:text-xl text-prussian/70 max-w-2xl mx-auto font-medium leading-relaxed">
            Uncover the strategic advantages held by market leaders and 
            <span className="text-fire font-bold px-1">calibrate your brand</span> using real-world customer sentiment.
          </p>
        </div>

        {/* Feature Grid - Minimalist */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <FeatureCard 
            icon={<Trophy className="w-5 h-5 text-fire" />} 
            title="Competitor Benchmarking" 
            desc="Identify every claim and feature gap that separates you from the category leaders."
          />
          <FeatureCard 
            icon={<Users className="w-5 h-5 text-orange" />} 
            title="Persona Clustering" 
            desc="Deep-dive psychographic mapping based on thousands of historical review data points."
          />
          <FeatureCard 
            icon={<BarChart3 className="w-5 h-5 text-maize" />} 
            title="Conversion Scripting" 
            desc="Turn customer pain points into high-performing UGC scripts for Reels and TikTok."
          />
        </div>

        {/* Form Section - Integrated look */}
        <section className="max-w-3xl mx-auto bg-prussian rounded-[2rem] p-1 shadow-2xl shadow-prussian/20 overflow-hidden">
          <div className="bg-vanilla/95 backdrop-blur-md">
            <InputForm />
          </div>
        </section>

        {/* Footer - Professional & Muted */}
        <footer className="pt-16 border-t border-prussian/5 flex flex-col sm:flex-row items-center justify-between gap-6 text-prussian/40">
          <p className="text-xs font-bold uppercase tracking-[0.2em]">© 2026 ListingIQ Precision Analytics</p>
          <div className="flex gap-8 text-[10px] font-black uppercase tracking-widest">
            <a href="#" className="hover:text-fire transition-colors">Privacy Protocol</a>
            <a href="#" className="hover:text-fire transition-colors">Documentation</a>
          </div>
        </footer>
      </main>
    </div>
  );
}

function FeatureCard({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <div className="p-10 rounded-[2.5rem] surface-border flex flex-col items-center text-center space-y-6 hover:bg-maize/5 transition-all duration-500 group border-2 border-prussian/5 hover:border-orange/20 hover:shadow-2xl hover:shadow-orange/5">
      <div className="p-4 bg-prussian text-vanilla rounded-2xl group-hover:scale-110 group-hover:bg-fire transition-all duration-500 shadow-lg">{icon}</div>
      <div className="space-y-3">
        <h3 className="text-xl font-heading text-prussian leading-none uppercase tracking-tight group-hover:text-fire transition-colors">{title}</h3>
        <p className="text-sm text-prussian/60 leading-relaxed font-medium max-w-[200px]">{desc}</p>
      </div>
    </div>
  );
}
