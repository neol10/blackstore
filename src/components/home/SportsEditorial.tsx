"use client";

import React from "react";
import Image from "next/image";
import { Trophy, ArrowRight, ShieldCheck, Flame } from "lucide-react";
import { ProductCategory } from "@/types";

interface SportsEditorialProps {
  onSelectCategory?: (category: ProductCategory) => void;
}

export function SportsEditorial({ onSelectCategory }: SportsEditorialProps) {
  const handleGoToSports = (e: React.MouseEvent) => {
    if (onSelectCategory) {
      e.preventDefault();
      onSelectCategory("esportivo");
      const target = document.getElementById("destaques");
      if (target) {
        target.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <section id="esportivo" className="py-28 bg-[#070707] relative overflow-hidden border-t border-brand-border/40">
      {/* Background Accent Gradients */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-brand-graphite/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-brand-graphite/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Asymmetrical Editorial Photography */}
          <div className="lg:col-span-7 grid grid-cols-12 gap-4">
            <div className="col-span-8 relative h-[380px] sm:h-[480px] overflow-hidden border border-brand-border/60">
              <Image
                src="https://images.unsplash.com/photo-1522778119026-d647f0596c20?auto=format&fit=crop&w=1000&q=80"
                alt="Moda esportiva e paixão pelo futebol"
                fill
                sizes="(max-width: 1024px) 70vw, 40vw"
                className="object-cover object-center filter grayscale-[20%] brightness-90 hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6">
                <span className="text-[10px] uppercase font-mono tracking-widest text-brand-silver">
                  Edição Especial
                </span>
                <p className="font-display text-xl sm:text-2xl font-bold uppercase text-brand-white mt-1">
                  Atitude nos Gramados e nas Ruas
                </p>
              </div>
            </div>

            <div className="col-span-4 flex flex-col gap-4">
              <div className="relative h-[180px] sm:h-[230px] overflow-hidden border border-brand-border/60">
                <Image
                  src="https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=600&q=80"
                  alt="Detalhe de vestuário esportivo urbano"
                  fill
                  sizes="(max-width: 1024px) 30vw, 20vw"
                  className="object-cover filter brightness-85"
                />
              </div>

              <div className="relative h-[186px] sm:h-[236px] bg-brand-surface border border-brand-border/60 p-6 flex flex-col justify-between">
                <div className="w-8 h-8 rounded-full bg-brand-black flex items-center justify-center text-brand-silver border border-brand-border">
                  <Flame className="w-4 h-4 text-brand-white" />
                </div>
                <div>
                  <p className="text-[10px] uppercase font-mono tracking-widest text-brand-muted">
                    Tendência
                  </p>
                  <p className="text-xs uppercase font-bold text-brand-white mt-1">
                    Sportswear com caimento streetwear
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Editorial Copy & CTA */}
          <div className="lg:col-span-5 flex flex-col justify-center">
            <div className="flex items-center gap-2 mb-4">
              <span className="w-8 h-[1px] bg-brand-silver"></span>
              <span className="text-xs font-semibold uppercase tracking-[0.25em] text-brand-silver">
                Linha Esportiva
              </span>
            </div>

            <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold uppercase tracking-tight text-brand-white leading-[1.02] mb-6">
              A Paixão Pelo Esporte Também Faz Parte do Seu Estilo.
            </h2>

            <p className="text-brand-silver/90 text-sm sm:text-base leading-relaxed mb-6">
              Explore a seleção esportiva da Black Store. Modelos com tecidos leves, respirabilidade e visual marcante para torcer, treinar ou compor looks urbanos cheios de personalidade.
            </p>

            {/* Informações pontuais sem alegações falsas */}
            <div className="space-y-3 mb-8 pt-4 border-t border-brand-border/60">
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-brand-graphite/60 flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-[10px] text-brand-silver">✓</span>
                </div>
                <p className="text-xs text-brand-silver">
                  Variedade de modelos dos principais clubes e seleções mundiais.
                </p>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-brand-graphite/60 flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-[10px] text-brand-silver">✓</span>
                </div>
                <p className="text-xs text-brand-silver">
                  Tecidos tecnológicos com rápida evaporação de suor e conforto térmico.
                </p>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-brand-graphite/60 flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-[10px] text-brand-silver">✓</span>
                </div>
                <p className="text-xs text-brand-silver">
                  Disponibilidade de tamanhos e modelos atualizada sob consulta direta.
                </p>
              </div>
            </div>

            {/* CTA */}
            <div>
              <a
                href="#destaques"
                onClick={handleGoToSports}
                className="inline-flex items-center gap-3 px-8 py-4 bg-brand-white text-brand-black text-xs font-bold uppercase tracking-widest hover:bg-brand-silver transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-brand-silver shadow-xl"
              >
                <span>Ver Coleção Esportiva</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
