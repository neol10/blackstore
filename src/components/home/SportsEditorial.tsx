"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";
import { ArrowRight, Flame, Check, Sparkles } from "lucide-react";
import { ProductCategory } from "@/types";

interface SportsEditorialProps {
  onSelectCategory?: (category: ProductCategory) => void;
}

const TOTAL_FRAMES = 191;
const FRAME_PREFIX = "/media/futebol-sequence/frame-";
const FRAME_EXT = ".webp";

const getFrameUrl = (index: number) => {
  const padded = String(index).padStart(4, "0");
  return `${FRAME_PREFIX}${padded}${FRAME_EXT}`;
};

export function SportsEditorial({ onSelectCategory }: SportsEditorialProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Estados de controle e renderização
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isSectionVisible, setIsSectionVisible] = useState(false);

  // Cache de imagens em memória
  const imagesRef = useRef<(HTMLImageElement | null)[]>(new Array(TOTAL_FRAMES + 1).fill(null));
  const currentFrameRef = useRef(1);
  const targetFrameRef = useRef(1);
  const rafIdRef = useRef<number | null>(null);

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

  // 1. Carregamento do Frame 1 Imediato para nunca ficar tela preta
  useEffect(() => {
    const img1 = new window.Image();
    img1.src = getFrameUrl(1);
    img1.onload = () => {
      imagesRef.current[1] = img1;
      drawFrame(1);
    };
  }, []);

  // 2. Observar proximidade da seção para iniciar o carregamento progressivo
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsSectionVisible(true);
        }
      },
      { rootMargin: "600px 0px 600px 0px" }
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  // 3. Carregamento progressivo em 2 estágios (Keyframes primeiro, depois frames intermediários)
  useEffect(() => {
    if (!isSectionVisible) return;

    let isMounted = true;

    // Estágio 1: Carrega frames chave espaçados a cada 4 frames para resposta imediata
    const keyframeIndices: number[] = [];
    for (let i = 1; i <= TOTAL_FRAMES; i += 4) {
      keyframeIndices.push(i);
    }
    if (!keyframeIndices.includes(TOTAL_FRAMES)) {
      keyframeIndices.push(TOTAL_FRAMES);
    }

    // Carregador de fila controlado
    const loadQueue = async () => {
      // Prioridade 1: Keyframes
      for (const idx of keyframeIndices) {
        if (!isMounted) return;
        if (!imagesRef.current[idx]) {
          const img = new window.Image();
          img.src = getFrameUrl(idx);
          img.onload = () => {
            imagesRef.current[idx] = img;
            if (Math.abs(currentFrameRef.current - idx) < 2) {
              drawFrame(currentFrameRef.current);
            }
          };
        }
      }

      // Prioridade 2: Frames intermediários restantes
      for (let i = 1; i <= TOTAL_FRAMES; i++) {
        if (!isMounted) return;
        if (!imagesRef.current[i]) {
          const img = new window.Image();
          img.src = getFrameUrl(i);
          img.onload = () => {
            imagesRef.current[i] = img;
          };
          // Pequena pausa para não afogar a rede do browser
          if (i % 12 === 0) {
            await new Promise((r) => setTimeout(r, 16));
          }
        }
      }
    };

    loadQueue();

    return () => {
      isMounted = false;
    };
  }, [isSectionVisible]);

  // Função para desenhar no Canvas mantendo Aspect-Ratio Cover perfeito
  const drawFrame = useCallback((frameIndex: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    // Busca o frame exato ou o mais próximo disponível
    let img = imagesRef.current[frameIndex];
    if (!img || !img.complete || img.naturalWidth === 0) {
      // Procura o mais próximo já carregado
      for (let offset = 1; offset < 30; offset++) {
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
    drawFrame(Math.round(currentFrameRef.current));
  }, [drawFrame]);

  useEffect(() => {
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [handleResize]);

  // Loop suave de interpolação linear (LERP) a 60fps para sensação sedosa no scroll
  useEffect(() => {
    let active = true;

    const loop = () => {
      if (!active) return;
      const target = targetFrameRef.current;
      const current = currentFrameRef.current;
      const diff = target - current;

      if (Math.abs(diff) > 0.05) {
        currentFrameRef.current += diff * 0.18;
        drawFrame(Math.round(currentFrameRef.current));
      }

      rafIdRef.current = requestAnimationFrame(loop);
    };

    rafIdRef.current = requestAnimationFrame(loop);

    return () => {
      active = false;
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
    };
  }, [drawFrame]);

  // Listener de Scroll para controlar o avanço do túnel
  useEffect(() => {
    const handleScroll = () => {
      const section = sectionRef.current;
      if (!section) return;

      const rect = section.getBoundingClientRect();
      const totalScrollable = rect.height - window.innerHeight;

      if (totalScrollable <= 0) return;

      // Progresso de 0.0 a 1.0 dentro da trilha sticky
      const progress = Math.max(0, Math.min(1, -rect.top / totalScrollable));
      setScrollProgress(progress);

      const frame = Math.max(1, Math.min(TOTAL_FRAMES, Math.round(progress * (TOTAL_FRAMES - 1) + 1)));
      targetFrameRef.current = frame;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section
      ref={sectionRef}
      id="esportivo"
      className="relative bg-[#070707] border-t border-brand-border/40 select-none min-h-[250vh] sm:min-h-[280vh]"
    >
      {/* 1. CONTAINER STICKY QUE PREENCHE A TELA DURANTE O SCROLL */}
      <div className="sticky top-0 h-screen w-full overflow-hidden flex flex-col justify-center">
        
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
          style={{ backgroundImage: "radial-gradient(circle at center, transparent 35%, rgba(0,0,0,0.8) 100%)" }}
        />

        {/* Glows sutis neon que acompanham as paredes do túnel */}
        <div className="absolute top-1/2 left-0 -translate-y-1/2 w-72 sm:w-96 h-72 sm:h-96 bg-blue-600/15 rounded-full blur-[110px] pointer-events-none z-10" />
        <div className="absolute top-1/2 right-0 -translate-y-1/2 w-72 sm:w-96 h-72 sm:h-96 bg-red-600/15 rounded-full blur-[110px] pointer-events-none z-10" />

        {/* NARRATIVAS FLUTUANTES SINCRONIZADAS AO SCROLL */}
        <div className="relative z-20 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 flex flex-col justify-center pointer-events-none">
          
          {/* FASE 1: ENTRADA DO TÚNEL (0.00 a 0.28) */}
          <div
            className={`transition-all duration-700 max-w-2xl ${
              scrollProgress < 0.28
                ? "opacity-100 translate-y-0 pointer-events-auto"
                : "opacity-0 -translate-y-8 pointer-events-none absolute"
            }`}
          >
            <div className="inline-flex items-center gap-2 mb-3">
              <span className="w-6 h-[1px] bg-brand-silver"></span>
              <span className="text-xs font-semibold uppercase tracking-[0.25em] text-brand-silver">
                O Clássico dos Mantos
              </span>
            </div>

            <h2 className="font-display text-3xl sm:text-5xl lg:text-6xl font-bold uppercase tracking-tight text-white leading-[1.02] drop-shadow-[0_4px_24px_rgba(0,0,0,0.95)] mb-4">
              A Paixão Pelo Esporte Também Faz Parte do Seu Estilo.
            </h2>

            <p className="text-brand-offwhite text-sm sm:text-base lg:text-lg max-w-xl leading-relaxed drop-shadow-[0_2px_12px_rgba(0,0,0,0.95)] mb-6 text-pretty">
              Caminhe pelo túnel dos maiores campeões europeus. Do Santiago Bernabéu ao Camp Nou, o corte esportivo ganha atitude streetwear autêntica na Black Store.
            </p>
          </div>

          {/* FASE 2: OS MANTOS SAGRADOS (0.28 a 0.68) - CARDS LATERAIS COINCIDINDO COM AS PAREDES */}
          <div
            className={`transition-all duration-700 w-full grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 items-center ${
              scrollProgress >= 0.28 && scrollProgress < 0.68
                ? "opacity-100 translate-y-0 pointer-events-auto"
                : "opacity-0 translate-y-8 pointer-events-none absolute"
            }`}
          >
            {/* Card Real Madrid (Lado Esquerdo do Túnel) */}
            <div className="bg-brand-black/80 border border-blue-500/30 backdrop-blur-xl p-5 sm:p-6 rounded-lg shadow-2xl flex items-center gap-4 group hover:border-blue-400 transition-all">
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
            <div className="bg-brand-black/80 border border-red-500/30 backdrop-blur-xl p-5 sm:p-6 rounded-lg shadow-2xl flex items-center gap-4 group hover:border-red-400 transition-all">
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

          {/* FASE 3: ENTRADA NO GRAMADO & CONVITE DE COMPRA (0.68 a 1.00) */}
          <div
            className={`transition-all duration-700 max-w-2xl ${
              scrollProgress >= 0.68
                ? "opacity-100 translate-y-0 pointer-events-auto"
                : "opacity-0 translate-y-8 pointer-events-none absolute"
            }`}
          >
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
                <span>Tecidos Tecnológicos Respiráveis</span>
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
