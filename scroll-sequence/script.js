/**
 * BLACK STORE — Scrollytelling Canvas Animation
 * 
 * Lógica pura em JavaScript (Vanilla):
 * 1. Pré-carregamento dos 119 frames WebP com barra de status.
 * 2. Canvas responsivo com suporte a Retina (DPI scaling).
 * 3. Proporção 'cover' (aspect-ratio mantido sem distorção).
 * 4. Sincronização fluida com requestAnimationFrame (60/120 FPS).
 * 5. Gerenciamento de opacidade das legendas editoriais.
 * 6. Suporte a prefers-reduced-motion e dispositivos móveis.
 */

(() => {
  'use strict';

  // --- CONFIGURAÇÃO ---
  const TOTAL_FRAMES = 119;
  const FRAMES_DIR = 'frames';
  const FRAME_PREFIX = 'frame-';
  const FRAME_EXT = '.webp';

  // Gerador de URL: frame-0001.webp até frame-0119.webp
  const getFramePath = (index) => {
    const padded = String(index).padStart(4, '0');
    return `${FRAMES_DIR}/${FRAME_PREFIX}${padded}${FRAME_EXT}`;
  };

  // --- ELEMENTOS DO DOM ---
  const canvas = document.getElementById('scroll-canvas');
  const ctx = canvas.getContext('2d', { alpha: false }); // Otimização de performance no canvas
  const scrollTrack = document.getElementById('scroll-track');
  const loader = document.getElementById('loader');
  const loaderProgress = document.getElementById('loader-progress');
  const loaderText = document.getElementById('loader-text');
  const scrollHint = document.getElementById('scroll-hint');
  const narrativeSteps = Array.from(document.querySelectorAll('.narrative-step'));

  // --- ESTADO DA ANIMAÇÃO ---
  const images = [];
  let loadedCount = 0;
  let currentFrameIndex = 0;
  let targetFrameIndex = 0;
  let isTicking = false;
  let isReady = false;

  // Checar preferência de redução de movimento do usuário
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // --- REDIMENSIONAMENTO RESPONSIVO & RETINA DPR ---
  function resizeCanvas() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2); // Limita a 2x para equilibrar nitidez e performance
    const width = window.innerWidth;
    const height = window.innerHeight;

    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);

    // Redesenhar o frame atual imediatamente após resize
    renderFrame(currentFrameIndex);
  }

  // --- DESENHO COM ASPECT-RATIO PRESERVADO (OBJECT-FIT: COVER) ---
  function renderFrame(index) {
    const img = images[index];
    if (!img || !img.complete || img.naturalWidth === 0) return;

    const cw = canvas.width;
    const ch = canvas.height;
    const iw = img.naturalWidth;
    const ih = img.naturalHeight;

    // Algoritmo matemático para preenchimento de tela total sem esticar nem deformar
    const hRatio = cw / iw;
    const vRatio = ch / ih;
    const ratio = Math.max(hRatio, vRatio);

    const renderW = iw * ratio;
    const renderH = ih * ratio;
    const offsetX = (cw - renderW) / 2;
    const offsetY = (ch - renderH) / 2;

    // Desenha direto no canvas
    ctx.drawImage(img, 0, 0, iw, ih, offsetX, offsetY, renderW, renderH);
  }

  // --- ATUALIZAR NARRATIVA (LEGENDAS DE TEXTO) ---
  function updateNarrative(progress) {
    narrativeSteps.forEach((step) => {
      const start = parseFloat(step.getAttribute('data-start'));
      const end = parseFloat(step.getAttribute('data-end'));

      if (progress >= start && progress <= end) {
        step.classList.add('active');
      } else {
        step.classList.remove('active');
      }
    });

    // Ocultar a dica de scroll após início da rolagem
    if (scrollHint) {
      if (progress > 0.04) {
        scrollHint.classList.add('faded');
      } else {
        scrollHint.classList.remove('faded');
      }
    }
  }

  // --- LOOP DE ATUALIZAÇÃO POR SCROLL VIA requestAnimationFrame ---
  function onScroll() {
    if (!isReady) return;

    if (!isTicking) {
      window.requestAnimationFrame(() => {
        updateProgress();
        isTicking = false;
      });
      isTicking = true;
    }
  }

  function updateProgress() {
    const trackRect = scrollTrack.getBoundingClientRect();
    const maxScroll = scrollTrack.scrollHeight - window.innerHeight;
    const scrollTop = -trackRect.top;

    // Progresso normalizado de 0.0 a 1.0 dentro da área sticky
    const rawProgress = maxScroll > 0 ? scrollTop / maxScroll : 0;
    const progress = Math.min(Math.max(rawProgress, 0), 1);

    // Se preferir movimento reduzido, fixa no frame central ou inicial
    if (prefersReducedMotion) {
      currentFrameIndex = 0;
      renderFrame(0);
      updateNarrative(progress);
      return;
    }

    // Mapear o progresso [0, 1] para os frames [0, TOTAL_FRAMES - 1]
    const target = Math.round(progress * (TOTAL_FRAMES - 1));

    if (target !== currentFrameIndex) {
      currentFrameIndex = target;
      renderFrame(currentFrameIndex);
    }

    updateNarrative(progress);
  }

  // --- PRÉ-CARREGAMENTO DE TODAS AS 119 IMAGENS ---
  function preloadImages() {
    return new Promise((resolve) => {
      // 1. Carregar primeiro o frame-0001 para exibição instantânea
      const firstImg = new Image();
      firstImg.src = getFramePath(1);
      images[0] = firstImg;

      firstImg.onload = () => {
        loadedCount++;
        renderFrame(0);
        checkCompletion();
      };
      firstImg.onerror = () => {
        console.warn(`Aviso: Não foi possível carregar ${getFramePath(1)}`);
        loadedCount++;
        checkCompletion();
      };

      // 2. Carregar o restante dos frames
      for (let i = 2; i <= TOTAL_FRAMES; i++) {
        const img = new Image();
        img.src = getFramePath(i);
        images[i - 1] = img;

        img.onload = () => {
          loadedCount++;
          updateLoaderProgress();
          checkCompletion();
        };

        img.onerror = () => {
          console.warn(`Aviso: Falha ao carregar frame ${i}`);
          loadedCount++;
          updateLoaderProgress();
          checkCompletion();
        };
      }

      function updateLoaderProgress() {
        const percent = Math.floor((loadedCount / TOTAL_FRAMES) * 100);
        if (loaderProgress) loaderProgress.style.width = `${percent}%`;
        if (loaderText) loaderText.textContent = `Carregando experiência: ${percent}%`;
      }

      function checkCompletion() {
        if (loadedCount >= TOTAL_FRAMES) {
          resolve();
        }
      }
    });
  }

  // --- INICIALIZAÇÃO DA APLICAÇÃO ---
  async function init() {
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas, { passive: true });
    window.addEventListener('scroll', onScroll, { passive: true });

    // Pré-carrega todos os frames
    await preloadImages();

    // Transição suave para retirar o loader da tela
    setTimeout(() => {
      if (loader) {
        loader.classList.add('hidden');
      }
      isReady = true;
      // Garante render inicial perfeito
      updateProgress();
    }, 350);
  }

  // Iniciar após parsing do DOM
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
