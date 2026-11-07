"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Clock, MapPin, MessageCircle, Sparkles, ChevronRight } from "lucide-react";
import { siteConfig } from "@/config/site";
import { createWhatsAppLink } from "@/lib/whatsapp";

const storeImages = [
  {
    src: "/catalog/loja/loja-5.webp",
    title: "Vitrine & Entrada",
    subtitle: "Recepção moderna e iluminação intimista",
  },
  {
    src: "/catalog/loja/loja-2.webp",
    title: "Araras & Vestuário",
    subtitle: "Seleção premium organizada por estilos",
  },
  {
    src: "/catalog/loja/loja-3.webp",
    title: "Espaço Sneaker & Tênis",
    subtitle: "Expositores dedicados aos lançamentos",
  },
  {
    src: "/catalog/loja/loja-4.webp",
    title: "Camisaria & Detalhes",
    subtitle: "Acabamento e caimento de alto padrão",
  },
  {
    src: "/catalog/loja/loja-1.webp",
    title: "Ambiente Black Lounge",
    subtitle: "Conforto para provar e escolher com calma",
  },
  {
    src: "/catalog/loja/loja-6.webp",
    title: "Acessórios & Coleções",
    subtitle: "Bonés, relógios e itens exclusivos",
  },
];

export function StoreGallery() {
  const [activePhoto, setActivePhoto] = useState(0);

  return (
    <section id="loja" className="py-24 bg-brand-black relative border-t border-brand-border/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header da Seção */}
        <div className="max-w-2xl mb-14">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-6 h-[1px] bg-brand-silver"></span>
            <span className="text-xs font-semibold uppercase tracking-[0.25em] text-brand-silver">
              Atendimento Presencial
            </span>
          </div>
          <h2 className="font-display text-4xl sm:text-5xl font-bold uppercase tracking-tight text-brand-white mb-4 text-balance">
            Conheça Nosso Espaço.
          </h2>
          <p className="text-brand-silver/90 text-sm sm:text-base font-normal text-pretty">
            Seu próximo visual começa aqui. Um ambiente moderno e acolhedor, pensado para você experimentar com calma e encontrar a peça perfeita.
          </p>
        </div>

        {/* Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
          
          {/* Main Visual Highlight + Galeria Interativa */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            <div className="relative min-h-[360px] sm:min-h-[460px] flex-1 overflow-hidden border border-brand-border/80 bg-brand-surface ring-1 ring-inset ring-white/10 group">
              <Image
                src={storeImages[activePhoto].src}
                alt={storeImages[activePhoto].title}
                fill
                sizes="(max-width: 1024px) 100vw, 60vw"
                className="object-cover object-center filter contrast-[1.02] brightness-95 transition-all duration-700 ease-out group-hover:scale-105"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-black/90 via-brand-black/25 to-transparent pointer-events-none" />
              
              <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between pointer-events-none">
                <div>
                  <span className="text-[10px] uppercase font-mono tracking-widest text-emerald-400 flex items-center gap-1.5 mb-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                    Loja Física Black Store
                  </span>
                  <p className="text-xl font-display font-bold uppercase text-brand-white">
                    {storeImages[activePhoto].title}
                  </p>
                  <p className="text-xs text-brand-silver/80 mt-0.5">
                    {storeImages[activePhoto].subtitle}
                  </p>
                </div>
                <div className="px-3 py-1 bg-brand-surface/90 border border-brand-border text-[11px] uppercase tracking-wider text-brand-silver backdrop-blur-md">
                  Foto Real
                </div>
              </div>
            </div>

            {/* Miniaturas de navegação rápida */}
            <div className="grid grid-cols-6 gap-2">
              {storeImages.map((img, idx) => (
                <button
                  key={img.src}
                  onClick={() => setActivePhoto(idx)}
                  className={`relative aspect-square overflow-hidden border transition-all duration-300 ${
                    activePhoto === idx
                      ? "border-brand-white ring-2 ring-white/50 scale-[1.02]"
                      : "border-brand-border/60 opacity-60 hover:opacity-100"
                  }`}
                  aria-label={`Ver foto ${img.title}`}
                >
                  <Image
                    src={img.src}
                    alt={img.title}
                    fill
                    sizes="100px"
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Details & Operating Hours Card */}
          <div className="lg:col-span-5 flex flex-col justify-between bg-brand-surface border border-brand-border/80 p-8">
            <div>
              {/* Horários */}
              <div className="flex items-center gap-2.5 pb-4 border-b border-brand-border/60">
                <Clock className="w-5 h-5 text-brand-white" />
                <h3 className="text-sm font-bold uppercase tracking-widest text-brand-white">
                  Horário de Funcionamento
                </h3>
              </div>

              <div className="divide-y divide-brand-border/40 my-6">
                <div className="py-3 flex justify-between items-center text-xs">
                  <span className="text-brand-silver font-medium">Segunda-feira</span>
                  <span className="text-brand-white font-semibold">{siteConfig.storeLocation.hours.monday}</span>
                </div>
                <div className="py-3 flex justify-between items-center text-xs">
                  <span className="text-brand-silver font-medium">Terça a Sábado</span>
                  <span className="text-brand-white font-semibold">{siteConfig.storeLocation.hours.tuesdayToSaturday}</span>
                </div>
                <div className="py-3 flex justify-between items-center text-xs">
                  <span className="text-brand-silver font-medium">Domingo</span>
                  <span className="text-brand-white font-semibold">{siteConfig.storeLocation.hours.sunday}</span>
                </div>
              </div>

              <p className="text-[11px] text-brand-muted italic mb-6">
                * {siteConfig.storeLocation.hoursNote}
              </p>

              {/* Status de Endereço Conforme Regra: não inventar endereço */}
              <div className="p-4 bg-brand-black/60 border border-brand-border/60 mb-6">
                <div className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-brand-silver shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-brand-white">
                      Endereço da Loja
                    </h4>
                    <p className="text-xs text-brand-silver/80 mt-1">
                      {siteConfig.storeLocation.isAddressConfirmed
                        ? `${siteConfig.storeLocation.street}, ${siteConfig.storeLocation.city}`
                        : "Consulte a localização exata e pontos de referência pelo WhatsApp."}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* CTAs */}
            <div className="pt-6 border-t border-brand-border/60">
              <a
                href={createWhatsAppLink("Olá! Gostaria de consultar o endereço e como chegar à loja física da Black Store.")}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2.5 py-3.5 bg-brand-white text-brand-black font-semibold text-xs uppercase tracking-widest hover:bg-brand-silver transition-colors focus:outline-none focus:ring-2 focus:ring-brand-silver"
              >
                <MessageCircle className="w-4 h-4 text-emerald-600" />
                Como Chegar • Fale no WhatsApp
              </a>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
