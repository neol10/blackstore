"use client";

import React, { useEffect, useRef, useState } from "react";
import { MessageCircle, Sparkles } from "lucide-react";
import { createWhatsAppLink } from "@/lib/whatsapp";
import { siteConfig } from "@/config/site";

export function Hero() {
  const containerRef = useRef<HTMLElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  // Monitora preferências de acessibilidade
  useEffect(() => {
    if (typeof window !== "undefined") {
      const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
      setPrefersReducedMotion(mediaQuery.matches);

      const handleChange = (e: MediaQueryListEvent) => {
        setPrefersReducedMotion(e.matches);
      };
      mediaQuery.addEventListener("change", handleChange);
      return () => mediaQuery.removeEventListener("change", handleChange);
    }
  }, []);

  // Monitora o progresso do scroll relativo à seção (0 = topo, 1 = fim da transição para produtos)
  useEffect(() => {
    let animationFrameId: number;

    const handleScroll = () => {
      cancelAnimationFrame(animationFrameId);
      animationFrameId = requestAnimationFrame(() => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        const totalScrollable = containerRef.current.offsetHeight - window.innerHeight;

        if (totalScrollable > 0) {
          // Progresso de 0 no topo até 1 quando a seção seguinte chega na viewport
          const progress = Math.min(Math.max(-rect.top / totalScrollable, 0), 1);
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

  // Performance: gerencia reprodução do vídeo
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
  // TRANSIÇÃO TRANSCENDENTAL (Tamanho Normal -> Expansão Tela Cheia -> Fade Out)
  // =========================================================================
  // FASE 1: Expansão (0 -> 0.45): O vídeo parte do tamanho normal e se expande a 100% da tela
  const expansionProgress = prefersReducedMotion ? 1 : Math.min(scrollProgress / 0.45, 1);

  // FASE 2: Desaparecimento suave ao chegar nos produtos (0.75 -> 1.0)
  const fadeOutProgress = prefersReducedMotion
    ? Math.max(1 - scrollProgress * 1.5, 0)
    : scrollProgress <= 0.7
    ? 1
    : Math.max(1 - (scrollProgress - 0.7) / 0.3, 0);

  // Dimensões do vídeo: Começa em tamanho normal elegante e se expande até preencher toda a tela
  const containerInset = prefersReducedMotion ? 0 : (1 - expansionProgress) * 28; // em pixels
  const containerRadius = prefersReducedMotion ? 0 : (1 - expansionProgress) * 20; // border radius
  const borderOpacity = prefersReducedMotion ? 0 : (1 - expansionProgress) * 0.35;

  // Animação de texto e CTAs: Desaparecem suavemente quando o vídeo transcende para o fundo
  const textOpacity = prefersReducedMotion ? 1 : Math.max(1 - scrollProgress * 2.8, 0);
  const textTranslateY = prefersReducedMotion ? 0 : -scrollProgress * 60;

  return (
    <section
      ref={containerRef}
      id="inicio"
      className="relative min-h-[190vh] bg-brand-black select-none"
    >
      {/* Container Sticky: Permanece fixo na viewport enquanto o usuário rola a seção */}
      <div className="sticky top-0 h-screen w-full overflow-hidden flex flex-col justify-center">

        {/* 1. O VÍDEO CINEMATOGRÁFICO TRANSCENDENTAL (TAMANHO NORMAL -> FUNDO TELA CHEIA -> SOME) */}
        <div
          className="absolute z-0 overflow-hidden shadow-2xl transition-[inset,border-radius] duration-150 ease-out will-change-[inset,border-radius,opacity]"
          style={{
            top: `${containerInset}px`,
            bottom: `${containerInset}px`,
            left: `${containerInset}px`,
            right: `${containerInset}px`,
            borderRadius: `${containerRadius}px`,
            border: `1px solid rgba(255, 255, 255, ${borderOpacity})`,
            opacity: fadeOutProgress,
          }}
        >
          {/* Vídeo do Homem de Terno (Proporção natural preservada sem qualquer distorção) */}
          <video
            ref={videoRef}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            poster="/media/hero-poster.jpg"
            className="w-full h-full object-cover object-[center_20%] sm:object-[center_25%] filter brightness-[0.82] contrast-[1.08] transition-transform duration-300 ease-out"
            style={{
              transform: `scale(${1 + expansionProgress * 0.05})`,
            }}
          >
            <source src="/media/hero-banner.mp4" type="video/mp4" />
          </video>

          {/* Gradientes cinematográficos de iluminação e legibilidade de luxo */}
          <div className="absolute inset-0 bg-gradient-to-t from-brand-black/90 via-brand-black/40 to-brand-black/70 pointer-events-none" />
          <div className="absolute inset-0 bg-radial-gradient from-transparent via-brand-black/20 to-brand-black/80 pointer-events-none" />

          {/* Fusão inferior para dissolver suavemente nos produtos */}
          <div
            className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-brand-black via-brand-black/80 to-transparent pointer-events-none"
            style={{
              opacity: 0.6 + scrollProgress * 0.4,
            }}
          />
        </div>

        {/* 2. CONTEÚDO HERO (TEXTOS, CTAS E MICRO-INFORMATIVOS) */}
        <div
          className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full my-auto transition-transform duration-100 ease-out pointer-events-auto"
          style={{
            transform: `translate3d(0, ${textTranslateY}px, 0)`,
            opacity: textOpacity,
            pointerEvents: textOpacity < 0.15 ? "none" : "auto",
            willChange: "transform, opacity",
          }}
        >
          <div className="max-w-3xl">
            {/* Badge de Posicionamento */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-black/70 border border-brand-silver/30 backdrop-blur-xl mb-6 shadow-2xl">
              <Sparkles className="w-3.5 h-3.5 text-brand-white animate-pulse" />
              <span className="text-[11px] font-medium tracking-widest text-brand-white uppercase">
                {siteConfig.demoMode
                  ? "Vitrine Conceito • Demonstração Comercial"
                  : "Moda Masculina • Coleções 2026"}
              </span>
            </div>

            {/* Título Principal */}
            <h1 className="font-display text-5xl sm:text-7xl lg:text-8xl font-bold tracking-tight uppercase leading-[0.95] mb-6 drop-shadow-2xl">
              <span className="text-white block drop-shadow-md">
                Seu Estilo.
              </span>
              <span className="relative inline-block text-transparent bg-clip-text bg-gradient-to-r from-brand-white via-zinc-200 to-brand-silver">
                Sua Presença.
              </span>
            </h1>

            {/* Subtítulo */}
            <p className="text-base sm:text-lg lg:text-xl text-brand-offwhite/90 max-w-xl font-normal leading-relaxed mb-10 drop-shadow-md">
              Moda masculina para quem valoriza estilo, conforto e personalidade.
              Do casual à alfaiataria contemporânea e estética esportiva urbana.
            </p>

            {/* CTAs Interativos */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 relative z-30">
              <a
                href="#colecoes"
                className="inline-flex items-center justify-center px-8 py-4 bg-brand-white text-brand-black text-xs font-bold uppercase tracking-widest hover:bg-brand-silver hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 shadow-2xl focus:outline-none focus:ring-2 focus:ring-brand-silver"
              >
                Explorar Coleções
              </a>

              <a
                href={createWhatsAppLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2.5 px-8 py-4 bg-brand-black/75 backdrop-blur-xl text-brand-offwhite border border-brand-silver/30 text-xs font-semibold uppercase tracking-widest hover:border-brand-white hover:bg-brand-graphite hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-brand-silver shadow-2xl"
              >
                <MessageCircle className="w-4 h-4 text-emerald-400" />
                Fale com a Black Store
              </a>
            </div>

            {/* Micro informativos inferiores com separadores elegantes */}
            <div className="grid grid-cols-3 gap-6 pt-10 mt-10 border-t border-brand-border/40 text-left">
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
                <p className="text-sm font-semibold text-brand-white mt-1">Exclusivo via WhatsApp</p>
              </div>
            </div>
          </div>
        </div>

        {/* 3. Camada de Dissolução Preta para Entrega Perfeita aos Produtos */}
        <div
          className="absolute inset-0 bg-brand-black pointer-events-none z-20 transition-opacity duration-150 ease-out"
          style={{
            opacity: Math.max(0, (scrollProgress - 0.72) / 0.28),
          }}
        />
      </div>
    </section>
  );
}
