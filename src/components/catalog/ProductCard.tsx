"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { MessageCircle, Eye, Ruler } from "lucide-react";
import { ProductItem } from "@/types";
import { createProductWhatsAppLink } from "@/lib/whatsapp";
import { ProductDetailModal } from "@/components/ui/ProductDetailModal";
import { SmartFitModal } from "@/components/ui/SmartFitModal";

interface ProductCardProps {
  product: ProductItem;
  index?: number;
}

export function ProductCard({ product, index = 0 }: ProductCardProps) {
  const whatsappUrl = createProductWhatsAppLink(product.name);
  const [isVisible, setIsVisible] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isFitOpen, setIsFitOpen] = useState(false);
  const cardRef = useRef<HTMLElement | null>(null);

  const isSneaker = product.category === "tenis";

  useEffect(() => {
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
        className={`group relative flex flex-col bg-brand-card border border-brand-border/70 overflow-hidden transition-[transform,opacity,border-color,box-shadow] duration-300 ease-out hover:-translate-y-1 hover:border-brand-silver/50 hover:shadow-[0_22px_45px_-12px_rgba(0,0,0,0.9)] ${
          isVisible
            ? "opacity-100 translate-y-0 scale-100"
            : "opacity-0 translate-y-5 scale-[0.98]"
        }`}
      >
        {/* ============================================================== */}
        {/* CABIDE BOUTIQUE: Apenas para Roupas e Calças */}
        {/* Barra de arara superior + Gancho de metal escovado */}
        {/* ============================================================== */}
        {!isSneaker && (
          <div className="relative w-full h-8 bg-gradient-to-b from-[#18181c] to-[#101013] border-b border-white/10 flex items-center justify-center overflow-visible select-none">
            {/* Barra da Arara Horizontal cromada */}
            <div className="absolute top-1 left-0 right-0 h-[3px] bg-gradient-to-r from-transparent via-white/40 to-transparent" />
            
            {/* Gancho Metálico do Cabide em SVG Realista com Brilho */}
            <div className="relative -top-1 flex flex-col items-center">
              <svg
                width="28"
                height="24"
                viewBox="0 0 28 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]"
              >
                {/* Gancho Curvo de Metal */}
                <path
                  d="M14 22V14C14 11 16.5 8.5 19 8.5C21.5 8.5 23 10.5 23 12C23 14 21.5 15 20.5 15"
                  stroke="url(#hanger_chrome)"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                />
                {/* Triângulo sutil da base do cabide */}
                <path
                  d="M4 23L14 18L24 23"
                  stroke="url(#hanger_chrome)"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <defs>
                  <linearGradient id="hanger_chrome" x1="0" y1="0" x2="28" y2="24" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#F5F5F7" />
                    <stop offset="0.45" stopColor="#D4D4D8" />
                    <stop offset="0.75" stopColor="#A1A1AA" />
                    <stop offset="1" stopColor="#E4E4E7" />
                  </linearGradient>
                </defs>
              </svg>
            </div>

            {/* Tag discreta de arara boutique */}
            <span className="absolute right-3 top-2 text-[8px] uppercase tracking-widest text-brand-silver/50 font-mono">
              Boutique Hanger
            </span>
          </div>
        )}

        {/* ============================================================== */}
        {/* CONTAINER DA IMAGEM */}
        {/* - Para Roupas: Oscilação pendular suave do cabide no hover */}
        {/* - Para Sneakers: Prateleira de Sneaker Shop com Spotlight e Sombra */}
        {/* ============================================================== */}
        <div
          onClick={() => setIsDetailOpen(true)}
          className={`relative aspect-[3/4] w-full bg-gradient-to-b from-[#141418] via-[#0d0d10] to-[#070709] overflow-hidden ring-1 ring-inset ring-white/10 cursor-pointer ${
            !isSneaker ? "animate-hanger-swing" : ""
          }`}
        >
          {/* SPOTLIGHT DE PRATELEIRA (Apenas para Sneakers): Feixe de luz vertical ao passar o mouse */}
          {isSneaker && (
            <>
              {/* Feixe Cônico Superior de Luz que acende no hover */}
              <div className="absolute inset-0 bg-gradient-to-b from-white/25 via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-10" />
              
              {/* Brilho radial no centro do tênis */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-52 h-52 bg-white/15 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none blur-2xl z-10" />

              {/* Sombra de Contato projetada na base da prateleira */}
              <div className="absolute bottom-5 left-1/2 -translate-x-1/2 w-44 h-3 bg-black/80 blur-md rounded-full pointer-events-none z-10 transition-all duration-500 group-hover:scale-90 group-hover:opacity-50" />
            </>
          )}

          {/* Fotografia da Peça */}
          <Image
            src={product.image}
            alt={`Fotografia de ${product.name}`}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className={`${
              isSneaker
                ? "object-contain p-6 filter drop-shadow-[0_12px_14px_rgba(0,0,0,0.7)] group-hover:drop-shadow-[0_18px_20px_rgba(0,0,0,0.85)] group-hover:-translate-y-2 group-hover:scale-105"
                : "object-cover object-center filter contrast-[1.02] brightness-95 group-hover:scale-105"
            } transition-all duration-500 ease-out`}
            priority={index < 4}
          />

          {/* Badges de Categoria */}
          <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none z-20">
            <span className="text-[10px] font-medium uppercase tracking-widest px-2.5 py-1 bg-brand-black/85 backdrop-blur-md text-brand-silver border border-brand-border/60">
              {product.categoryLabel}
            </span>

            {product.highlightBadge ? (
              <span className="text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 bg-brand-white text-brand-black shadow">
                {product.highlightBadge}
              </span>
            ) : (
              isSneaker && (
                <span className="text-[9px] uppercase tracking-widest px-2 py-0.5 bg-brand-graphite/80 text-brand-white border border-white/20 backdrop-blur-sm">
                  Prateleira Sneaker
                </span>
              )
            )}
          </div>

          {/* ============================================================ */}
          {/* PRATELEIRA FLUTUANTE 3D: Apenas na base do Tênis */}
          {/* ============================================================ */}
          {isSneaker && (
            <div className="absolute bottom-0 left-0 right-0 z-20 pointer-events-none">
              {/* Linha de reflexo / neon da prateleira */}
              <div className="relative h-[3px] bg-gradient-to-r from-transparent via-white/90 to-transparent shadow-[0_0_15px_rgba(255,255,255,0.8)] group-hover:shadow-[0_0_24px_rgba(255,255,255,1)] transition-shadow duration-300" />
              {/* Prateleira chanfrada estilo boutique */}
              <div className="h-3 bg-gradient-to-b from-[#202026] to-[#0c0c0e] border-t border-white/30 flex items-center justify-between px-3">
                <span className="text-[7px] uppercase tracking-[0.25em] text-brand-silver/80 font-mono">
                  Display • Acrílico & LED
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 group-hover:animate-ping" />
              </div>
            </div>
          )}

          {/* Botão sutil de visualização rápida no hover */}
          <div className="absolute bottom-3 right-3 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsDetailOpen(true);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-brand-black/85 hover:bg-brand-white text-brand-silver hover:text-brand-black border border-white/15 text-[10px] uppercase font-semibold tracking-wider backdrop-blur-md transition-colors shadow-lg"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>{isSneaker ? "Ver Tênis" : "Ver Peça"}</span>
            </button>
          </div>
        </div>

        {/* ============================================================== */}
        {/* INFORMAÇÕES DO PRODUTO */}
        {/* ============================================================== */}
        <div className="flex-1 flex flex-col justify-between p-5 sm:p-6 bg-gradient-to-b from-brand-card to-brand-surface">
          <div>
            <h3
              onClick={() => setIsDetailOpen(true)}
              className="font-display text-lg font-bold uppercase tracking-wider text-brand-white group-hover:text-brand-silver transition-colors text-balance cursor-pointer"
            >
              {product.name}
            </h3>

            <p className="mt-2 text-xs text-brand-silver/80 line-clamp-2 leading-relaxed text-pretty">
              {product.description}
            </p>

            {/* Barra de Escassez: Drop Limitado */}
            {product.limitedStock && (
              <div className="mt-3 pt-2.5 border-t border-brand-border/40">
                <div className="flex items-center justify-between text-[10px] uppercase font-bold tracking-wider text-amber-400 mb-1.5">
                  <span className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
                    Drop Limitado
                  </span>
                  <span className="text-[9px] font-mono font-semibold text-amber-300">
                    Restam {product.limitedStock} unid.
                  </span>
                </div>
                <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-amber-500 to-amber-300 rounded-full"
                    style={{ width: `${Math.min(product.limitedStock * 25, 100)}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Botões de Ação */}
          <div className="mt-5 pt-4 border-t border-brand-border/60 flex flex-col gap-2">
            <button
              onClick={() => setIsFitOpen(true)}
              className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded bg-white/5 hover:bg-white/10 border border-white/10 text-brand-silver hover:text-white text-[11px] uppercase tracking-wider font-semibold transition-colors"
            >
              <Ruler className="w-3.5 h-3.5 text-emerald-400" />
              <span>{isSneaker ? "Guia de Numeração" : "Descobrir Meu Tamanho"}</span>
            </button>

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

      {/* Modal Leve de Detalhes e Zoom da Peça */}
      <ProductDetailModal
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        product={product}
      />

      {/* Modal Inteligente de Caimento (Smart Fit) */}
      <SmartFitModal
        isOpen={isFitOpen}
        onClose={() => setIsFitOpen(false)}
        product={product}
      />
    </>
  );
}
