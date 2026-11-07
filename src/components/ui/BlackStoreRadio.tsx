"use client";

import React, { useState, useEffect, useRef } from "react";
import { Volume2, VolumeX, Play, Pause, Music, Disc } from "lucide-react";

export function BlackStoreRadio() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const intervalRef = useRef<number | null>(null);

  // Inicia o motor de som ambiente Lo-Fi / Lounge Urbano suave usando Web Audio API nativa
  const togglePlay = () => {
    if (isPlaying) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (audioCtxRef.current && audioCtxRef.current.state === "running") {
        audioCtxRef.current.suspend();
      }
      setIsPlaying(false);
      return;
    }

    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!audioCtxRef.current) {
        audioCtxRef.current = new AudioCtx();
      }

      const ctx = audioCtxRef.current;
      if (ctx.state === "suspended") {
        ctx.resume();
      }

      // Acordes refinados de Jazz/Lo-Fi Urbano (Frequências de notas musicais em Hz)
      // Acorde 1: Fmaj9, Acorde 2: Em7, Acorde 3: Dm9, Acorde 4: Cmaj7
      const chords = [
        [174.61, 220.0, 261.63, 329.63], // F, A, C, E
        [164.81, 196.0, 246.94, 293.66], // E, G, B, D
        [146.83, 174.61, 220.0, 261.63], // D, F, A, C
        [130.81, 164.81, 196.0, 246.94], // C, E, G, B
      ];

      let chordIndex = 0;

      const playChord = () => {
        if (!audioCtxRef.current || isMuted) return;
        const now = ctx.currentTime;
        const currentChord = chords[chordIndex];
        chordIndex = (chordIndex + 1) % chords.length;

        currentChord.forEach((freq, i) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          const filter = ctx.createBiquadFilter();

          osc.type = "sine";
          osc.frequency.setValueAtTime(freq, now);

          // Filtro passa-baixa suave para toque aveludado analógico
          filter.type = "lowpass";
          filter.frequency.setValueAtTime(800, now);

          // Envelope suave: fade-in e fade-out longos e confortáveis
          gain.gain.setValueAtTime(0.001, now);
          gain.gain.exponentialRampToValueAtTime(0.025 / (i + 1), now + 0.8);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + 3.2);

          osc.connect(filter);
          filter.connect(gain);
          gain.connect(ctx.destination);

          osc.start(now + i * 0.04);
          osc.stop(now + 3.4);
        });
      };

      playChord();
      intervalRef.current = window.setInterval(playChord, 3600);
      setIsPlaying(true);
      setIsExpanded(true);
    } catch (e) {
      console.warn("Áudio não disponível no dispositivo:", e);
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (audioCtxRef.current) {
        audioCtxRef.current.close().catch(() => {});
      }
    };
  }, []);

  return (
    <div className="fixed bottom-6 left-6 z-40 select-none">
      <div
        className={`flex items-center gap-2.5 p-1.5 rounded-full bg-brand-black/90 border border-white/15 backdrop-blur-xl shadow-[0_12px_30px_-8px_rgba(0,0,0,0.85)] transition-all duration-300 ${
          isExpanded ? "pr-4" : ""
        }`}
      >
        {/* Botão Play / Pause */}
        <button
          onClick={togglePlay}
          aria-label={isPlaying ? "Pausar rádio da loja" : "Tocar som ambiente da loja"}
          className={`p-2.5 rounded-full flex items-center justify-center transition-all ${
            isPlaying
              ? "bg-brand-white text-brand-black shadow-lg"
              : "bg-white/10 hover:bg-white/20 text-brand-white"
          }`}
        >
          {isPlaying ? (
            <Disc className="w-4 h-4 animate-spin text-brand-black" />
          ) : (
            <Music className="w-4 h-4 text-emerald-400" />
          )}
        </button>

        {/* Informações da Faixa & Equalizador */}
        {isExpanded && (
          <div className="flex items-center gap-3">
            <div className="flex flex-col">
              <span className="text-[10px] font-bold uppercase tracking-wider text-brand-white flex items-center gap-1.5">
                Black Store Lounge
                {isPlaying && (
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                )}
              </span>
              <span className="text-[8px] uppercase tracking-widest text-brand-silver/70">
                {isPlaying ? "Lo-Fi Beats • Em reprodução" : "Som Ambiente da Loja"}
              </span>
            </div>

            {/* Barrinhas do Equalizador Animadas */}
            {isPlaying && (
              <div className="flex items-end gap-0.5 h-3.5">
                <span className="w-0.5 bg-emerald-400 rounded-full animate-bounce [animation-delay:0.1s] h-full" />
                <span className="w-0.5 bg-emerald-400 rounded-full animate-bounce [animation-delay:0.3s] h-2/3" />
                <span className="w-0.5 bg-emerald-400 rounded-full animate-bounce [animation-delay:0.2s] h-4/5" />
                <span className="w-0.5 bg-emerald-400 rounded-full animate-bounce [animation-delay:0.4s] h-1/2" />
              </div>
            )}

            {/* Mute Button */}
            {isPlaying && (
              <button
                onClick={toggleMute}
                aria-label={isMuted ? "Desmutar" : "Mutar"}
                className="p-1 text-brand-silver hover:text-white transition-colors"
              >
                {isMuted ? <VolumeX className="w-3.5 h-3.5 text-red-400" /> : <Volume2 className="w-3.5 h-3.5" />}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
