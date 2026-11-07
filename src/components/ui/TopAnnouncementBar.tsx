"use client";

import React from "react";
import { Sparkles, MapPin, MessageCircle } from "lucide-react";
import { createWhatsAppLink } from "@/lib/whatsapp";

export function TopAnnouncementBar() {
  return (
    <aside
      aria-label="Aviso de disponibilidade"
      className="relative z-50 w-full bg-gradient-to-r from-[#0d0d10] via-[#17171d] to-[#0d0d10] border-b border-brand-border/60 py-2 px-4 text-center select-none"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-center gap-2 sm:gap-4 text-[11px] sm:text-xs uppercase tracking-widest text-brand-silver">
        <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
          Loja Física Aberta
        </span>
        <span className="hidden sm:inline text-brand-border">•</span>
        <span className="hidden sm:inline text-brand-white font-medium">
          Novo Drop Sneakers & Moda Masculina 2026
        </span>
        <span className="text-brand-border">•</span>
        <a
          href={createWhatsAppLink("Olá! Gostaria de saber quais peças do novo Drop estão disponíveis hoje.")}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 font-semibold text-brand-white hover:text-emerald-400 underline underline-offset-4 decoration-white/30 transition-colors"
        >
          <span>Atendimento VIP</span>
          <MessageCircle className="w-3 h-3 text-emerald-400" />
        </a>
      </div>
    </aside>
  );
}
