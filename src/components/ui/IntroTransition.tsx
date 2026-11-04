"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";

export function IntroTransition() {
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    // Trava scroll apenas durante a execução da animação de entrada
    document.body.style.overflow = "hidden";

    // Libera a página após o término exato da animação CSS nativa
    const timer = setTimeout(() => {
      setIsCompleted(true);
      document.body.style.overflow = "";
    }, 1150);

    return () => {
      clearTimeout(timer);
      document.body.style.overflow = "";
    };
  }, []);

  if (isCompleted) return null;

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 z-50 pointer-events-none select-none overflow-hidden h-screen h-[100dvh]"
    >
      {/* Porta Esquerda (Left Shutter Door) com aceleração por GPU */}
      <div
        className="absolute top-0 left-0 w-1/2 h-full bg-[#080808] border-r border-[#222222] pointer-events-auto door-animate-left"
      >
        <div className="absolute inset-0 bg-radial-gradient from-transparent to-black/60" />
      </div>

      {/* Porta Direita (Right Shutter Door) com aceleração por GPU */}
      <div
        className="absolute top-0 right-0 w-1/2 h-full bg-[#080808] border-l border-[#222222] pointer-events-auto door-animate-right"
      >
        <div className="absolute inset-0 bg-radial-gradient from-transparent to-black/60" />
      </div>

      {/* Linha de Feixe de Luz Central (Fenda que se abre) */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[1px] h-full bg-gradient-to-b from-transparent via-brand-silver to-transparent pointer-events-none door-animate-slit"
      />

      {/* Emblema Central e Tipografia */}
      <div
        className="absolute inset-0 flex flex-col items-center justify-center z-10 pointer-events-none door-animate-emblem"
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
