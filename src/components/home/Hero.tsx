"use client";

import React, { useEffect, useRef, useState } from "react";
import { MessageCircle, Sparkles } from "lucide-react";
import { createWhatsAppLink } from "@/lib/whatsapp";
import { siteConfig } from "@/config/site";

export function Hero() {
  const heroRef = useRef<HTMLElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [isDesktop, setIsDesktop] = useState(true);

  // Monitora preferências de movimento reduzido e largura de tela
  useEffect(() => {
    if (typeof window !== "undefined") {
      const mediaQueryMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
      setPrefersReducedMotion(mediaQueryMotion.matches);

      const handleMotionChange = (e: MediaQueryListEvent) => {
        setPrefersReducedMotion(e.matches);
      };
      mediaQueryMotion.addEventListener("change", handleMotionChange);

      const checkScreen = () => {
        setIsDesktop(window.innerWidth >= 1024);
      };
      checkScreen();
      window.addEventListener("resize", checkScreen);

      return () => {
        mediaQueryMotion.removeEventListener("change", handleMotionChange);
        window.removeEventListener("resize", checkScreen);
      };
    }
  }, []);

  // Transição suave sincronizada ao scroll com requestAnimationFrame (60fps/120fps)
  useEffect(() => {
    let animationFrameId: number;

    const handleScroll = () => {
      cancelAnimationFrame(animationFrameId);
      animationFrameId = requestAnimationFrame(() => {
        if (!heroRef.current) return;
        const heroHeight = heroRef.current.offsetHeight || window.innerHeight;
        const currentScroll = window.scrollY;

        // Progresso normalizado de 0 a 1 conforme o usuário rola o Hero
        const progress = Math.min(Math.max(currentScroll / (heroHeight * 0.9), 0), 1);
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

  // Performance: pausa o vídeo quando fora da viewport
  useEffect(() => {
    const heroEl = heroRef.current;
    const videoEl = videoRef.current;
    if (!heroEl || !videoEl) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          videoEl.play().catch(() => {});
        } else {
          videoEl.pause();
        }
      },
      { threshold: 0.05 }
    );

    observer.observe(heroEl);
    return () => observer.disconnect();
  }, []);

  // ==========================================================
  // OPÇÃO 1: PORTAL EDITORIAL EXPANSIVO (TAILORED MAGAZINE FRAME)
  // ==========================================================
  // O vídeo começa em uma elegante moldura vertical estilo editorial/revista.
  // Ao rolar (scrollProgress de 0 a 0.65), a moldura se "espicha" e expande até cobrir a tela inteira.
  // A partir de 0.65 até 1.0, o hero esmaece para revelar com perfeição o catálogo de produtos.
  const expansion = prefersReducedMotion ? 0 : Math.min(scrollProgress / 0.7, 1);
  const fadeOut = prefersReducedMotion
    ? 1 - scrollProgress * 0.6
    : Math.max(1 - (scrollProgress - 0.45) * 2, 0);

  // Interpolações dinâmicas para o Portal Editorial
  // No desktop: de recorte vertical assimétrico à direita para tela cheia
  // No mobile: de janela vertical nobre centralizada para tela cheia
  const portalInsetTop = isDesktop ? (1 - expansion) * 10 : (1 - expansion) * 12; // em porcentagem (%)
  const portalInsetBottom = isDesktop ? (1 - expansion) * 8 : (1 - expansion) * 10;
  const portalInsetRight = isDesktop ? (1 - expansion) * 4 : (1 - expansion) * 4;
  const portalInsetLeft = isDesktop ? 52 - expansion * 52 : (1 - expansion) * 4;
  const portalBorderRadius = prefersReducedMotion ? 0 : (1 - expansion) * 16;
  const portalBorderOpacity = prefersReducedMotion ? 0.2 : (1 - expansion) * 0.4;

  // Animação de texto e conteúdo
  const contentTranslateY = prefersReducedMotion ? 0 : scrollProgress * 50;
  const contentOpacity = Math.max(1 - scrollProgress * 1.5, 0);

  return (
    <section
      ref={heroRef}
      id="inicio"
      className="relative min-h-[105vh] flex flex-col justify-center overflow-hidden bg-brand-black pt-28 pb-16 sm:pt-32 sm:pb-20 lg:pt-36 lg:pb-24 select-none"
    >
      {/* ==========================================================
          1. FUNDO EDITORIAL COM AMBIENTAÇÃO SUTIL E RITMO DE MARCA
          ========================================================== */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Letras monumentais "BLACK STORE" de fundo em tom sutil de alfaiataria */}
        <div
          className="absolute left-6 lg:left-12 top-1/2 -translate-y-1/2 opacity-[0.04] font-display font-extrabold text-[18vw] uppercase leading-none select-none tracking-tighter"
          style={{
            transform: `translateY(calc(-50% - ${scrollProgress * 60}px))`,
          }}
        >
          BLACK
        </div>

        {/* Gradiente sutil e vinheta cinematográfica */}
        <div className="absolute inset-0 bg-radial-gradient from-brand-graphite/30 via-brand-black/90 to-brand-black" />
      </div>

      {/* ==========================================================
          2. O PORTAL EDITORIAL EXPANSIVO (THE TAILORED MAGAZINE FRAME)
          ========================================================== */}
      <div
        className="absolute z-10 overflow-hidden shadow-2xl transition-[inset,border-radius,box-shadow] duration-200 ease-out"
        style={{
          top: `${portalInsetTop}%`,
          bottom: `${portalInsetBottom}%`,
          left: `${portalInsetLeft}%`,
          right: `${portalInsetRight}%`,
          borderRadius: `${portalBorderRadius}px`,
          border: `1px solid rgba(220, 220, 230, ${portalBorderOpacity})`,
          boxShadow: expansion > 0.8 ? "none" : "0 25px 60px -15px rgba(0, 0, 0, 0.9)",
          willChange: "top, bottom, left, right, border-radius",
        }}
      >
        {/* Vídeo do Homem de Terno contido no Portal */}
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster="/media/hero-poster.jpg"
          className="w-full h-full object-cover object-[center_20%] sm:object-[center_25%] filter brightness-[0.88] contrast-[1.08] transition-transform duration-300"
          style={{
            transform: `scale(${1 + expansion * 0.08})`,
            willChange: "transform",
          }}
        >
          <source src="/media/hero-banner.mp4" type="video/mp4" />
        </video>

        {/* Camada de Gradiente que se funde com os textos conforme a expansão */}
        <div
          className="absolute inset-0 transition-opacity duration-300 pointer-events-none"
          style={{
            background: isDesktop
              ? `linear-gradient(to right, rgba(10,10,10,${0.85 * (1 - expansion)}), rgba(10,10,10,0.1) 40%, rgba(10,10,10,${0.6 * (1 - expansion)}))`
              : `linear-gradient(to top, rgba(10,10,10,0.92) 15%, rgba(10,10,10,0.3) 60%, rgba(10,10,10,0.7) 100%)`,
          }}
        />

        {/* Degradê de fusão inferior cinematográfico para transição à próxima seção */}
        <div className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-brand-black via-brand-black/50 to-transparent pointer-events-none" />

        {/* Detalhes Editoriais de Revista (Marcadores de Alfaiataria e Cantoneiras Prateadas) */}
        {expansion < 0.7 && (
          <div
            className="absolute inset-0 pointer-events-none transition-opacity duration-300"
            style={{ opacity: Math.max(0, 1 - expansion * 1.6) }}
          >
            {/* Tag Editorial superior */}
            <div className="absolute top-4 left-4 right-4 flex items-center justify-between text-[10px] tracking-[0.25em] text-brand-silver/70 uppercase font-mono bg-brand-black/40 backdrop-blur-md px-3 py-1.5 border border-brand-silver/20 rounded">
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                BLACK STORE EDITORIAL
              </span>
              <span>LOOKBOOK 2026</span>
            </div>

            {/* Cantoneiras de alfaiataria em prata de alta precisão */}
            <div className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 border-brand-silver/60" />
            <div className="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 border-brand-silver/60" />
            <div className="absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2 border-brand-silver/60" />
            <div className="absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 border-brand-silver/60" />

            {/* Indicador de expansão cinético sutil */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-[9px] uppercase tracking-[0.2em] text-brand-offwhite/60 bg-brand-black/60 backdrop-blur-sm px-2.5 py-1 rounded-full border border-brand-silver/20">
              Role para expandir
            </div>
          </div>
        )}
      </div>

      {/* ==========================================================
          3. CONTEÚDO PRINCIPAL (TIPOGRAFIA, CTAS E MICRO-INFORMATIVOS)
          ========================================================== */}
      <div
        className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full my-auto transition-transform duration-100 ease-out"
        style={{
          transform: `translate3d(0, ${contentTranslateY}px, 0)`,
          opacity: contentOpacity,
          willChange: "transform, opacity",
        }}
      >
        <div className="max-w-xl lg:max-w-2xl">
          {/* Badge de Posicionamento com Vidro Líquido Refletivo */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-black/75 border border-brand-silver/30 backdrop-blur-xl mb-6 shadow-2xl">
            <Sparkles className="w-3.5 h-3.5 text-brand-white animate-pulse" />
            <span className="text-[11px] font-medium tracking-widest text-brand-white uppercase">
              {siteConfig.demoMode
                ? "Vitrine Conceito • Demonstração Comercial"
                : "Moda Masculina • Coleções 2026"}
            </span>
          </div>

          {/* Título Principal com Tipografia Monumental e Linha de Fusão */}
          <h1 className="font-display text-5xl sm:text-7xl lg:text-8xl font-bold tracking-tight uppercase leading-[0.95] mb-6 drop-shadow-2xl">
            <span className="text-white block drop-shadow-md">
              Seu Estilo.
            </span>
            <span className="relative inline-block text-transparent bg-clip-text bg-gradient-to-r from-brand-white via-zinc-200 to-brand-silver backdrop-blur-sm">
              Sua Presença.
              {/* Linha luminosa conectando o texto ao portal do vídeo */}
              <span
                className="absolute -bottom-2 left-0 h-[2px] bg-gradient-to-r from-white via-brand-silver to-transparent transition-all duration-300"
                style={{
                  width: `${Math.min(100, 40 + scrollProgress * 100)}%`,
                  opacity: 0.8 + scrollProgress * 0.2,
                }}
              />
            </span>
          </h1>

          {/* Subtítulo com excelente contraste e legibilidade */}
          <p className="text-base sm:text-lg lg:text-xl text-brand-offwhite/90 max-w-xl font-normal leading-relaxed mb-10 drop-shadow-md bg-brand-black/30 lg:bg-transparent backdrop-blur-sm lg:backdrop-blur-none p-3 lg:p-0 rounded-lg">
            Moda masculina para quem valoriza estilo, conforto e personalidade.
            Do casual à alfaiataria contemporânea e estética esportiva urbana.
          </p>

          {/* CTAs Interativos 100% Clicáveis */}
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
              className="inline-flex items-center justify-center gap-2.5 px-8 py-4 bg-brand-black/80 backdrop-blur-xl text-brand-offwhite border border-brand-silver/30 text-xs font-semibold uppercase tracking-widest hover:border-brand-white hover:bg-brand-graphite hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-brand-silver shadow-2xl"
            >
              <MessageCircle className="w-4 h-4 text-emerald-400" />
              Fale com a Black Store
            </a>
          </div>

          {/* Micro informativos inferiores com separadores elegantes */}
          <div className="grid grid-cols-3 gap-6 pt-10 mt-10 border-t border-brand-border/40 text-left bg-brand-black/30 lg:bg-transparent backdrop-blur-sm lg:backdrop-blur-none p-3 lg:p-0 rounded-lg">
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

      {/* ==========================================================
          4. TRANSIÇÃO DE ESCURIDÃO FINAL PARA AS COLEÇÕES
          ========================================================== */}
      <div
        className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-b from-transparent to-brand-black pointer-events-none z-20"
        style={{
          opacity: Math.min(scrollProgress * 1.8, 1),
        }}
      />
    </section>
  );
}
