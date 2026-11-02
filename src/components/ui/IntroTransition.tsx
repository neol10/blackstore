"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";

export function IntroTransition() {
  const [stage, setStage] = useState<"loading" | "opening" | "completed">("loading");

  useEffect(() => {
    // Travar scroll durante a transição de abertura
    document.body.style.overflow = "hidden";

    // Fase 1: Revelação ágil do emblema e disparo da abertura
    const timer1 = setTimeout(() => {
      setStage("opening");
    }, 500);

    // Fase 2: Conclusão da abertura e liberação imediata da interface
    const timer2 = setTimeout(() => {
      setStage("completed");
      document.body.style.overflow = "";
    }, 1250);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      document.body.style.overflow = "";
    };
  }, []);

  if (stage === "completed") return null;

  const isOpening = stage === "opening";

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 z-50 pointer-events-none select-none overflow-hidden"
    >
      {/* Porta Esquerda (Left Shutter Door) */}
      <div
        className={`absolute top-0 left-0 w-1/2 h-full bg-[#080808] border-r border-[#222222] transition-transform duration-[700ms] ease-[cubic-bezier(0.85,0,0.15,1)] pointer-events-auto ${
          isOpening ? "-translate-x-full" : "translate-x-0"
        }`}
      >
        <div className="absolute inset-0 bg-radial-gradient from-transparent to-black/60" />
      </div>

      {/* Porta Direita (Right Shutter Door) */}
      <div
        className={`absolute top-0 right-0 w-1/2 h-full bg-[#080808] border-l border-[#222222] transition-transform duration-[700ms] ease-[cubic-bezier(0.85,0,0.15,1)] pointer-events-auto ${
          isOpening ? "translate-x-full" : "translate-x-0"
        }`}
      >
        <div className="absolute inset-0 bg-radial-gradient from-transparent to-black/60" />
      </div>

      {/* Linha de Feixe de Luz Central (Fenda que se abre) */}
      <div
        className={`absolute top-0 left-1/2 -translate-x-1/2 w-[1px] h-full bg-gradient-to-b from-transparent via-brand-silver to-transparent transition-opacity duration-300 pointer-events-none ${
          isOpening ? "opacity-0 scale-y-125" : "opacity-80"
        }`}
      />

      {/* Emblema Central e Tipografia */}
      <div
        className={`absolute inset-0 flex flex-col items-center justify-center z-10 transition-all duration-400 pointer-events-none ${
          isOpening
            ? "opacity-0 scale-105 filter blur-sm"
            : "opacity-100 scale-100"
        }`}
      >
        {/* Glow de fundo */}
        <div className="absolute w-64 h-64 bg-brand-silver/5 rounded-full blur-3xl animate-pulse" />

        <div className="relative flex flex-col items-center">
          {/* Brasão Heráldico Original */}
          <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden border border-brand-silver/30 shadow-[0_0_40px_rgba(255,255,255,0.08)] bg-black p-1 mb-5">
            <Image
              src="/logo.jpg"
              alt="BLACK STORE"
              fill
              className="object-contain"
              priority
            />
          </div>

          {/* Nome da Marca com Lettering Espaçado */}
          <span className="font-display text-2xl sm:text-3xl font-bold tracking-[0.35em] text-brand-white uppercase leading-none text-center">
            BLACK STORE
          </span>

          {/* Slogan */}
          <span className="text-[10px] sm:text-xs uppercase tracking-[0.4em] text-brand-silver/70 font-sans mt-3 text-center">
            Elegância em cada detalhe
          </span>

          {/* Indicador sutil de carregamento em barra fina de luxo */}
          <div className="w-24 h-[1px] bg-brand-border/60 mt-6 overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-brand-white to-transparent animate-[shimmer_1.5s_infinite]" />
          </div>
        </div>
      </div>
    </div>
  );
}
