"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Sparkles, MessageCircle, Eye, Play } from "lucide-react";
import { createWhatsAppLink } from "@/lib/whatsapp";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

const storiesData = [
  {
    id: 1,
    title: "Sneaker Drop",
    subtitle: "Air Force & Streetwear",
    image: "/catalog/loja/loja-3.webp",
    tag: "Calçados Exclusivos",
    whatsappMsg: "Olá! Vi o destaque do Sneaker Drop e queria consultar a disponibilidade da minha numeração.",
  },
  {
    id: 2,
    title: "Vitrine Noturna",
    subtitle: "Atendimento Presencial",
    image: "/catalog/loja/loja-5.webp",
    tag: "Espaço Físico",
    whatsappMsg: "Olá! Gostaria de saber como funciona o atendimento presencial na Black Store hoje.",
  },
  {
    id: 3,
    title: "Kits Urbanos",
    subtitle: "Combinações Streetwear",
    image: "/catalog/loja/loja-2.webp",
    tag: "Coleção 2026",
    whatsappMsg: "Olá! Gostei dos kits urbanos que vi nos destaques. Quais tamanhos estão disponíveis?",
  },
  {
    id: 4,
    title: "Mantos Europeus",
    subtitle: "Camisas & Corta-vento",
    image: "/catalog/futebol/real.webp",
    tag: "Linha Importada",
    whatsappMsg: "Olá! Gostaria de ver quais mantos e camisas de time estão disponíveis na Black Store.",
  },
];

export function StoreStories() {
  const [activeStory, setActiveStory] = useState<number | null>(null);

  return (
    <section className="py-20 bg-brand-surface border-t border-brand-border/40 relative overflow-hidden select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Cabeçalho da Seção com Scroll Reveal */}
        <ScrollReveal>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="w-5 h-[1px] bg-brand-silver"></span>
                <span className="text-xs font-semibold uppercase tracking-[0.25em] text-brand-silver">
                  Bastidores & Vitrine
                </span>
              </div>
              <h2 className="font-display text-3xl sm:text-4xl font-bold uppercase tracking-tight text-brand-white">
                Destaques da Black Store.
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-brand-silver/80 max-w-md">
              Uma prévia dos kits, peças e ambiente real que você encontra na nossa loja física.
            </p>
          </div>
        </ScrollReveal>

        {/* Grade de Stories Verticais 9:16 */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {storiesData.map((story, index) => (
            <ScrollReveal key={story.id} delay={index * 100}>
              <div
                className="group relative aspect-[9/16] w-full rounded-xl overflow-hidden bg-brand-black border border-brand-border/70 hover:border-brand-silver/60 transition-all duration-500 shadow-xl cursor-pointer"
                onClick={() => setActiveStory(story.id)}
              >
                {/* Imagem vertical */}
                <Image
                  src={story.image}
                  alt={story.title}
                  fill
                  sizes="(max-width: 640px) 50vw, 25vw"
                  className="object-cover object-center filter contrast-[1.03] brightness-90 group-hover:scale-105 group-hover:brightness-100 transition-all duration-700 ease-out"
                />

                {/* Gradiente escuro para legibilidade */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/30 to-black/60 pointer-events-none" />

                {/* Topo do Story: Barra de status simulada + Tag */}
                <div className="absolute top-3 inset-x-3 flex items-center justify-between z-10">
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-brand-black/70 backdrop-blur-md border border-white/10 text-[9px] uppercase tracking-wider font-semibold text-brand-silver">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    <span>{story.tag}</span>
                  </div>
                  <div className="w-6 h-6 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white/80 group-hover:bg-white group-hover:text-black transition-colors">
                    <Eye className="w-3 h-3" />
                  </div>
                </div>

                {/* Rodapé do Story: Informações & Botão de Ação */}
                <div className="absolute bottom-4 inset-x-4 z-10">
                  <h3 className="font-display text-base sm:text-lg font-bold uppercase text-brand-white leading-tight">
                    {story.title}
                  </h3>
                  <p className="text-[11px] text-brand-silver/90 mt-0.5 mb-3 line-clamp-1">
                    {story.subtitle}
                  </p>

                  <a
                    href={createWhatsAppLink(story.whatsappMsg)}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded bg-white/10 hover:bg-brand-white text-brand-white hover:text-black border border-white/20 text-[10px] uppercase font-bold tracking-wider backdrop-blur-md transition-all duration-200"
                  >
                    <MessageCircle className="w-3 h-3 text-emerald-400" />
                    <span>Consultar Kit</span>
                  </a>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
