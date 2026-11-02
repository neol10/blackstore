"use client";

import React from "react";
import Image from "next/image";
import { MessageCircle, ExternalLink } from "lucide-react";
import { ProductItem } from "@/types";
import { createProductWhatsAppLink } from "@/lib/whatsapp";

interface ProductCardProps {
  product: ProductItem;
}

export function ProductCard({ product }: ProductCardProps) {
  const whatsappUrl = createProductWhatsAppLink(product.name);

  return (
    <article className="group flex flex-col bg-brand-card border border-brand-border/70 overflow-hidden transition-all duration-300 hover:border-brand-silver/50 hover:shadow-2xl">
      {/* Product Image Container */}
      <div className="relative aspect-[3/4] w-full bg-brand-black overflow-hidden">
        <Image
          src={product.image}
          alt={`Fotografia de ${product.name}`}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover object-center filter contrast-[1.02] brightness-95 transition-transform duration-700 ease-out group-hover:scale-105"
          loading="lazy"
        />

        {/* Badges Overlay */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
          <span className="text-[10px] font-medium uppercase tracking-widest px-2.5 py-1 bg-brand-black/85 backdrop-blur-md text-brand-silver border border-brand-border/60">
            {product.categoryLabel}
          </span>

          {product.highlightBadge ? (
            <span className="text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 bg-brand-white text-brand-black shadow">
              {product.highlightBadge}
            </span>
          ) : (
            product.isDemo && (
              <span className="text-[9px] uppercase tracking-widest px-2 py-0.5 bg-brand-graphite/70 text-brand-silver/70 border border-brand-border/40">
                Modelo Conceito
              </span>
            )
          )}
        </div>
      </div>

      {/* Product Details */}
      <div className="flex-1 flex flex-col justify-between p-5 sm:p-6 bg-gradient-to-b from-brand-card to-brand-surface">
        <div>
          <h3 className="font-display text-lg font-bold uppercase tracking-wider text-brand-white group-hover:text-brand-silver transition-colors">
            {product.name}
          </h3>

          <p className="mt-2 text-xs text-brand-silver/80 line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* Action Button */}
        <div className="mt-5 pt-4 border-t border-brand-border/60">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Consultar disponibilidade de ${product.name} no WhatsApp`}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-brand-surface border border-brand-border text-brand-white text-xs uppercase tracking-wider font-semibold hover:bg-brand-white hover:text-brand-black hover:border-brand-white transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-brand-silver"
          >
            <MessageCircle className="w-3.5 h-3.5 text-emerald-400 group-hover:text-black" />
            <span>Consultar Disponibilidade</span>
          </a>
        </div>
      </div>
    </article>
  );
}
