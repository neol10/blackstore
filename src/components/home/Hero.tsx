"use client";

import React from "react";
import Image from "next/image";
import { MessageCircle, Sparkles } from "lucide-react";
import { createWhatsAppLink } from "@/lib/whatsapp";
import { siteConfig } from "@/config/site";

export function Hero() {
  return (
    <section
      id="inicio"
      className="relative min-h-screen flex flex-col justify-center overflow-hidden bg-brand-black pt-32 pb-16 sm:pt-36 sm:pb-20 lg:pt-40 lg:pb-24"
    >
      {/* Background Editorial Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src="https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=2000&q=85"
          alt="Composição editorial moda masculina de alto padrão"
          fill
          priority
          sizes="100vw"
          className="object-cover object-top filter brightness-[0.45] contrast-[1.1] scale-105 transition-transform duration-1000 ease-out"
        />
        {/* Gradients para legibilidade e elegância */}
        <div className="absolute inset-0 bg-gradient-to-t from-brand-black via-brand-black/40 to-brand-black/80" />
        <div className="absolute inset-0 bg-radial-gradient from-transparent via-brand-black/30 to-brand-black/90" />
      </div>

      {/* Hero Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full my-auto">
        <div className="max-w-3xl">
          {/* Badge de Demonstração / Posicionamento */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-graphite/80 border border-brand-border backdrop-blur-md mb-6">
            <Sparkles className="w-3.5 h-3.5 text-brand-silver" />
            <span className="text-[11px] font-medium tracking-widest text-brand-silver uppercase">
              {siteConfig.demoMode
                ? "Vitrine Conceito • Demonstração Comercial"
                : "Moda Masculina • Coleções 2026"}
            </span>
          </div>

          {/* Main Title */}
          <h1 className="font-display text-5xl sm:text-7xl lg:text-8xl font-bold tracking-tight text-brand-white uppercase leading-[0.95] mb-6">
            Seu Estilo.
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-white via-brand-silver to-brand-offwhite">
              Sua Presença.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg lg:text-xl text-brand-silver/90 max-w-xl font-normal leading-relaxed mb-10">
            Moda masculina para quem valoriza estilo, conforto e personalidade.
            Do casual à alfaiataria contemporânea e estética esportiva urbana.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
            <a
              href="#colecoes"
              className="inline-flex items-center justify-center px-8 py-4 bg-brand-white text-brand-black text-xs font-bold uppercase tracking-widest hover:bg-brand-silver transition-all duration-300 shadow-xl focus:outline-none focus:ring-2 focus:ring-brand-silver"
            >
              Explorar Coleções
            </a>

            <a
              href={createWhatsAppLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2.5 px-8 py-4 bg-brand-surface/80 backdrop-blur-md text-brand-offwhite border border-brand-border text-xs font-semibold uppercase tracking-widest hover:border-brand-silver hover:bg-brand-graphite transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-brand-silver"
            >
              <MessageCircle className="w-4 h-4 text-emerald-400" />
              Fale com a Black Store
            </a>
          </div>

          {/* Micro informativos */}
          <div className="grid grid-cols-3 gap-6 pt-10 mt-10 border-t border-brand-border/40 text-left">
            <div>
              <p className="text-xs uppercase tracking-widest text-brand-muted">Conceito</p>
              <p className="text-sm font-semibold text-brand-white mt-1">Streetwear & Luxo</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-widest text-brand-muted">Variedade</p>
              <p className="text-sm font-semibold text-brand-white mt-1">Casual a Esportivo</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-widest text-brand-muted">Atendimento</p>
              <p className="text-sm font-semibold text-brand-white mt-1">Exclusivo via WhatsApp</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
