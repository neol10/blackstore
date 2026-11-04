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
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  // Monitora preferências de movimento reduzido
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

  // Transição progressiva de scroll com requestAnimationFrame (60fps/120fps)
  useEffect(() => {
    let animationFrameId: number;

    const handleScroll = () => {
      cancelAnimationFrame(animationFrameId);
      animationFrameId = requestAnimationFrame(() => {
        if (!heroRef.current) return;
        const heroHeight = heroRef.current.offsetHeight || window.innerHeight;
        const currentScroll = window.scrollY;

        // Progresso normalizado de 0 a 1 conforme o usuário rola o Hero
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

  // Leve resposta de perspectiva interativa no desktop (mesclando vídeo e ponteiro)
  useEffect(() => {
    if (prefersReducedMotion) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (window.innerWidth < 1024) return;
      const x = (e.clientX / window.innerWidth - 0.5) * 8;
      const y = (e.clientY / window.innerHeight - 0.5) * 8;
      setMousePos({ x, y });
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [prefersReducedMotion]);

  // Performance: pausa o vídeo fora da tela
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

  // ==========================================
  // EFEITO EXCLUSIVO: KINETIC STRETCH & BLEND
  // ==========================================
  // O vídeo "espicha" verticalmente como uma lente anamórfica de cinema
  const stretchY = prefersReducedMotion ? 1 : 1 + scrollProgress * 0.16;
  const stretchX = prefersReducedMotion ? 1 : 1 - scrollProgress * 0.03;
  const videoOpacity = 1 - scrollProgress * 0.6;
  const contentTranslateY = prefersReducedMotion ? 0 : scrollProgress * 65;
  const contentOpacity = 1 - scrollProgress * 0.75;
  const titleLetterSpacing = prefersReducedMotion ? "0.02em" : `${scrollProgress * 0.12}em`;

  return (
    <section
      ref={heroRef}
      id="inicio"
      className="relative min-h-screen flex flex-col justify-center overflow-hidden bg-brand-black pt-32 pb-16 sm:pt-36 sm:pb-20 lg:pt-40 lg:pb-24 select-none"
    >
      {/* 1. Camada de Fundo Cinematográfica que "Espicha" e responde ao mouse */}
      <div
        className="absolute inset-0 z-0 pointer-events-none overflow-hidden origin-center"
        style={{
          transform: `scale(${stretchX}, ${stretchY}) translate3d(${mousePos.x * 0.4}px, ${mousePos.y * 0.4}px, 0)`,
          opacity: videoOpacity,
          willChange: "transform, opacity",
          transition: "transform 0.15s cubic-bezier(0.2, 0.8, 0.2, 1), opacity 0.1s linear",
        }}
      >
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster="/media/hero-poster.jpg"
          className="w-full h-full object-cover object-[center_20%] sm:object-[center_25%] filter brightness-[0.78] contrast-[1.12]"
        >
          <source src="/media/hero-banner.mp4" type="video/mp4" />
        </video>

        {/* Gradientes editoriais com fusão de luz suave */}
        <div className="absolute inset-0 bg-gradient-to-t from-brand-black via-brand-black/40 to-brand-black/80" />
        <div className="absolute inset-0 bg-radial-gradient from-transparent via-brand-black/30 to-brand-black/90" />
      </div>

      {/* 2. Moldura Arquitetônica de Cinema que Espicha ao Rolar (Kinetic Frame) */}
      <div
        className="absolute inset-x-4 sm:inset-x-12 top-24 bottom-12 border-x border-brand-silver/15 pointer-events-none z-10 hidden md:block"
        style={{
          transform: `scaleY(${1 + scrollProgress * 0.25})`,
          opacity: 1 - scrollProgress * 0.8,
          transformOrigin: "center top",
          willChange: "transform, opacity",
          transition: "transform 0.12s ease-out, opacity 0.1s linear",
        }}
      >
        {/* Marcadores de cantos de câmera editorial */}
        <div className="absolute -top-[1px] left-0 w-4 h-[1px] bg-brand-silver/50" />
        <div className="absolute -top-[1px] right-0 w-4 h-[1px] bg-brand-silver/50" />
        <div className="absolute -bottom-[1px] left-0 w-4 h-[1px] bg-brand-silver/50" />
        <div className="absolute -bottom-[1px] right-0 w-4 h-[1px] bg-brand-silver/50" />
      </div>

      {/* 3. Letras Monumentais Translúcidas que se Mesclam com o Vídeo ao Rolar */}
      <div
        className="absolute right-4 lg:right-16 top-1/2 -translate-y-1/2 pointer-events-none z-0 hidden lg:block overflow-hidden"
        style={{
          transform: `translateY(${-scrollProgress * 90}px) scaleY(${1 + scrollProgress * 0.3})`,
          opacity: 0.15 + scrollProgress * 0.1,
          willChange: "transform, opacity",
        }}
      >
        <span className="font-display font-extrabold text-[14vw] tracking-tighter text-transparent uppercase leading-none select-none [-webkit-text-stroke:1.5px_rgba(255,255,255,0.35)] mix-blend-overlay">
          BLACK
        </span>
      </div>

      {/* 4. Conteúdo Principal Mesclado ao Vídeo com Parallax e Tipografia Elástica */}
      <div
        className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full my-auto"
        style={{
          transform: `translate3d(0, ${contentTranslateY}px, 0)`,
          opacity: contentOpacity,
          willChange: "transform, opacity",
          transition: "transform 0.1s cubic-bezier(0.2, 0.8, 0.2, 1), opacity 0.1s linear",
        }}
      >
        <div className="max-w-3xl">
          {/* Badge de Posicionamento com Vidro Líquido Refletivo */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-black/60 border border-brand-silver/30 backdrop-blur-xl mb-6 shadow-2xl">
            <Sparkles className="w-3.5 h-3.5 text-brand-white animate-pulse" />
            <span className="text-[11px] font-medium tracking-widest text-brand-white uppercase">
              {siteConfig.demoMode
                ? "Vitrine Conceito • Demonstração Comercial"
                : "Moda Masculina • Coleções 2026"}
            </span>
          </div>

          {/* Título Principal com Efeito de Mesclagem Ótica e Alongamento Dinâmico */}
          <h1
            className="font-display text-5xl sm:text-7xl lg:text-8xl font-bold tracking-tight uppercase leading-[0.95] mb-6 drop-shadow-2xl transition-[letter-spacing] duration-150"
            style={{
              letterSpacing: titleLetterSpacing,
            }}
          >
            <span className="text-white block drop-shadow-md">
              Seu Estilo.
            </span>
            <span className="relative inline-block text-transparent bg-clip-text bg-gradient-to-r from-brand-white via-zinc-200 to-brand-silver backdrop-blur-sm">
              Sua Presença.
              {/* Linha de fusão luminescente que conecta o texto ao homem de terno */}
              <span
                className="absolute -bottom-2 left-0 h-[2px] bg-gradient-to-r from-white via-brand-silver to-transparent transition-all duration-300"
                style={{
                  width: `${Math.min(100, 30 + scrollProgress * 120)}%`,
                  opacity: 0.8 + scrollProgress * 0.2,
                }}
              />
            </span>
          </h1>

          {/* Subtítulo com excelente contraste e legibilidade */}
          <p className="text-base sm:text-lg lg:text-xl text-brand-offwhite/90 max-w-xl font-normal leading-relaxed mb-10 drop-shadow-md">
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
              className="inline-flex items-center justify-center gap-2.5 px-8 py-4 bg-brand-black/70 backdrop-blur-xl text-brand-offwhite border border-brand-silver/30 text-xs font-semibold uppercase tracking-widest hover:border-brand-white hover:bg-brand-graphite hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-brand-silver shadow-2xl"
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

      {/* 5. Efeito de Fusão Inferior: Tecido Escuro que se estica para a próxima seção */}
      <div
        className="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-b from-transparent via-brand-black/60 to-brand-black pointer-events-none z-10"
        style={{
          transform: `scaleY(${1 + scrollProgress * 0.8})`,
          transformOrigin: "bottom",
          willChange: "transform",
        }}
      />
    </section>
  );
}
