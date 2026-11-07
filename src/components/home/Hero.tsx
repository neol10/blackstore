"use client";

import React, { useEffect, useRef, useState } from "react";
import { MessageCircle, Sparkles } from "lucide-react";
import { createWhatsAppLink } from "@/lib/whatsapp";
import { siteConfig } from "@/config/site";

// Nova sequência Black Store: 97 frames-chave selecionados a partir dos 194 frames
// Oferece o dobro de quadros da versão anterior com carregamento leve e ultra fluido
const TARGET_FRAME_COUNT = 97;
const FRAME_NUMBERS = Array.from(
  { length: TARGET_FRAME_COUNT },
  (_, i) => Math.round(1 + (i * (194 - 1)) / (TARGET_FRAME_COUNT - 1))
);
const TOTAL_FRAMES = FRAME_NUMBERS.length;

const getFramePath = (frameNum: number) => {
  const padded = String(frameNum).padStart(4, "0");
  return `/frames/frame-${padded}.webp`;
};

export function Hero() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const currentFrameRef = useRef<number>(0);
  const targetFrameRef = useRef<number>(0);
  const smoothFrameRef = useRef<number>(0);

  // Sincronização 1:1: tanto o canvas quanto os textos usam o mesmo progresso suave (smoothProgress)
  const [smoothProgress, setSmoothProgress] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  // 1. Pré-carregamento dos 97 frames em WebP
  useEffect(() => {
    let isMounted = true;
    const images: HTMLImageElement[] = [];

    // Frame 1 prioritário para exibição imediata sem tela preta
    const firstImg = new Image();
    firstImg.src = getFramePath(FRAME_NUMBERS[0]);
    images[0] = firstImg;

    firstImg.onload = () => {
      if (!isMounted) return;
      imagesRef.current = images;
      setIsLoaded(true);
      renderFrame(0);
    };

    // Pré-carrega os frames restantes em background
    for (let i = 1; i < TOTAL_FRAMES; i++) {
      const img = new Image();
      img.src = getFramePath(FRAME_NUMBERS[i]);
      images[i] = img;
    }

    imagesRef.current = images;

    return () => {
      isMounted = false;
    };
  }, []);

  // 2. Renderização de alta precisão com suporte a Retina (DPR) e proporção 'cover'
  const renderFrame = (index: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    const img = imagesRef.current[index];
    if (!img || !img.complete || img.naturalWidth === 0) return;

    const cw = canvas.width;
    const ch = canvas.height;
    const iw = img.naturalWidth;
    const ih = img.naturalHeight;

    // Algoritmo matematicamente proporcional: preenche a tela sem distorção
    const hRatio = cw / iw;
    const vRatio = ch / ih;
    const ratio = Math.max(hRatio, vRatio);

    const renderW = iw * ratio;
    const renderH = ih * ratio;
    const offsetX = (cw - renderW) / 2;
    const offsetY = (ch - renderH) / 2;

    ctx.drawImage(img, 0, 0, iw, ih, offsetX, offsetY, renderW, renderH);
  };

  // 3. Redimensionamento responsivo do Canvas
  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(window.innerWidth * dpr);
      canvas.height = Math.round(window.innerHeight * dpr);

      renderFrame(currentFrameRef.current);
    };

    handleResize();
    window.addEventListener("resize", handleResize, { passive: true });

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [isLoaded]);

  // 4. Interpolação Lerp Contínua (Sincroniza frame e texto no mesmo ritmo)
  useEffect(() => {
    if (!isLoaded) return;

    let rafId: number;

    const lerpLoop = () => {
      const diff = targetFrameRef.current - smoothFrameRef.current;
      if (Math.abs(diff) > 0.02) {
        smoothFrameRef.current += diff * 0.22;
        const frameToDraw = Math.min(
          Math.max(Math.round(smoothFrameRef.current), 0),
          TOTAL_FRAMES - 1
        );

        if (frameToDraw !== currentFrameRef.current) {
          currentFrameRef.current = frameToDraw;
          renderFrame(frameToDraw);
        }

        // Atualiza o progresso suave unificado para as frases
        const norm = smoothFrameRef.current / (TOTAL_FRAMES - 1);
        setSmoothProgress(norm);
      }

      rafId = requestAnimationFrame(lerpLoop);
    };

    rafId = requestAnimationFrame(lerpLoop);

    return () => {
      cancelAnimationFrame(rafId);
    };
  }, [isLoaded]);

  // 5. Scroll listener leve
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const handleScroll = () => {
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const maxScroll = containerRef.current.scrollHeight - window.innerHeight;
      const scrollTop = -rect.top;

      const rawProgress = maxScroll > 0 ? scrollTop / maxScroll : 0;
      const progress = Math.min(Math.max(rawProgress, 0), 1);

      if (prefersReducedMotion) {
        targetFrameRef.current = 0;
        smoothFrameRef.current = 0;
        setSmoothProgress(0);
      } else {
        targetFrameRef.current = Math.round(progress * (TOTAL_FRAMES - 1));
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isLoaded]);

  // Sincronia das frases com a nova sequência:
  // 1. O texto principal faz fade-out rápido quando o scroll começa
  const contentOpacity = Math.max(1 - smoothProgress * 3.2, 0);
  const contentTranslateY = -smoothProgress * 45;

  // 2. A legenda editorial surge no ápice do movimento
  const editorialOpacity =
    smoothProgress > 0.28 && smoothProgress < 0.76
      ? Math.sin(((smoothProgress - 0.28) / 0.48) * Math.PI)
      : 0;

  return (
    <div
      ref={containerRef}
      id="inicio"
      className="relative h-[180vh] sm:h-[220vh] bg-brand-black select-none"
    >
      {/* Container Sticky preso durante a rolagem */}
      <div className="sticky top-0 left-0 w-full h-[100dvh] overflow-hidden flex items-center justify-center">
        {/* Canvas de Alta Precisão */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full block filter brightness-[0.9] contrast-[1.05]"
        />

        {/* Gradientes cinematográficos de iluminação e legibilidade */}
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-brand-black via-brand-black/35 to-brand-black/75" />
        <div className="absolute inset-0 pointer-events-none bg-radial-gradient from-transparent via-brand-black/25 to-brand-black/80" />

        {/* Fusão inferior natural com a seção de coleções */}
        <div className="absolute inset-x-0 bottom-0 h-28 sm:h-36 pointer-events-none bg-gradient-to-t from-brand-surface via-brand-surface/75 to-transparent" />

        {/* 1. CONTEÚDO PRINCIPAL DO HERO */}
        <div
          className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full transition-opacity duration-75 pointer-events-auto"
          style={{
            opacity: contentOpacity,
            transform: `translate3d(0, ${contentTranslateY}px, 0)`,
            pointerEvents: contentOpacity > 0.05 ? "auto" : "none",
          }}
        >
          <div className="max-w-2xl lg:max-w-3xl">
            {/* Badge */}
            <div className="hidden sm:inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-black/75 border border-brand-silver/30 backdrop-blur-xl mb-6 shadow-2xl">
              <Sparkles className="w-3.5 h-3.5 text-brand-white animate-pulse" />
              <span className="text-[11px] font-medium tracking-widest text-brand-white uppercase">
                {siteConfig.demoMode
                  ? "Vitrine Conceito • Demonstração Comercial"
                  : "Moda Masculina • Coleções 2026"}
              </span>
            </div>

            {/* Título Principal */}
            <h1 className="font-display text-4xl sm:text-6xl lg:text-8xl font-bold tracking-tight uppercase leading-[0.98] mb-4 sm:mb-6 drop-shadow-2xl text-balance">
              <span className="text-white block drop-shadow-md">
                Seu Estilo.
              </span>
              <span className="relative inline-block text-transparent bg-clip-text bg-gradient-to-r from-brand-white via-zinc-200 to-brand-silver">
                Sua Presença.
              </span>
            </h1>

            {/* Subtítulo */}
            <p className="text-sm sm:text-base lg:text-xl text-brand-offwhite/90 max-w-xl font-normal leading-relaxed mb-6 sm:mb-10 drop-shadow-md text-pretty">
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

        {/* 2. LEGENDA NARRATIVA SUTIL NO ÁPICE DO MOVIMENTO DO TERNO */}
        <div
          className="absolute z-10 max-w-xl px-6 text-center sm:text-left sm:left-12 lg:left-24 pointer-events-none transition-opacity duration-150"
          style={{
            opacity: editorialOpacity,
            transform: `translate3d(0, ${(1 - editorialOpacity) * 20}px, 0)`,
          }}
        >
          <span className="inline-block text-[10px] sm:text-xs font-semibold uppercase tracking-[0.25em] text-brand-silver px-3 py-1 bg-brand-black/70 border border-brand-silver/20 backdrop-blur-md mb-3">
            Precisão & Caimento Impecável
          </span>
          <h2 className="font-display text-2xl sm:text-4xl font-bold uppercase tracking-tight text-brand-white text-balance drop-shadow-xl">
            A Arte da Alfaiataria Moderna
          </h2>
          <p className="text-xs sm:text-sm text-brand-offwhite/80 mt-2 max-w-md drop-shadow-md text-pretty">
            Cada detalhe pensado para acompanhar sua rotina com distinção e conforto.
          </p>
        </div>

        {/* Indicador de scroll inicial */}
        <div
          className={`absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-1 text-[10px] uppercase tracking-widest text-brand-muted pointer-events-none transition-opacity duration-300 ${
            smoothProgress > 0.05 ? "opacity-0" : "opacity-75"
          }`}
        >
          <span>Role para animar</span>
          <span className="animate-bounce">↓</span>
        </div>
      </div>
    </div>
  );
}
