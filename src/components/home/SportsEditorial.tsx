"use client";

import React, { useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import { ArrowRight, Flame, Check, Sparkles } from "lucide-react";
import { ProductCategory } from "@/types";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Registrar ScrollTrigger apenas uma vez
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface SportsEditorialProps {
  onSelectCategory?: (category: ProductCategory) => void;
}

const TOTAL_FRAMES = 64;
const FRAME_PREFIX = "/media/futebol-sequence/frame-";
const FRAME_EXT = ".webp";

const getFrameUrl = (index: number) => {
  const padded = String(index).padStart(4, "0");
  return `${FRAME_PREFIX}${padded}${FRAME_EXT}`;
};

export function SportsEditorial({ onSelectCategory }: SportsEditorialProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Refs para as fases da narrativa editorial (controladas pelo GSAP)
  const phase1Ref = useRef<HTMLDivElement>(null);
  const phase2Ref = useRef<HTMLDivElement>(null);
  const phase3Ref = useRef<HTMLDivElement>(null);

  // Cache de imagens em memória
  const imagesRef = useRef<(HTMLImageElement | null)[]>(new Array(TOTAL_FRAMES + 1).fill(null));
  const currentFrameRef = useRef(1);

  // Redirecionamento para a coleção esportiva
  const handleGoToSports = useCallback(
    (e?: React.MouseEvent) => {
      if (e) e.preventDefault();
      if (onSelectCategory) {
        onSelectCategory("esportivo");
        const target = document.getElementById("destaques");
        if (target) {
          target.scrollIntoView({ behavior: "smooth" });
        }
      }
    },
    [onSelectCategory]
  );

  // Link direto para o WhatsApp com mensagem contextualizada
  const handleWhatsAppInquiry = (club?: string) => {
    const text = club
      ? `Olá! Estava navegando pela experiência do estádio na Black Store e gostaria de informações sobre o Manto do ${club}.`
      : "Olá! Vi a Linha Esportiva de Futebol na Black Store e gostaria de ver os mantos disponíveis.";
    const encoded = encodeURIComponent(text);
    window.open(`https://wa.me/5511999999999?text=${encoded}`, "_blank", "noopener,noreferrer");
  };

  // Função otimizada para desenhar no Canvas mantendo Aspect-Ratio Cover perfeito
  const drawFrame = useCallback((frameIndex: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    // Busca o frame exato ou o mais próximo já carregado
    let img = imagesRef.current[frameIndex];
    if (!img || !img.complete || img.naturalWidth === 0) {
      for (let offset = 1; offset < 20; offset++) {
        const prev = imagesRef.current[Math.max(1, frameIndex - offset)];
        if (prev && prev.complete && prev.naturalWidth > 0) {
          img = prev;
          break;
        }
        const next = imagesRef.current[Math.min(TOTAL_FRAMES, frameIndex + offset)];
        if (next && next.complete && next.naturalWidth > 0) {
          img = next;
          break;
        }
      }
    }

    if (!img || !img.complete || img.naturalWidth === 0) return;

    const cw = canvas.width;
    const ch = canvas.height;
    const iw = img.naturalWidth;
    const ih = img.naturalHeight;

    const hRatio = cw / iw;
    const vRatio = ch / ih;
    const ratio = Math.max(hRatio, vRatio);

    const renderW = iw * ratio;
    const renderH = ih * ratio;
    const offsetX = (cw - renderW) / 2;
    const offsetY = (ch - renderH) / 2;

    ctx.drawImage(img, 0, 0, iw, ih, offsetX, offsetY, renderW, renderH);
  }, []);

  // Redimensionamento do canvas com Retina DPR scaling
  const handleResize = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(canvas.clientWidth * dpr);
    canvas.height = Math.round(canvas.clientHeight * dpr);
    drawFrame(currentFrameRef.current);
  }, [drawFrame]);

  // 1. Carregamento do Frame 1 Imediato para exibir o túnel em 0ms
  useEffect(() => {
    const img1 = new window.Image();
    img1.src = getFrameUrl(1);
    img1.onload = () => {
      imagesRef.current[1] = img1;
      drawFrame(1);
    };
  }, [drawFrame]);

  // 2. Pré-carregamento progressivo em 2 estágios ao aproximar da seção
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    let isMounted = true;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || !isMounted) return;

        // Estágio 1: Frames espaçados a cada 2 quadros para rolagem imediata
        const keyframeIndices: number[] = [];
        for (let i = 1; i <= TOTAL_FRAMES; i += 2) {
          keyframeIndices.push(i);
        }
        if (!keyframeIndices.includes(TOTAL_FRAMES)) {
          keyframeIndices.push(TOTAL_FRAMES);
        }

        for (const idx of keyframeIndices) {
          if (!imagesRef.current[idx]) {
            const img = new window.Image();
            img.src = getFrameUrl(idx);
            img.onload = () => {
              if (isMounted) {
                imagesRef.current[idx] = img;
                if (Math.abs(currentFrameRef.current - idx) < 2) {
                  drawFrame(currentFrameRef.current);
                }
              }
            };
          }
        }

        // Estágio 2: Frames intermediários restantes
        for (let i = 1; i <= TOTAL_FRAMES; i++) {
          if (!imagesRef.current[i]) {
            const img = new window.Image();
            img.src = getFrameUrl(i);
            img.onload = () => {
              if (isMounted) imagesRef.current[i] = img;
            };
          }
        }

        observer.disconnect();
      },
      { rootMargin: "800px 0px 800px 0px" }
    );

    observer.observe(section);

    return () => {
      isMounted = false;
      observer.disconnect();
    };
  }, [drawFrame]);

  // 3. Listener de Resize
  useEffect(() => {
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [handleResize]);

  // 4. GSAP ScrollTrigger Masterpiece: Scrubbing Contínuo a 60/120 FPS
  useEffect(() => {
    const section = sectionRef.current;
    const canvas = canvasRef.current;
    const p1 = phase1Ref.current;
    const p2 = phase2Ref.current;
    const p3 = phase3Ref.current;

    if (!section || !canvas || !p1 || !p2 || !p3) return;

    // Criar contexto seguro do GSAP para limpeza automática no React
    const ctx = gsap.context(() => {
      const frameData = { frame: 1 };

      // Linha do tempo mestre acoplada ao ScrollTrigger
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "+=2000",
          pin: true,
          pinSpacing: true,
          scrub: 0.5, // 0.5s de atraso para inércia aveludada sem travamento
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      // 4.1 Scrub dos frames do Canvas de 1 a 64 (sem nenhum re-render no React!)
      tl.to(
        frameData,
        {
          frame: TOTAL_FRAMES,
          ease: "none",
          onUpdate: () => {
            const target = Math.round(frameData.frame);
            if (target !== currentFrameRef.current) {
              currentFrameRef.current = target;
              drawFrame(target);
            }
          },
        },
        0
      );

      // 4.2 Fase 1: Visível no início, fade out suave aos 22% do percurso
      gsap.set(p1, { opacity: 1, y: 0, pointerEvents: "auto" });
      tl.to(
        p1,
        {
          opacity: 0,
          y: -30,
          duration: 0.15,
          ease: "power2.in",
          pointerEvents: "none",
        },
        0.18
      );

      // 4.3 Fase 2: Cards flutuantes Real Madrid e Barcelona entram aos 28% e saem aos 64%
      gsap.set(p2, { opacity: 0, y: 35, pointerEvents: "none" });
      tl.to(
        p2,
        {
          opacity: 1,
          y: 0,
          duration: 0.15,
          ease: "power2.out",
          pointerEvents: "auto",
        },
        0.26
      );
      tl.to(
        p2,
        {
          opacity: 0,
          y: -30,
          duration: 0.15,
          ease: "power2.in",
          pointerEvents: "none",
        },
        0.62
      );

      // 4.4 Fase 3: Entrada no gramado com convite e botões de ação aos 68% até o fim
      gsap.set(p3, { opacity: 0, y: 35, pointerEvents: "none" });
      tl.to(
        p3,
        {
          opacity: 1,
          y: 0,
          duration: 0.15,
          ease: "power2.out",
          pointerEvents: "auto",
        },
        0.68
      );
    }, section);

    // Recalcular posições com precisão
    ScrollTrigger.refresh();

    return () => {
      ctx.revert(); // Remove pins, listeners e restaura o DOM perfeitamente
    };
  }, [drawFrame]);

  return (
    <section
      ref={sectionRef}
      id="esportivo"
      className="relative w-full bg-[#070707] border-t border-brand-border/40 select-none overflow-hidden"
    >
      {/* 1. CONTAINER PINNED PELO SCROLLTRIGGER QUE PREENCHE A VIEWPORT */}
      <div
        ref={containerRef}
        className="relative h-screen w-full overflow-hidden flex flex-col justify-center"
      >
        {/* Canvas de Alta Resolução com Blur e Escurecimento Cinematográfico */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full object-cover pointer-events-none filter blur-[3px] scale-105 brightness-[0.76] contrast-[1.08]"
        />

        {/* Efeitos de Luz & Vinhetas Cinematográficas do Estádio (idêntico ao Hero) */}
        <div className="absolute inset-0 bg-black/45 pointer-events-none z-10" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/55 to-transparent pointer-events-none z-10" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#070707] via-transparent to-[#070707]/80 pointer-events-none z-10" />
        <div
          className="absolute inset-0 pointer-events-none z-10"
          style={{
            backgroundImage:
              "radial-gradient(circle at center, transparent 35%, rgba(0,0,0,0.8) 100%)",
          }}
        />

        {/* Glows sutis neon que acompanham as paredes do túnel */}
        <div className="absolute top-1/2 left-0 -translate-y-1/2 w-72 sm:w-96 h-72 sm:h-96 bg-blue-600/15 rounded-full blur-[110px] pointer-events-none z-10" />
        <div className="absolute top-1/2 right-0 -translate-y-1/2 w-72 sm:w-96 h-72 sm:h-96 bg-red-600/15 rounded-full blur-[110px] pointer-events-none z-10" />

        {/* NARRATIVAS FLUTUANTES SINCRONIZADAS VIA GSAP SCROLLTRIGGER */}
        <div className="relative z-20 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 flex flex-col justify-center">
          
          {/* FASE 1: ENTRADA DO TÚNEL */}
          <div ref={phase1Ref} className="max-w-2xl">
            <div className="inline-flex items-center gap-2 mb-3">
              <span className="w-6 h-[1px] bg-brand-silver"></span>
              <span className="text-xs font-semibold uppercase tracking-[0.25em] text-brand-silver">
                O Clássico dos Mantos
              </span>
            </div>

            <h2 className="font-display text-3xl sm:text-5xl lg:text-6xl font-bold uppercase tracking-tight text-white leading-[1.02] drop-shadow-[0_4px_24px_rgba(0,0,0,0.95)] mb-4">
              A Paixão Pelo Esporte Também Faz Parte do Seu Estilo.
            </h2>

            <p className="text-brand-offwhite text-sm sm:text-base lg:text-lg max-w-xl leading-relaxed drop-shadow-[0_2px_12px_rgba(0,0,0,0.95)] text-pretty">
              Caminhe pelo túnel dos maiores campeões europeus. Do Santiago Bernabéu ao Camp Nou, o corte esportivo ganha atitude streetwear autêntica na Black Store.
            </p>
          </div>

          {/* FASE 2: OS MANTOS SAGRADOS (CARDS LATERAIS) */}
          <div
            ref={phase2Ref}
            className="w-full grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 items-center absolute inset-x-4 sm:inset-x-6 lg:inset-x-8 max-w-7xl mx-auto"
          >
            {/* Card Real Madrid (Lado Esquerdo do Túnel) */}
            <div className="bg-brand-black/85 border border-blue-500/30 backdrop-blur-xl p-5 sm:p-6 rounded-lg shadow-2xl flex items-center gap-4 group hover:border-blue-400 transition-all">
              <div className="relative w-20 h-24 sm:w-24 sm:h-28 shrink-0 overflow-hidden rounded bg-brand-surface border border-white/10">
                <Image
                  src="/catalog/futebol/real.webp"
                  alt="Manto Real Madrid Oficial"
                  fill
                  sizes="120px"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 text-[10px] font-mono uppercase tracking-wider mb-1.5">
                  <Sparkles className="w-3 h-3" />
                  <span>Hala Madrid</span>
                </div>
                <h3 className="font-display text-lg sm:text-xl font-bold uppercase text-white truncate">
                  Manto Real Madrid
                </h3>
                <p className="text-xs text-brand-silver line-clamp-2 mt-1">
                  Detalhes dourados em relevo, tecido respirável e modelagem atlética premium.
                </p>
                <button
                  onClick={() => handleWhatsAppInquiry("Real Madrid")}
                  className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-white hover:text-blue-300 transition-colors"
                >
                  <span>Pedir Modelo</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Card Barcelona (Lado Direito do Túnel) */}
            <div className="bg-brand-black/85 border border-red-500/30 backdrop-blur-xl p-5 sm:p-6 rounded-lg shadow-2xl flex items-center gap-4 group hover:border-red-400 transition-all">
              <div className="relative w-20 h-24 sm:w-24 sm:h-28 shrink-0 overflow-hidden rounded bg-brand-surface border border-white/10">
                <Image
                  src="/catalog/futebol/barcelona.webp"
                  alt="Manto FC Barcelona Oficial"
                  fill
                  sizes="120px"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-red-500/20 text-red-300 text-[10px] font-mono uppercase tracking-wider mb-1.5">
                  <Flame className="w-3 h-3" />
                  <span>Més Que Un Club</span>
                </div>
                <h3 className="font-display text-lg sm:text-xl font-bold uppercase text-white truncate">
                  Manto Barcelona
                </h3>
                <p className="text-xs text-brand-silver line-clamp-2 mt-1">
                  Cores tradicionais blaugrana com toque acetinado e tecnologia de absorção rápida.
                </p>
                <button
                  onClick={() => handleWhatsAppInquiry("FC Barcelona")}
                  className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-white hover:text-red-300 transition-colors"
                >
                  <span>Pedir Modelo</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* FASE 3: ENTRADA NO GRAMADO & CONVITE DE COMPRA */}
          <div ref={phase3Ref} className="max-w-2xl absolute">
            <div className="inline-flex items-center gap-2 mb-3">
              <span className="w-6 h-[1px] bg-emerald-400"></span>
              <span className="text-xs font-semibold uppercase tracking-[0.25em] text-emerald-400 font-mono">
                Dentro do Gramado
              </span>
            </div>

            <h2 className="font-display text-3xl sm:text-5xl lg:text-6xl font-bold uppercase tracking-tight text-white leading-[1.02] drop-shadow-[0_4px_24px_rgba(0,0,0,0.95)] mb-4">
              Atitude Nos Gramados e Nas Ruas.
            </h2>

            <p className="text-brand-offwhite text-sm sm:text-base max-w-xl leading-relaxed drop-shadow-[0_2px_12px_rgba(0,0,0,0.95)] mb-6 text-pretty">
              Coleção completa de mantos internacionais, calções e jaquetas esportivas. Vista as cores do seu time com o padrão de qualidade impecável da Black Store.
            </p>

            {/* Checklist editorial de benefícios */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8 pt-4 border-t border-white/20">
              <div className="flex items-center gap-2 text-xs text-brand-offwhite">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Principais Clubes Mundiais</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-brand-offwhite">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Tecidos Respiráveis</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-brand-offwhite">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Pronta Entrega & Encomendas</span>
              </div>
            </div>

            {/* CTAs de Ação */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5">
              <button
                onClick={handleGoToSports}
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 sm:px-8 sm:py-4 bg-brand-white text-brand-black text-xs font-bold uppercase tracking-widest hover:bg-brand-silver hover:scale-[1.02] active:scale-[0.98] transition-[transform,background-color] shadow-2xl select-none"
              >
                <span>Ver Coleção Esportiva</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => handleWhatsAppInquiry()}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 sm:px-7 sm:py-4 bg-brand-black/80 hover:bg-brand-surface border border-white/20 text-brand-white text-xs font-bold uppercase tracking-widest active:scale-[0.98] transition-[transform,background-color] shadow-xl select-none backdrop-blur-md"
              >
                <span>Consultar Modelos no WhatsApp</span>
              </button>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
