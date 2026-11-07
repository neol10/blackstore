"use client";

import React, { useMemo } from "react";
import { ProductItem, ProductCategory } from "@/types";
import { ProductCard } from "./ProductCard";
import { ProductFilters } from "./ProductFilters";

interface ProductGridProps {
  products: ProductItem[];
  selectedCategory: ProductCategory;
  onSelectCategory: (category: ProductCategory) => void;
}

export function ProductGrid({
  products,
  selectedCategory,
  onSelectCategory,
}: ProductGridProps) {
  // Lista de filtros contendo apenas categorias que possuem produtos cadastrados
  const filterOptions = useMemo(() => {
    const presentCategories = new Set(products.map((p) => p.category));
    const list: { id: ProductCategory; label: string }[] = [
      { id: "all", label: "Todos" },
    ];

    if (presentCategories.has("tenis")) list.push({ id: "tenis", label: "Tênis" });
    if (presentCategories.has("camisetas")) list.push({ id: "camisetas", label: "Camisetas" });
    if (presentCategories.has("esportivo")) list.push({ id: "esportivo", label: "Esportivo" });
    if (presentCategories.has("bermudas")) list.push({ id: "bermudas", label: "Bermudas" });
    if (presentCategories.has("moletons")) list.push({ id: "moletons", label: "Moletons" });
    if (presentCategories.has("casual-social"))
      list.push({ id: "casual-social", label: "Casual & Social" });
    if (presentCategories.has("acessorios"))
      list.push({ id: "acessorios", label: "Acessórios & Relógios" });

    return list;
  }, [products]);

  // Produtos filtrados
  const filteredProducts = useMemo(() => {
    if (selectedCategory === "all") return products;
    return products.filter((p) => p.category === selectedCategory);
  }, [products, selectedCategory]);

  return (
    <section id="destaques" className="py-24 bg-brand-black relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header da Seção */}
        <div className="max-w-2xl mb-12">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-6 h-[1px] bg-brand-silver"></span>
            <span className="text-xs font-semibold uppercase tracking-[0.25em] text-brand-silver">
              Vitrine Exclusiva
            </span>
          </div>
          <h2 className="font-display text-4xl sm:text-5xl font-bold uppercase tracking-tight text-brand-white mb-4 text-balance">
            Destaques da Black Store.
          </h2>
          <p className="text-brand-silver/90 text-sm sm:text-base font-normal text-pretty">
            Explore peças selecionadas para diferentes estilos e ocasiões. Consulte a disponibilidade do seu tamanho diretamente com nossa equipe.
          </p>
        </div>

        {/* Filtros */}
        <ProductFilters
          categories={filterOptions}
          activeCategory={selectedCategory}
          onSelectCategory={onSelectCategory}
          totalCount={filteredProducts.length}
        />

        {/* Grid de Produtos */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
          {filteredProducts.map((product, index) => (
            <ProductCard key={product.id} product={product} index={index} />
          ))}
        </div>

        {/* Informação sobre produtos sob consulta */}
        <div className="mt-14 p-6 bg-brand-surface border border-brand-border/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-brand-white">
              Procurando uma peça específica ou outro tamanho?
            </p>
            <p className="text-xs text-brand-silver/70 mt-1">
              Atendimento ágil pelo WhatsApp para consulta de cores, medidas e novidades da loja.
            </p>
          </div>
          <a
            href="#contato"
            className="shrink-0 px-6 py-2.5 bg-brand-graphite hover:bg-brand-silver hover:text-brand-black text-brand-white text-xs uppercase tracking-wider font-semibold border border-brand-border transition-colors"
          >
            Falar com Atendente
          </a>
        </div>
      </div>
    </section>
  );
}
