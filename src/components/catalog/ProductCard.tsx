"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { MessageCircle, Box } from "lucide-react";
import { ProductItem } from "@/types";
import { createProductWhatsAppLink } from "@/lib/whatsapp";
import { Product3DModal } from "@/components/ui/Product3DModal";

interface ProductCardProps {
  product: ProductItem;
  index?: number;
}

export function ProductCard({ product, index = 0 }: ProductCardProps) {
  const whatsappUrl = createProductWhatsAppLink(product.name);
  const [isVisible, setIsVisible] = useState(false);
  const [is3DModalOpen, setIs3DModalOpen] = useState(false);
  const cardRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    // Se o navegador não suportar IntersectionObserver, exibe imediatamente
    if (typeof window === "undefined" || !("IntersectionObserver" in window)) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (cardRef.current) {
            observer.unobserve(cardRef.current);
          }
        }
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -40px 0px",
      }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <>
      <article
        ref={cardRef}
        style={{
          transitionDelay: isVisible ? `${(index % 4) * 60}ms` : "0ms",
        }}
        className={`group flex flex-col bg-brand-card border border-brand-border/70 overflow-hidden transition-[transform,opacity,border-color,box-shadow] duration-300 ease-out hover:-translate-y-1 hover:border-brand-silver/50 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.85)] ${
          isVisible
            ? "opacity-100 translate-y-0 scale-100"
            : "opacity-0 translate-y-5 scale-[0.98]"
        }`}
      >
        {/* Product Image Container com ring óptico para dark mode */}
        <div className="relative aspect-[3/4] w-full bg-brand-black overflow-hidden ring-1 ring-inset ring-white/10">
          <Image
            src={product.image}
            alt={`Fotografia de ${product.name}`}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover object-center filter contrast-[1.02] brightness-95 transition-transform duration-700 ease-out group-hover:scale-105"
            priority={index < 4}
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

          {/* Botão Flutuante Rápido "Ver em 3D" sobre a foto */}
          <button
            onClick={() => setIs3DModalOpen(true)}
            className="absolute bottom-3 right-3 z-10 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-brand-black/80 hover:bg-brand-white text-brand-silver hover:text-brand-black border border-white/15 text-[10px] uppercase font-semibold tracking-wider backdrop-blur-md transition-all duration-200 shadow-lg"
          >
            <Box className="w-3.5 h-3.5 text-emerald-400 group-hover:text-black" />
            <span>360° 3D</span>
          </button>
        </div>

        {/* Product Details com text-balance e text-pretty */}
        <div className="flex-1 flex flex-col justify-between p-5 sm:p-6 bg-gradient-to-b from-brand-card to-brand-surface">
          <div>
            <h3 className="font-display text-lg font-bold uppercase tracking-wider text-brand-white group-hover:text-brand-silver transition-colors text-balance">
              {product.name}
            </h3>

            <p className="mt-2 text-xs text-brand-silver/80 line-clamp-2 leading-relaxed text-pretty">
              {product.description}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="mt-5 pt-4 border-t border-brand-border/60 flex flex-col gap-2">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Consultar disponibilidade de ${product.name} no WhatsApp`}
              className="w-full flex items-center justify-center gap-2 py-3 pl-4 pr-3.5 bg-brand-surface border border-brand-border text-brand-white text-xs uppercase tracking-wider font-semibold hover:bg-brand-white hover:text-brand-black hover:border-brand-white active:scale-[0.98] transition-[background-color,color,border-color,transform] duration-200 focus:outline-none focus:ring-2 focus:ring-brand-silver select-none"
            >
              <MessageCircle className="w-3.5 h-3.5 text-emerald-400 group-hover:text-black" />
              <span>Consultar Disponibilidade</span>
            </a>
          </div>
        </div>
      </article>

      {/* Modal 360° Three.js */}
      <Product3DModal
        isOpen={is3DModalOpen}
        onClose={() => setIs3DModalOpen(false)}
        productName={product.name}
        categoryLabel={product.categoryLabel}
        modelUrl={product.modelUrl}
      />
    </>
  );
}
