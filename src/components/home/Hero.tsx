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

  // Performance: pausa o vídeo quando o hero sai da tela e retoma quando volta
  useEffect(() => {
    const heroEl = heroRef.current;
    const videoEl = videoRef.current;
    if (!heroEl || !videoEl) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          videoEl.play().catch(() => {
            // Autoplay contido/política do navegador: o poster assume o fallback
          });
        } else {
          videoEl.pause();
        }
      },
      { threshold: 0.05 }
    );

    observer.observe(heroEl);
    return () => observer.disconnect();
  }, []);

  // Cálculos suaves da transição cinematográfica
  // Zoom sutil: de 1 para 1.06
  const videoScale = prefersReducedMotion ? 1 : 1 + scrollProgress * 0.06;
  // Redução gradual da opacidade do vídeo: de 1 até ~0.35
  const videoOpacity = 1 - scrollProgress * 0.65;
  // Deslocamento vertical sutil do conteúdo: até 50px
  const contentTranslateY = prefersReducedMotion ? 0 : scrollProgress * 50;
  // Desvanecimento sutil do conteúdo ao aproximar da próxima seção
  const contentOpacity = 1 - scrollProgress * 0.7;

  return (
    <section
      ref={heroRef}
      id="inicio"
      className="relative min-h-screen flex flex-col justify-center overflow-hidden bg-brand-black pt-32 pb-16 sm:pt-36 sm:pb-20 lg:pt-40 lg:pb-24"
    >
      {/* Background Cinematográfico: Vídeo com Poster de Fallback */}
      <div
        className="absolute inset-0 z-0 pointer-events-none overflow-hidden"
        style={{
          transform: `scale(${videoScale})`,
          opacity: videoOpacity,
          willChange: "transform, opacity",
          transition: "transform 0.1s cubic-bezier(0.25, 1, 0.5, 1), opacity 0.1s linear",
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
          className="w-full h-full object-cover object-[center_20%] sm:object-[center_25%] filter brightness-[0.75] contrast-[1.08]"
        >
          <source src="/media/hero-banner.mp4" type="video/mp4" />
        </video>

        {/* Gradientes editoriais para máxima legibilidade e sofisticação */}
        <div className="absolute inset-0 bg-gradient-to-t from-brand-black via-brand-black/45 to-brand-black/80" />
        <div className="absolute inset-0 bg-radial-gradient from-transparent via-brand-black/35 to-brand-black/90" />
      </div>

      {/* Hero Content com Parallax Sutil e Conexão de Scroll */}
      <div
        className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full my-auto"
        style={{
          transform: `translate3d(0, ${contentTranslateY}px, 0)`,
          opacity: contentOpacity,
          willChange: "transform, opacity",
          transition: "transform 0.1s cubic-bezier(0.25, 1, 0.5, 1), opacity 0.1s linear",
        }}
      >
        <div className="max-w-3xl">
          {/* Badge de Demonstração / Posicionamento */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-graphite/80 border border-brand-border backdrop-blur-md mb-6 shadow-lg">
            <Sparkles className="w-3.5 h-3.5 text-brand-silver" />
            <span className="text-[11px] font-medium tracking-widest text-brand-silver uppercase">
              {siteConfig.demoMode
                ? "Vitrine Conceito • Demonstração Comercial"
                : "Moda Masculina • Coleções 2026"}
            </span>
          </div>

          {/* Main Title */}
          <h1 className="font-display text-5xl sm:text-7xl lg:text-8xl font-bold tracking-tight text-brand-white uppercase leading-[0.95] mb-6 drop-shadow-md">
            Seu Estilo.
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-white via-brand-silver to-brand-offwhite">
              Sua Presença.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg lg:text-xl text-brand-silver/90 max-w-xl font-normal leading-relaxed mb-10 drop-shadow">
            Moda masculina para quem valoriza estilo, conforto e personalidade.
            Do casual à alfaiataria contemporânea e estética esportiva urbana.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
            <a
              href="#colecoes"
              className="inline-flex items-center justify-center px-8 py-4 bg-brand-white text-brand-black text-xs font-bold uppercase tracking-widest hover:bg-brand-silver transition-all duration-300 shadow-2xl focus:outline-none focus:ring-2 focus:ring-brand-silver"
            >
              Explorar Coleções
            </a>

            <a
              href={createWhatsAppLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2.5 px-8 py-4 bg-brand-surface/85 backdrop-blur-md text-brand-offwhite border border-brand-border text-xs font-semibold uppercase tracking-widest hover:border-brand-silver hover:bg-brand-graphite transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-brand-silver shadow-xl"
            >
              <MessageCircle className="w-4 h-4 text-emerald-400" />
              Fale com a Black Store
            </a>
          </div>

          {/* Micro informativos */}
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
    </section>
  );
}
