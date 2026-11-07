"use client";

import React from "react";
import { Sparkles } from "lucide-react";

const phrases = [
  "BLACK STORE",
  "STREETWEAR DE ELITE",
  "ALFAIATARIA CONTEMPORÂNEA",
  "SNEAKER CULTURE",
  "CAIMENTO IMPECÁVEL",
  "EDIÇÕES LIMITADAS",
  "ATENDIMENTO VIP",
  "QUALIDADE & PRESENÇA",
];

export function BrandMarquee() {
  return (
    <div className="relative w-full py-4 bg-brand-surface border-y border-brand-border/60 overflow-hidden select-none">
      {/* Sombras de fade nas bordas esquerda e direita */}
      <div className="absolute left-0 inset-y-0 w-16 sm:w-28 bg-gradient-to-r from-brand-surface to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 inset-y-0 w-16 sm:w-28 bg-gradient-to-l from-brand-surface to-transparent z-10 pointer-events-none" />

      <div className="animate-marquee flex items-center gap-8">
        {[...phrases, ...phrases].map((item, idx) => (
          <div key={idx} className="flex items-center gap-8 shrink-0">
            <span className="font-display text-sm sm:text-base font-bold uppercase tracking-[0.22em] text-brand-silver/90 hover:text-brand-white transition-colors">
              {item}
            </span>
            <Sparkles className="w-3.5 h-3.5 text-brand-silver/40 shrink-0" />
          </div>
        ))}
      </div>
    </div>
  );
}
