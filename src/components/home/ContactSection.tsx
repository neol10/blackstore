"use client";

import React from "react";
import Image from "next/image";
import { MessageCircle, Shield, ArrowUpRight } from "lucide-react";
import { InstagramIcon } from "@/components/ui/InstagramIcon";
import { siteConfig } from "@/config/site";
import { createWhatsAppLink } from "@/lib/whatsapp";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

export function ContactSection() {
  return (
    <section id="contato" className="py-24 bg-brand-surface relative overflow-hidden border-t border-brand-border/40">
      {/* Background Subtle Accent */}
      <div className="absolute inset-0 bg-subtle-noise opacity-30 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <ScrollReveal>
          <div className="max-w-4xl mx-auto text-center">
            
            <div className="inline-flex items-center justify-center p-2 mb-6 rounded-full bg-brand-black border border-brand-border">
              <div className="relative w-12 h-12 rounded-full overflow-hidden">
                <Image
                  src="/logo.jpg"
                  alt="BLACK STORE"
                  fill
                  className="object-contain"
                />
              </div>
            </div>

            <h2 className="font-display text-4xl sm:text-6xl font-bold uppercase tracking-tight text-brand-white mb-6 text-balance">
              Seu Próximo Look Está Aqui.
            </h2>

            <p className="text-brand-silver text-sm sm:text-base max-w-2xl mx-auto leading-relaxed mb-10 text-pretty">
              Conheça as coleções da Black Store e fale com nossa equipe para encontrar o que procura. Atendimento rápido e direto para tirar dúvidas sobre tamanhos, modelos e disponibilidade.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href={createWhatsAppLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 pl-8 pr-7 py-4 bg-brand-white text-brand-black text-xs font-bold uppercase tracking-widest hover:bg-brand-silver active:scale-[0.98] transition-[transform,background-color,color] duration-200 shadow-xl focus:outline-none focus:ring-2 focus:ring-brand-silver select-none"
              >
                <MessageCircle className="w-4 h-4 text-emerald-600 fill-emerald-600" />
                <span>Falar pelo WhatsApp</span>
              </a>

              <a
                href={siteConfig.instagram.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group w-full sm:w-auto inline-flex items-center justify-center gap-2 pl-8 pr-7 py-4 bg-brand-black text-brand-silver border border-brand-border text-xs font-semibold uppercase tracking-widest hover:border-brand-silver hover:text-brand-white active:scale-[0.98] transition-[transform,border-color,color] duration-200 focus:outline-none focus:ring-2 focus:ring-brand-silver select-none"
              >
                <InstagramIcon className="w-4 h-4" />
                <span>Acompanhar no Instagram</span>
                <ArrowUpRight className="w-3.5 h-3.5 opacity-60 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100" />
              </a>
            </div>

            {/* Institutional note */}
            <div className="mt-12 pt-8 border-t border-brand-border/50 flex flex-wrap items-center justify-center gap-8 text-[11px] uppercase tracking-widest text-brand-muted">
              <span>Canal Oficial: {siteConfig.whatsapp.displayNumber}</span>
              <span>•</span>
              <span>Instagram: {siteConfig.instagram.handle}</span>
              <span>•</span>
              <span>Moda Masculina Premium</span>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
