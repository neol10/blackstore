"use client";

import React, { useEffect, useRef, useState } from "react";
import { MessageCircle, Sparkles } from "lucide-react";
import { createWhatsAppLink } from "@/lib/whatsapp";
import { siteConfig } from "@/config/site";

export function Hero() {
  const heroRef = useRef<HTMLElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Inicialização infalível do vídeo em qualquer navegador
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Garante flags de mídia para autoplay nativo
    video.muted = true;
    video.defaultMuted = true;
    video.playsInline = true;

    const startPlaying = () => {
      const promise = video.play();
      if (promise !== undefined) {
        promise.catch(() => {});
      }
    };

    if (video.readyState >= 2) {
      startPlaying();
    } else {
      video.addEventListener("loadeddata", startPlaying, { once: true });
      video.addEventListener("canplay", startPlaying, { once: true });
    }

    const unlock = () => {
      startPlaying();
      ["touchstart", "pointerdown", "click", "scroll"].forEach((ev) =>
        window.removeEventListener(ev, unlock)
      );
    };

    ["touchstart", "pointerdown", "click", "scroll"].forEach((ev) =>
      window.addEventListener(ev, unlock, { once: true, passive: true })
    );

    return () => {
      ["touchstart", "pointerdown", "click", "scroll"].forEach((ev) =>
        window.removeEventListener(ev, unlock)
      );
    };
  }, []);

  // Monitora a rolagem suavemente para transição de texto
  useEffect(() => {
    let animationFrameId: number;

    const handleScroll = () => {
      cancelAnimationFrame(animationFrameId);
      animationFrameId = requestAnimationFrame(() => {
        if (!heroRef.current) return;
        const heroHeight = heroRef.current.offsetHeight || window.innerHeight;
        const currentScroll = window.scrollY;

        const progress = Math.min(Math.max(currentScroll / heroHeight, 0), 1);
        setScrollProgress(progress);
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  const contentTranslateY = scrollProgress * 25;
  const contentOpacity = Math.max(1 - scrollProgress * 1.5, 0);

  return (
    <section
      ref={heroRef}
      id="inicio"
      className="relative min-h-[100dvh] w-full flex flex-col justify-center overflow-hidden bg-brand-black select-none pt-24 pb-12 sm:pt-28 sm:pb-16"
    >
      {/* 1. VÍDEO CINEMATOGRÁFICO DE FUNDO COM BLUR EQUILIBRADO E CONTRASTE PREMIUM */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <video
          ref={videoRef}
          src="/media/hero-banner.mp4"
          poster="/media/hero-poster.jpg"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          className="w-full h-full object-cover object-[center_35%] sm:object-[center_30%] filter blur-[3px] scale-105 brightness-[0.76] contrast-[1.08]"
        />

        {/* Gradiente sutil focado na coluna de texto (esquerda), preservando o homem de terno e a vitrine à direita */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/55 to-transparent pointer-events-none" />

        {/* Fusão inferior suave com a seção seguinte */}
        <div className="absolute inset-x-0 bottom-0 h-32 sm:h-40 bg-gradient-to-t from-brand-surface via-brand-surface/60 to-transparent pointer-events-none" />
      </div>

      {/* 2. CONTEÚDO PRINCIPAL (LIMPO E ELEGANTE NO CELULAR, COMPLETO NO COMPUTADOR) */}
      <div
        className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full my-auto pointer-events-auto"
        style={{
          transform: `translate3d(0, ${contentTranslateY}px, 0)`,
          opacity: contentOpacity,
          willChange: "transform, opacity",
        }}
      >
        <div className="max-w-2xl lg:max-w-3xl">
          {/* Badge: visível no desktop e tablet para manter o mobile minimalista */}
          <div className="hidden sm:inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-black/75 border border-brand-silver/30 backdrop-blur-xl mb-6 shadow-2xl">
            <Sparkles className="w-3.5 h-3.5 text-brand-white animate-pulse" />
            <span className="text-[11px] font-medium tracking-widest text-brand-white uppercase">
              {siteConfig.demoMode
                ? "Vitrine Conceito • Demonstração Comercial"
                : "Moda Masculina • Coleções 2026"}
            </span>
          </div>

          {/* Título Principal */}
          <h1 className="font-display text-4xl sm:text-6xl lg:text-8xl font-bold tracking-tight uppercase leading-[0.98] mb-4 sm:mb-6 drop-shadow-[0_4px_24px_rgba(0,0,0,0.95)] text-balance">
            <span className="text-white block drop-shadow-lg">
              Seu Estilo.
            </span>
            <span className="relative inline-block text-transparent bg-clip-text bg-gradient-to-r from-brand-white via-zinc-200 to-brand-silver drop-shadow-md">
              Sua Presença.
            </span>
          </h1>

          {/* Subtítulo */}
          <p className="text-sm sm:text-base lg:text-xl text-brand-offwhite max-w-xl font-normal leading-relaxed mb-6 sm:mb-10 drop-shadow-[0_2px_12px_rgba(0,0,0,0.95)] text-pretty">
            Moda masculina para quem valoriza estilo, conforto e personalidade.
            Do casual à alfaiataria contemporânea e estética esportiva urbana.
          </p>

          {/* Botões de Ação */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 relative z-30">
            <a
              href="#colecoes"
              className="inline-flex items-center justify-center px-7 py-3.5 sm:px-8 sm:py-4 bg-brand-white text-brand-black text-xs font-bold uppercase tracking-widest hover:bg-brand-silver hover:scale-[1.02] active:scale-[0.98] transition-[transform,background-color,color] duration-200 shadow-2xl focus:outline-none focus:ring-2 focus:ring-brand-silver text-center select-none"
            >
              Explorar Coleções
            </a>

            <a
              href={createWhatsAppLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 pl-6 pr-5 py-3.5 sm:pl-7 sm:pr-6 sm:py-4 bg-brand-black/80 backdrop-blur-xl text-brand-offwhite border border-brand-silver/30 text-xs font-semibold uppercase tracking-widest hover:border-brand-white hover:bg-brand-graphite hover:scale-[1.02] active:scale-[0.98] transition-[transform,background-color,border-color,color] duration-200 focus:outline-none focus:ring-2 focus:ring-brand-silver shadow-2xl text-center select-none"
            >
              <MessageCircle className="w-4 h-4 text-emerald-400" />
              Fale com a Black Store
            </a>
          </div>

          {/* Micro informativos */}
          <div className="hidden sm:grid grid-cols-3 gap-6 pt-8 mt-8 border-t border-brand-border/40 text-left">
            <div>
              <p className="text-xs uppercase tracking-widest text-brand-muted">Conceito</p>
              <p className="text-sm font-semibold text-brand-white mt-1">Streetwear & Luxo</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-widest text-brand-muted">Variedade</p>
              <p className="text-sm font-semibold text-brand-white mt-1">Casual a Esportivo</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-widest text-brand-muted">Atendimento</p>
              <p className="text-sm font-semibold text-brand-white mt-1">Via WhatsApp</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
