"use client";

import React, { useState, useMemo } from "react";
import { X, Ruler, Sparkles, MessageCircle, Check, ArrowRight } from "lucide-react";
import { ProductItem } from "@/types";
import { createProductWhatsAppLink } from "@/lib/whatsapp";

interface SmartFitModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: ProductItem | null;
}

type FitPreference = "slim" | "regular" | "oversized";

export function SmartFitModal({ isOpen, onClose, product }: SmartFitModalProps) {
  const [height, setHeight] = useState<number>(175); // cm
  const [weight, setWeight] = useState<number>(75); // kg
  const [fitPreference, setFitPreference] = useState<FitPreference>("oversized");

  // Cálculo inteligente de caimento baseado em proporção corporal e preferência de estilo
  const recommendedSize = useMemo(() => {
    // Para tênis / calçados, calcula a numeração brasileira de calçado
    if (product?.category === "tenis") {
      // Estimativa média de calçado masculino proporcional à altura
      if (height < 165) return "38 / 39";
      if (height < 172) return "39 / 40";
      if (height < 178) return "40 / 41";
      if (height < 184) return "41 / 42";
      if (height < 190) return "42 / 43";
      return "43 / 44";
    }

    // Para vestuário (camisetas, moletons, camisas, bermudas)
    // Índice de massa e proporção corporal
    const bmi = weight / Math.pow(height / 100, 2);

    let baseSizeIndex = 2; // 0: PP, 1: P, 2: M, 3: G, 4: GG, 5: XG

    if (bmi < 20) {
      baseSizeIndex = height > 180 ? 2 : 1; // P ou M
    } else if (bmi < 24) {
      baseSizeIndex = height > 182 ? 3 : 2; // M ou G
    } else if (bmi < 27.5) {
      baseSizeIndex = height > 185 ? 4 : 3; // G ou GG
    } else if (bmi < 31) {
      baseSizeIndex = 4; // GG
    } else {
      baseSizeIndex = 5; // XG
    }

    // Ajuste pela preferência de caimento do cliente
    if (fitPreference === "slim" && baseSizeIndex > 0) {
      baseSizeIndex -= 1;
    } else if (fitPreference === "oversized" && baseSizeIndex < 5) {
      baseSizeIndex += 1;
    }

    const sizes = ["PP", "P", "M", "G", "GG", "XG"];
    return sizes[baseSizeIndex];
  }, [height, weight, fitPreference, product]);

  if (!isOpen || !product) return null;

  const isSneaker = product.category === "tenis";

  // Gera o link do WhatsApp já informando o tamanho calculado
  const customWhatsAppText = `Olá, equipe Black Store! Gostei da peça *${product.name}*. Utilizei o Smart Fit do site e meu tamanho recomendado é *${recommendedSize}* (${height}cm, ${weight}kg). Vocês têm disponível?`;
  const whatsappUrl = `https://wa.me/5511999999999?text=${encodeURIComponent(customWhatsAppText)}`;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-brand-black/90 backdrop-blur-xl animate-fadeIn select-none"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative w-full max-w-xl bg-brand-surface border border-brand-border/80 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.95)] overflow-hidden">
        
        {/* Cabeçalho do Modal */}
        <div className="flex items-center justify-between p-5 sm:p-6 border-b border-brand-border/60 bg-gradient-to-r from-brand-card to-brand-surface">
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-lg bg-white/5 border border-white/10 text-brand-white">
              <Ruler className="w-4 h-4 text-emerald-400" />
            </span>
            <div>
              <span className="text-[10px] uppercase tracking-[0.25em] text-brand-silver font-semibold flex items-center gap-1.5">
                <Sparkles className="w-3 h-3 text-brand-white" />
                Black Store Smart Fit
              </span>
              <h2 className="font-display text-lg sm:text-xl font-bold uppercase tracking-wide text-brand-white">
                Descubra Seu Tamanho Ideal
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Fechar"
            className="p-1.5 text-brand-silver hover:text-white hover:bg-white/10 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Corpo Interativo */}
        <div className="p-6 sm:p-8 space-y-6">
          {/* Informações da Peça Selecionada */}
          <div className="flex items-center gap-3 p-3 bg-brand-black/60 border border-white/10 rounded-lg">
            <span className="text-xs uppercase tracking-wider text-brand-silver/80">
              Analisando caimento para:
            </span>
            <span className="text-xs uppercase font-bold text-brand-white truncate">
              {product.name}
            </span>
          </div>

          {/* 1. Slider de Altura */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label htmlFor="height-range" className="text-xs uppercase font-bold tracking-wider text-brand-white">
                Sua Altura
              </label>
              <span className="text-sm font-mono font-bold text-emerald-400">
                {(height / 100).toFixed(2)} m
              </span>
            </div>
            <input
              id="height-range"
              type="range"
              min={150}
              max={205}
              value={height}
              onChange={(e) => setHeight(Number(e.target.value))}
              className="w-full h-2 bg-brand-card rounded-lg appearance-none cursor-pointer accent-brand-white"
            />
            <div className="flex justify-between text-[10px] text-brand-muted mt-1 font-mono">
              <span>1.50m</span>
              <span>1.75m</span>
              <span>2.05m</span>
            </div>
          </div>

          {/* 2. Slider de Peso */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label htmlFor="weight-range" className="text-xs uppercase font-bold tracking-wider text-brand-white">
                Seu Peso
              </label>
              <span className="text-sm font-mono font-bold text-emerald-400">
                {weight} kg
              </span>
            </div>
            <input
              id="weight-range"
              type="range"
              min={50}
              max={130}
              value={weight}
              onChange={(e) => setWeight(Number(e.target.value))}
              className="w-full h-2 bg-brand-card rounded-lg appearance-none cursor-pointer accent-brand-white"
            />
            <div className="flex justify-between text-[10px] text-brand-muted mt-1 font-mono">
              <span>50kg</span>
              <span>80kg</span>
              <span>130kg</span>
            </div>
          </div>

          {/* 3. Preferência de Caimento (Apenas para Vestuário) */}
          {!isSneaker && (
            <div>
              <label className="block text-xs uppercase font-bold tracking-wider text-brand-white mb-2.5">
                Como você prefere que a peça vista?
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setFitPreference("slim")}
                  className={`p-2.5 text-center border rounded-lg transition-all ${
                    fitPreference === "slim"
                      ? "border-brand-white bg-white/10 text-brand-white shadow-md"
                      : "border-brand-border/60 bg-brand-black/40 text-brand-silver hover:border-white/30"
                  }`}
                >
                  <span className="block text-xs font-bold uppercase">Slim</span>
                  <span className="block text-[9px] text-brand-muted mt-0.5">Mais ajustado</span>
                </button>

                <button
                  type="button"
                  onClick={() => setFitPreference("regular")}
                  className={`p-2.5 text-center border rounded-lg transition-all ${
                    fitPreference === "regular"
                      ? "border-brand-white bg-white/10 text-brand-white shadow-md"
                      : "border-brand-border/60 bg-brand-black/40 text-brand-silver hover:border-white/30"
                  }`}
                >
                  <span className="block text-xs font-bold uppercase">Regular</span>
                  <span className="block text-[9px] text-brand-muted mt-0.5">Caimento padrão</span>
                </button>

                <button
                  type="button"
                  onClick={() => setFitPreference("oversized")}
                  className={`p-2.5 text-center border rounded-lg transition-all ${
                    fitPreference === "oversized"
                      ? "border-brand-white bg-white/10 text-brand-white shadow-md"
                      : "border-brand-border/60 bg-brand-black/40 text-brand-silver hover:border-white/30"
                  }`}
                >
                  <span className="block text-xs font-bold uppercase">Oversized</span>
                  <span className="block text-[9px] text-brand-muted mt-0.5">Ombros caídos</span>
                </button>
              </div>
            </div>
          )}

          {/* Caixa de Recomendação de Tamanho */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-950/40 via-brand-card to-emerald-950/30 border border-emerald-500/30 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-semibold uppercase tracking-widest text-emerald-400 flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5" />
                Recomendação Anatômica Black Store
              </span>
              <p className="text-xs text-brand-silver/90 mt-1">
                {isSneaker
                  ? `Numeração padrão brasileira indicada para ${(height / 100).toFixed(2)}m.`
                  : `Modelagem calibrada para caimento ${fitPreference} impecável.`}
              </p>
            </div>
            <div className="text-right pl-4 border-l border-white/10">
              <span className="text-[10px] uppercase tracking-wider text-brand-muted block">
                Tamanho
              </span>
              <span className="font-display text-3xl sm:text-4xl font-extrabold text-brand-white tracking-tight">
                {recommendedSize}
              </span>
            </div>
          </div>
        </div>

        {/* Rodapé / Ação de Pedido com Tamanho Pronto */}
        <div className="p-5 sm:p-6 border-t border-brand-border/60 bg-brand-card/80 flex flex-col sm:flex-row gap-3">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 inline-flex items-center justify-center gap-2 py-3.5 bg-brand-white text-brand-black text-xs font-bold uppercase tracking-widest hover:bg-brand-silver transition-all duration-200 shadow-xl"
          >
            <MessageCircle className="w-4 h-4 text-emerald-600" />
            Pedir no Tamanho {recommendedSize} via WhatsApp
            <ArrowRight className="w-3.5 h-3.5" />
          </a>
          <button
            onClick={onClose}
            className="py-3 px-5 text-xs font-semibold uppercase tracking-wider text-brand-silver hover:text-white transition-colors"
          >
            Voltar
          </button>
        </div>

      </div>
    </div>
  );
}
