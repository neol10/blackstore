"use client";

import React, { useEffect, useRef, useState } from "react";
import { MessageCircle, Sparkles, MapPin, ArrowUpRight } from "lucide-react";
import { createWhatsAppLink } from "@/lib/whatsapp";
import { siteConfig } from "@/config/site";

const rotatingWords = [
  "SUA PRESENÇA.",
  "SUA ATITUDE.",
  "SUA IDENTIDADE.",
  "SUA EXCLUSIVIDADE.",
];

export function Hero() {
  const heroRef = useRef<HTMLElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [currentWordIdx, setCurrentWordIdx] = useState(0);
  const [isWordAnimating, setIsWordAnimating] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);

  // Gatilho imediato de entrada das frases da esquerda para a direita
  useEffect(() => {
    const frameId = requestAnimationFrame(() => {
      setHasLoaded(true);
    });
    return () => cancelAnimationFrame(frameId);
  }, []);

  // Rotação suave de palavras no título com animação fluida (deslizando da esquerda)
  useEffect(() => {
    const interval = setInterval(() => {
      setIsWordAnimating(true);
      setTimeout(() => {
        setCurrentWordIdx((prev) => (prev + 1) % rotatingWords.length);
        setIsWordAnimating(false);
      }, 280);
    }, 3200);

    return () => clearInterval(interval);
  }, []);

  // Inicialização imediata do vídeo em qualquer navegador sem esperas de buffer
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = true;
    video.defaultMuted = true;
    video.playsInline = true;

    // Dispara play no primeiro milissegundo
    const playVideo = () => {
      const promise = video.play();
      if (promise !== undefined) {
        promise.catch(() => {});
      }
    };

    playVideo();

    // Fallback garantido ao primeiro toque ou clique se o navegador bloquear autoplay
    const unlock = () => {
      playVideo();
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
      {/* 1. VÍDEO CINEMATOGRÁFICO DE FUNDO COM STREAMING IMEDIATO E BLUR EQUILIBRADO */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          poster="/media/hero-poster.jpg"
          className="w-full h-full object-cover object-[center_35%] sm:object-[center_30%] filter blur-[3px] scale-105 brightness-[0.76] contrast-[1.08]"
        >
          <source src="/media/hero-banner.mp4" type="video/mp4" />
        </video>

        {/* Gradiente sutil focado na coluna de texto (esquerda), preservando o homem de terno e a vitrine à direita */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/55 to-transparent pointer-events-none" />

        {/* Fusão inferior suave com a seção seguinte */}
        <div className="absolute inset-x-0 bottom-0 h-32 sm:h-40 bg-gradient-to-t from-brand-surface via-brand-surface/60 to-transparent pointer-events-none" />
      </div>

      {/* 2. CONTEÚDO PRINCIPAL COM ANIMAÇÃO NATIVA INSTANTÂNEA SUB-400MS */}
      <div
        className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full my-auto pointer-events-auto"
        style={{
          transform: `translate3d(0, ${contentTranslateY}px, 0)`,
          opacity: contentOpacity,
          willChange: "transform, opacity",
        }}
      >
        <div className="max-w-2xl lg:max-w-3xl overflow-visible">
          {/* Badge Dinâmico: Entra da esquerda no milissegundo 0 */}
          <div className="hero-fast-badge inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-brand-black/85 border border-white/20 backdrop-blur-xl mb-6 shadow-2xl">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
            </span>
            <span className="text-[11px] font-semibold tracking-widest text-emerald-400 uppercase">
              Loja Física Aberta
            </span>
            <span className="text-white/20">•</span>
            <span className="text-[11px] font-medium tracking-widest text-brand-silver uppercase">
              Drop 2026 Disponível
            </span>
          </div>

          {/* Título Principal: Entra da esquerda em 0.12s */}
          <h1 className="hero-fast-title font-display text-4xl sm:text-6xl lg:text-8xl font-bold tracking-tight uppercase leading-[0.98] mb-5 sm:mb-6 drop-shadow-[0_4px_24px_rgba(0,0,0,0.95)] text-balance">
            <span className="text-white block drop-shadow-lg tracking-tight">
              Seu Estilo.
            </span>
            
            {/* Linha Dinâmica com Transição de Palavras da esquerda para direita */}
            <span className="relative inline-block h-[1.1em] overflow-hidden align-bottom">
              <span
                key={currentWordIdx}
                className={`inline-block text-transparent bg-clip-text bg-gradient-to-r from-brand-white via-zinc-100 to-brand-silver drop-shadow-md transition-all duration-300 ease-out ${
                  isWordAnimating
                    ? "opacity-0 -translate-x-8 blur-sm scale-95"
                    : "opacity-100 translate-x-0 blur-0 scale-100"
                }`}
              >
                {rotatingWords[currentWordIdx]}
              </span>
            </span>
          </h1>

          {/* Subtítulo: Entra da esquerda em 0.2s */}
          <p className="hero-fast-sub text-sm sm:text-base lg:text-xl text-brand-offwhite max-w-xl font-normal leading-relaxed mb-6 sm:mb-10 drop-shadow-[0_2px_12px_rgba(0,0,0,0.95)] text-pretty">
            Moda masculina para quem valoriza estilo, conforto e presença marcante.
            Do casual contemporâneo à alfaiataria de corte preciso e peças esportivas exclusivas.
          </p>

          {/* Botões de Ação com Efeito Shimmer: Entram em 0.28s */}
          <div className="hero-fast-buttons flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 relative z-30">
            <a
              href="#colecoes"
              className="relative group overflow-hidden inline-flex items-center justify-center px-7 py-3.5 sm:px-8 sm:py-4 bg-brand-white text-brand-black text-xs font-bold uppercase tracking-widest hover:bg-brand-silver hover:scale-[1.02] active:scale-[0.98] transition-[transform,background-color,color] duration-200 shadow-2xl focus:outline-none focus:ring-2 focus:ring-brand-silver text-center select-none"
            >
              {/* Feixe de luz sutil percorrendo o botão (Shimmer) */}
              <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full bg-gradient-to-r from-transparent via-white/50 to-transparent transition-transform duration-700 pointer-events-none" />
              <span className="relative z-10">Explorar Coleções</span>
            </a>

            <a
              href={createWhatsAppLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 pl-6 pr-5 py-3.5 sm:pl-7 sm:pr-6 sm:py-4 bg-brand-black/80 backdrop-blur-xl text-brand-offwhite border border-brand-silver/30 text-xs font-semibold uppercase tracking-widest hover:border-brand-white hover:bg-brand-graphite hover:scale-[1.02] active:scale-[0.98] transition-[transform,background-color,border-color,color] duration-200 focus:outline-none focus:ring-2 focus:ring-brand-silver shadow-2xl text-center select-none"
            >
              <MessageCircle className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
              <span>Fale com a Black Store</span>
            </a>
          </div>

          {/* Micro informativos: Entram em 0.35s */}
          <div className="hero-fast-footer hidden sm:grid grid-cols-3 gap-6 pt-8 mt-8 border-t border-brand-border/40 text-left">
            <div className="group/item p-2 -m-2 rounded transition-colors hover:bg-white/5">
              <p className="text-[10px] uppercase font-mono tracking-widest text-brand-muted group-hover/item:text-brand-silver transition-colors">
                Conceito
              </p>
              <p className="text-sm font-semibold text-brand-white mt-0.5">
                Streetwear & Luxo
              </p>
            </div>
            <div className="group/item p-2 -m-2 rounded transition-colors hover:bg-white/5">
              <p className="text-[10px] uppercase font-mono tracking-widest text-brand-muted group-hover/item:text-brand-silver transition-colors">
                Variedade
              </p>
              <p className="text-sm font-semibold text-brand-white mt-0.5">
                Casual a Esportivo
              </p>
            </div>
            <div className="group/item p-2 -m-2 rounded transition-colors hover:bg-white/5">
              <p className="text-[10px] uppercase font-mono tracking-widest text-brand-muted group-hover/item:text-brand-silver transition-colors">
                Atendimento
              </p>
              <p className="text-sm font-semibold text-emerald-400 mt-0.5 flex items-center gap-1">
                <span>Via WhatsApp</span>
                <ArrowUpRight className="w-3.5 h-3.5 opacity-60" />
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
