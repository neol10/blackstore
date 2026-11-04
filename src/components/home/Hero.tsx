"use client";

import React, { useEffect, useRef, useState } from "react";
import { MessageCircle, Sparkles } from "lucide-react";
import { createWhatsAppLink } from "@/lib/whatsapp";
import { siteConfig } from "@/config/site";

export function Hero() {
  const containerRef = useRef<HTMLElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isDesktop, setIsDesktop] = useState(true);

  // Detecta se é desktop ou mobile para aplicar a experiência mais fluida
  useEffect(() => {
    if (typeof window !== "undefined") {
      const checkScreen = () => {
        setIsDesktop(window.innerWidth >= 1024);
      };
      checkScreen();
      window.addEventListener("resize", checkScreen);
      return () => window.removeEventListener("resize", checkScreen);
    }
  }, []);

  // Monitora o progresso do scroll com requestAnimationFrame a 60fps/120fps (sem travas ou lag)
  useEffect(() => {
    let animationFrameId: number;

    const handleScroll = () => {
      cancelAnimationFrame(animationFrameId);
      animationFrameId = requestAnimationFrame(() => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        const totalScrollable = containerRef.current.offsetHeight - window.innerHeight;

        if (totalScrollable > 0) {
          const progress = Math.min(Math.max(-rect.top / totalScrollable, 0), 1);
          setScrollProgress(progress);
        } else {
          // No mobile ou alturas menores, calcula com base na rolagem da viewport
          const progress = Math.min(Math.max(window.scrollY / (window.innerHeight * 0.8), 0), 1);
          setScrollProgress(progress);
        }
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  // Performance: pausa o vídeo quando fora da viewport para economizar bateria e GPU
  useEffect(() => {
    const videoEl = videoRef.current;
    if (!videoEl) return;

    if (scrollProgress >= 0.98) {
      videoEl.pause();
    } else {
      videoEl.play().catch(() => {});
    }
  }, [scrollProgress]);

  // =========================================================================
  // DINÂMICA CINEMATOGRÁFICA TRANSCENDENTAL
  // =========================================================================
  // Desktop: Expansão ágil e orgânica sem sensação de travamento (140vh)
  // Mobile: Rolagem nativa ultra-fluida (100dvh)
  const expansion = isDesktop ? Math.min(scrollProgress / 0.4, 1) : 1;
  const fadeOut = isDesktop
    ? scrollProgress <= 0.65
      ? 1
      : Math.max(1 - (scrollProgress - 0.65) / 0.35, 0)
    : Math.max(1 - scrollProgress * 1.2, 0);

  // Dimensões do vídeo no desktop: tamanho normal inicial -> expande para tela cheia
  const desktopInset = isDesktop ? (1 - expansion) * 24 : 0; // pixels
  const desktopRadius = isDesktop ? (1 - expansion) * 16 : 0; // border-radius
  const borderOpacity = isDesktop ? (1 - expansion) * 0.25 : 0;

  // Deslocamento e fade do texto
  const textOpacity = isDesktop ? Math.max(1 - scrollProgress * 2.5, 0) : Math.max(1 - scrollProgress * 1.8, 0);
  const textTranslateY = -scrollProgress * 40;

  return (
    <section
      ref={containerRef}
      id="inicio"
      className={`relative bg-brand-black select-none ${
        isDesktop ? "min-h-[135vh]" : "min-h-[100dvh] flex flex-col justify-center pt-28 pb-12"
      }`}
    >
      {/* Container Sticky apenas no Desktop para evitar sensação de travamento no touch do celular */}
      <div
        className={`${
          isDesktop
            ? "sticky top-0 h-screen w-full overflow-hidden flex flex-col justify-center"
            : "relative w-full h-full flex flex-col justify-center flex-1"
        }`}
      >
        {/* 1. O VÍDEO CINEMATOGRÁFICO TRANSCENDENTAL (TAMANHO NORMAL -> FUNDO TELA CHEIA -> SOME NOS PRODUTOS) */}
        <div
          className={`${
            isDesktop
              ? "absolute z-0 overflow-hidden shadow-2xl will-change-transform"
              : "absolute inset-0 z-0 overflow-hidden"
          }`}
          style={{
            top: isDesktop ? `${desktopInset}px` : "0px",
            bottom: isDesktop ? `${desktopInset}px` : "0px",
            left: isDesktop ? `${desktopInset}px` : "0px",
            right: isDesktop ? `${desktopInset}px` : "0px",
            borderRadius: isDesktop ? `${desktopRadius}px` : "0px",
            border: borderOpacity > 0 ? `1px solid rgba(255, 255, 255, ${borderOpacity})` : "none",
            opacity: fadeOut,
          }}
        >
          {/* Vídeo do Homem de Terno (Proporção normal preservada sem distorção) */}
          <video
            ref={videoRef}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            poster="/media/hero-poster.jpg"
            className="w-full h-full object-cover object-[center_20%] sm:object-[center_25%] filter brightness-[0.82] contrast-[1.08]"
          >
            <source src="/media/hero-banner.mp4" type="video/mp4" />
          </video>

          {/* Gradientes cinematográficos de iluminação e legibilidade de luxo */}
          <div className="absolute inset-0 bg-gradient-to-t from-brand-black/95 via-brand-black/45 to-brand-black/75 pointer-events-none" />
          <div className="absolute inset-0 bg-radial-gradient from-transparent via-brand-black/20 to-brand-black/85 pointer-events-none" />

          {/* Fusão inferior para dissolver suavemente nos produtos */}
          <div className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-brand-black via-brand-black/70 to-transparent pointer-events-none" />
        </div>

        {/* 2. CONTEÚDO HERO (TEXTOS, CTAS E MICRO-INFORMATIVOS) */}
        <div
          className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full my-auto pointer-events-auto"
          style={{
            transform: `translate3d(0, ${textTranslateY}px, 0)`,
            opacity: textOpacity,
            pointerEvents: textOpacity < 0.1 ? "none" : "auto",
            willChange: "transform, opacity",
          }}
        >
          <div className="max-w-3xl">
            {/* Badge de Posicionamento */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-black/75 border border-brand-silver/30 backdrop-blur-xl mb-5 shadow-2xl">
              <Sparkles className="w-3.5 h-3.5 text-brand-white animate-pulse" />
              <span className="text-[10px] sm:text-[11px] font-medium tracking-widest text-brand-white uppercase">
                {siteConfig.demoMode
                  ? "Vitrine Conceito • Demonstração Comercial"
                  : "Moda Masculina • Coleções 2026"}
              </span>
            </div>

            {/* Título Principal */}
            <h1 className="font-display text-4xl sm:text-6xl lg:text-8xl font-bold tracking-tight uppercase leading-[0.98] mb-5 drop-shadow-2xl">
              <span className="text-white block drop-shadow-md">
                Seu Estilo.
              </span>
              <span className="relative inline-block text-transparent bg-clip-text bg-gradient-to-r from-brand-white via-zinc-200 to-brand-silver">
                Sua Presença.
              </span>
            </h1>

            {/* Subtítulo */}
            <p className="text-sm sm:text-base lg:text-xl text-brand-offwhite/90 max-w-xl font-normal leading-relaxed mb-8 drop-shadow-md">
              Moda masculina para quem valoriza estilo, conforto e personalidade.
              Do casual à alfaiataria contemporânea e estética esportiva urbana.
            </p>

            {/* CTAs Interativos */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 relative z-30">
              <a
                href="#colecoes"
                className="inline-flex items-center justify-center px-7 py-3.5 sm:px-8 sm:py-4 bg-brand-white text-brand-black text-xs font-bold uppercase tracking-widest hover:bg-brand-silver hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 shadow-2xl focus:outline-none focus:ring-2 focus:ring-brand-silver"
              >
                Explorar Coleções
              </a>

              <a
                href={createWhatsAppLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2.5 px-7 py-3.5 sm:px-8 sm:py-4 bg-brand-black/80 backdrop-blur-xl text-brand-offwhite border border-brand-silver/30 text-xs font-semibold uppercase tracking-widest hover:border-brand-white hover:bg-brand-graphite hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-brand-silver shadow-2xl"
              >
                <MessageCircle className="w-4 h-4 text-emerald-400" />
                Fale com a Black Store
              </a>
            </div>

            {/* Micro informativos inferiores perfeitamente espaçados */}
            <div className="grid grid-cols-3 gap-3 sm:gap-6 pt-8 mt-8 border-t border-brand-border/40 text-left">
              <div>
                <p className="text-[10px] sm:text-xs uppercase tracking-widest text-brand-muted">Conceito</p>
                <p className="text-xs sm:text-sm font-semibold text-brand-white mt-1">Streetwear & Luxo</p>
              </div>
              <div>
                <p className="text-[10px] sm:text-xs uppercase tracking-widest text-brand-muted">Variedade</p>
                <p className="text-xs sm:text-sm font-semibold text-brand-white mt-1">Casual a Esportivo</p>
              </div>
              <div>
                <p className="text-[10px] sm:text-xs uppercase tracking-widest text-brand-muted">Atendimento</p>
                <p className="text-xs sm:text-sm font-semibold text-brand-white mt-1">Via WhatsApp</p>
              </div>
            </div>
          </div>
        </div>

        {/* 3. Camada de Dissolução para Entrega Fluida aos Produtos no Desktop */}
        {isDesktop && (
          <div
            className="absolute inset-0 bg-brand-black pointer-events-none z-20"
            style={{
              opacity: Math.max(0, (scrollProgress - 0.7) / 0.3),
            }}
          />
        )}
      </div>
    </section>
  );
}
