"use client";

import React, { useState } from "react";
import Image from "next/image";
import { X, MessageCircle, ZoomIn, ZoomOut, Sparkles, Check, Footprints, Shirt } from "lucide-react";
import { ProductItem } from "@/types";
import { createProductWhatsAppLink } from "@/lib/whatsapp";

interface ProductDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: ProductItem | null;
}

export function ProductDetailModal({ isOpen, onClose, product }: ProductDetailModalProps) {
  const [isZoomed, setIsZoomed] = useState(false);

  if (!isOpen || !product) return null;

  const isSneaker = product.category === "tenis";
  const whatsappUrl = createProductWhatsAppLink(product.name);

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-brand-black/90 backdrop-blur-xl animate-fadeIn select-none"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative w-full max-w-4xl bg-brand-surface border border-brand-border/80 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.95)] overflow-hidden flex flex-col md:flex-row max-h-[92vh]">
        
        {/* Lado Esquerdo: Imagem com Spotlight e Zoom */}
        <div className="relative w-full md:w-3/5 h-[340px] sm:h-[420px] md:h-[540px] bg-gradient-to-b from-[#141418] via-[#0d0d11] to-[#08080a] flex items-center justify-center overflow-hidden group">
          
          {/* Spotlight suave sobre o produto */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[380px] h-[380px] bg-gradient-radial from-white/10 via-transparent to-transparent pointer-events-none blur-2xl" />

          {/* Imagem do Produto */}
          <div
            className={`relative w-full h-full transition-transform duration-500 ease-out cursor-zoom-in ${
              isZoomed ? "scale-150 cursor-zoom-out" : "scale-100"
            }`}
            onClick={() => setIsZoomed(!isZoomed)}
          >
            <Image
              src={product.image}
              alt={`Detalhe de ${product.name}`}
              fill
              sizes="(max-width: 768px) 100vw, 60vw"
              className="object-contain p-4 sm:p-8 filter contrast-[1.03]"
              priority
            />
          </div>

          {/* Base de Prateleira (apenas para tênis) */}
          {isSneaker && (
            <div className="absolute bottom-6 left-12 right-12 pointer-events-none flex flex-col items-center">
              <div className="w-full h-[2px] bg-gradient-to-r from-transparent via-white/70 to-transparent shadow-[0_0_12px_rgba(255,255,255,0.6)]" />
              <div className="w-3/4 h-[4px] bg-gradient-to-r from-transparent via-white/20 to-transparent mt-0.5" />
            </div>
          )}

          {/* Botão de Zoom Flutuante */}
          <button
            onClick={() => setIsZoomed(!isZoomed)}
            className="absolute bottom-4 right-4 z-10 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-brand-black/75 hover:bg-brand-white text-brand-silver hover:text-brand-black border border-white/15 text-[10px] uppercase font-semibold tracking-wider backdrop-blur-md transition-colors"
          >
            {isZoomed ? <ZoomOut className="w-3.5 h-3.5" /> : <ZoomIn className="w-3.5 h-3.5" />}
            <span>{isZoomed ? "Reduzir" : "Zoom"}</span>
          </button>

          {/* Badge de Categoria */}
          <div className="absolute top-4 left-4 z-10 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-brand-black/80 border border-white/10 text-[10px] uppercase tracking-widest text-brand-silver">
            {isSneaker ? (
              <>
                <Footprints className="w-3 h-3 text-emerald-400" />
                <span>Showroom Sneaker</span>
              </>
            ) : (
              <>
                <Shirt className="w-3 h-3 text-emerald-400" />
                <span>Boutique Arara</span>
              </>
            )}
          </div>
        </div>

        {/* Lado Direito: Informações Editoriais e Compra */}
        <div className="w-full md:w-2/5 p-6 sm:p-8 flex flex-col justify-between bg-brand-card/70 border-t md:border-t-0 md:border-l border-brand-border/60 overflow-y-auto">
          <div>
            {/* Fechar */}
            <div className="flex items-center justify-between mb-4">
              <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-brand-silver px-2.5 py-1 bg-brand-black border border-white/10">
                <Sparkles className="w-3 h-3 text-brand-white" />
                Coleção Black Store
              </span>
              <button
                onClick={onClose}
                aria-label="Fechar modal"
                className="p-1.5 text-brand-silver hover:text-white hover:bg-white/10 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <span className="text-xs uppercase tracking-widest text-brand-muted">
              {product.categoryLabel}
            </span>
            <h2 className="font-display text-2xl sm:text-3xl font-bold uppercase tracking-tight text-brand-white mt-1 mb-4 text-balance">
              {product.name}
            </h2>

            <div className="space-y-4 text-xs sm:text-sm text-brand-silver/90 leading-relaxed pt-3 border-t border-brand-border/50">
              <p>{product.description}</p>

              {/* Destaques Técnicos */}
              <div className="pt-2">
                <h4 className="text-[11px] uppercase tracking-widest font-bold text-brand-white mb-2">
                  Especificações da Peça
                </h4>
                <ul className="space-y-2 text-[11px] text-brand-silver/80">
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>{isSneaker ? "Couro legítimo texturizado com costuras reforçadas" : "Algodão nobre e toque aveludado de alta densidade"}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>{isSneaker ? "Solado estruturado com absorção de impacto" : "Corte e caimento que valorizam a silhueta masculina"}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Disponibilidade imediata na loja física e envio nacional</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Botão de WhatsApp */}
          <div className="mt-8 pt-6 border-t border-brand-border/60 flex flex-col gap-2.5">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 w-full py-3.5 bg-brand-white text-brand-black text-xs font-bold uppercase tracking-widest hover:bg-brand-silver transition-all duration-200 shadow-xl"
            >
              <MessageCircle className="w-4 h-4 text-emerald-600" />
              Pedir no WhatsApp
            </a>
            <button
              onClick={onClose}
              className="w-full py-2.5 text-[11px] font-semibold uppercase tracking-widest text-brand-silver hover:text-white transition-colors text-center"
            >
              Voltar ao Catálogo
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
