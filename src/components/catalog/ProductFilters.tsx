"use client";

import React from "react";
import { ProductCategory } from "@/types";

interface FilterOption {
  id: ProductCategory;
  label: string;
}

interface ProductFiltersProps {
  categories: FilterOption[];
  activeCategory: ProductCategory;
  onSelectCategory: (category: ProductCategory) => void;
  totalCount: number;
}

export function ProductFilters({
  categories,
  activeCategory,
  onSelectCategory,
  totalCount,
}: ProductFiltersProps) {
  return (
    <div className="w-full mb-10">
      {/* Scrollable Container on Mobile */}
      <div className="flex items-center gap-2 overflow-x-auto pb-3 pt-1 scrollbar-none sm:flex-wrap">
        {categories.map((cat) => {
          const isActive = activeCategory === cat.id;

          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`shrink-0 px-5 py-2.5 text-xs font-semibold uppercase tracking-wider transition-all duration-300 border focus:outline-none focus:ring-2 focus:ring-brand-silver ${
                isActive
                  ? "bg-brand-white text-brand-black border-brand-white shadow"
                  : "bg-brand-surface text-brand-silver border-brand-border hover:border-brand-silver hover:text-brand-white"
              }`}
              aria-pressed={isActive}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      <div className="flex items-center justify-between text-[11px] uppercase tracking-widest text-brand-muted mt-2 border-b border-brand-border/40 pb-2">
        <span>Exibindo catálogo da loja</span>
        <span>{totalCount} itens disponíveis para consulta</span>
      </div>
    </div>
  );
}
