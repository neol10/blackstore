"use client";

import React from "react";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { categoriesData } from "@/data/categories";
import { ProductCategory } from "@/types";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

interface CategoryGridProps {
  onSelectCategory?: (category: ProductCategory) => void;
}

export function CategoryGrid({ onSelectCategory }: CategoryGridProps) {
  const handleCategoryClick = (category: ProductCategory, e: React.MouseEvent) => {
    if (onSelectCategory) {
      e.preventDefault();
      onSelectCategory(category);
      const target = document.getElementById("destaques");
      if (target) {
        target.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <section id="colecoes" className="py-24 bg-brand-surface relative border-t border-brand-border/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header da Seção */}
        <ScrollReveal>
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="w-6 h-[1px] bg-brand-silver"></span>
                <span className="text-xs font-semibold uppercase tracking-[0.25em] text-brand-silver">
                  Categorias Principais
                </span>
              </div>
              <h2 className="font-display text-4xl sm:text-5xl font-bold uppercase tracking-tight text-brand-white text-balance">
                Encontre Seu Estilo.
              </h2>
            </div>
            <p className="text-brand-silver/80 max-w-md text-sm sm:text-base font-normal text-pretty">
              Do casual ao esportivo, explore as coleções da Black Store projetadas para compor um guarda-roupa marcante.
            </p>
          </div>
        </ScrollReveal>

        {/* Grid de Categorias */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {categoriesData.map((cat, idx) => (
            <ScrollReveal key={cat.id} delay={idx * 100}>
              <a
                href="#destaques"
                onClick={(e) => handleCategoryClick(cat.targetFilter, e)}
                className="group relative h-[380px] sm:h-[420px] overflow-hidden bg-brand-black border border-brand-border/80 flex flex-col justify-end p-6 sm:p-8 transition-[border-color,box-shadow,transform] duration-300 hover:border-brand-silver/60 hover:-translate-y-1 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.85)] active:scale-[0.99] focus:outline-none focus:ring-2 focus:ring-brand-silver select-none ring-1 ring-inset ring-white/5"
              >
              {/* Image Background */}
              <div className="absolute inset-0 z-0">
                <Image
                  src={cat.image}
                  alt={cat.name}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover object-center filter grayscale-[25%] brightness-[0.78] contrast-[1.05] transition-transform duration-700 ease-out group-hover:scale-105 group-hover:grayscale-0 group-hover:brightness-[0.88]"
                />
                {/* Degradê de leitura */}
                <div className="absolute inset-0 bg-gradient-to-t from-brand-black via-brand-black/50 to-transparent" />
              </div>

              {/* Category Info Overlay */}
              <div className="relative z-10 transition-transform duration-300 group-hover:-translate-y-1">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] uppercase tracking-widest text-brand-silver/80 font-mono">
                    Coleção Black Store
                  </span>
                  <div className="w-8 h-8 rounded-full bg-brand-black/60 border border-brand-border/60 flex items-center justify-center text-brand-silver group-hover:text-brand-black group-hover:border-brand-white group-hover:bg-brand-white transition-[background-color,color,border-color,transform] duration-300 shadow-sm">
                    <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover:rotate-45" />
                  </div>
                </div>

                <h3 className="font-display text-2xl font-bold uppercase tracking-wider text-brand-white mb-2 text-balance">
                  {cat.name}
                </h3>

                <p className="text-xs text-brand-silver/90 line-clamp-2 leading-relaxed text-pretty">
                  {cat.shortDescription}
                </p>

                <div className="mt-4 pt-3 border-t border-brand-border/40 flex items-center gap-1.5 text-[11px] uppercase tracking-widest text-brand-silver group-hover:text-brand-white">
                  <span>Ver na vitrine</span>
                  <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
                </div>
              </div>
            </a>
          </ScrollReveal>
        ))}
        </div>
      </div>
    </section>
  );
}
