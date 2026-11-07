"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Menu, MessageCircle, Sparkles } from "lucide-react";
import { siteConfig } from "@/config/site";
import { createWhatsAppLink } from "@/lib/whatsapp";
import { MobileNavigation } from "./MobileNavigation";

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isVipMode, setIsVipMode] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleVipMode = () => {
    const nextState = !isVipMode;
    setIsVipMode(nextState);
    if (nextState) {
      document.documentElement.classList.add("vip-night-mode");
    } else {
      document.documentElement.classList.remove("vip-night-mode");
    }
  };

  const navLinks = [
    { label: "Início", href: "#inicio" },
    { label: "Coleções", href: "#colecoes" },
    { label: "Destaques", href: "#destaques" },
    { label: "Linha Esportiva", href: "#esportivo" },
    { label: "Nossa Loja", href: "#loja" },
    { label: "Contato", href: "#contato" },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 border-b ${
          isScrolled
            ? "bg-brand-black/95 backdrop-blur-md border-brand-border/80 py-3 shadow-xl"
            : "bg-brand-black/85 backdrop-blur-md border-brand-border/40 py-4"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Logo & Marca */}
          <a
            href="#inicio"
            className="flex items-center gap-3.5 group focus:outline-none focus:ring-1 focus:ring-brand-silver rounded p-1"
            aria-label="BLACK STORE - Início"
          >
            <div className="relative w-10 h-10 rounded-full overflow-hidden border border-brand-border bg-black shadow-inner flex items-center justify-center transition-transform group-hover:scale-105">
              <Image
                src="/logo.jpg"
                alt="Logotipo oficial BLACK STORE"
                fill
                sizes="40px"
                className="object-contain"
                priority
              />
            </div>
            <div className="flex flex-col">
              <span className="font-display font-bold tracking-[0.25em] text-lg text-brand-white leading-none">
                BLACK STORE
              </span>
              <span className="text-[9px] uppercase tracking-widest text-brand-silver/70 font-sans mt-1">
                Elegância em cada detalhe
              </span>
            </div>
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-8" aria-label="Navegação Principal">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-xs uppercase tracking-widest text-brand-silver hover:text-brand-white transition-colors relative py-1 focus:outline-none focus:ring-1 focus:ring-brand-silver after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1px] after:bg-brand-white hover:after:w-full after:transition-all after:duration-300"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Desktop Right CTA */}
          <div className="hidden lg:flex items-center gap-3">
            {/* Botão de Alternância Modo VIP */}
            <button
              onClick={toggleVipMode}
              aria-label="Alternar Modo VIP Vitrine Noturna"
              className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-full border text-[11px] font-semibold uppercase tracking-wider transition-all duration-300 ${
                isVipMode
                  ? "bg-amber-400/10 border-amber-400/60 text-amber-300 shadow-[0_0_15px_rgba(251,191,36,0.35)]"
                  : "bg-white/5 border-white/10 text-brand-silver hover:text-white hover:border-white/30"
              }`}
            >
              <Sparkles className={`w-3.5 h-3.5 ${isVipMode ? "text-amber-300 animate-pulse" : "text-brand-silver"}`} />
              <span>{isVipMode ? "Modo VIP Ativo" : "Vitrine VIP"}</span>
            </button>

            <a
              href={createWhatsAppLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-white text-brand-black text-xs font-semibold uppercase tracking-wider hover:bg-brand-silver active:scale-[0.98] transition-[background-color,transform] duration-200 focus:outline-none focus:ring-2 focus:ring-brand-silver select-none"
            >
              <MessageCircle className="w-3.5 h-3.5 text-emerald-600 fill-emerald-600" />
              WhatsApp
            </a>
          </div>

          {/* Mobile Right Controls */}
          <div className="flex items-center gap-2.5 lg:hidden">
            <button
              onClick={toggleVipMode}
              aria-label="Alternar Modo VIP"
              className={`p-2 rounded-full border transition-all ${
                isVipMode
                  ? "bg-amber-400/15 border-amber-400/60 text-amber-300 shadow-[0_0_10px_rgba(251,191,36,0.3)]"
                  : "bg-brand-surface border-brand-border text-brand-silver hover:text-white"
              }`}
            >
              <Sparkles className="w-4 h-4" />
            </button>

            <a
              href={createWhatsAppLink()}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Falar no WhatsApp"
              className="p-2 text-brand-white bg-brand-surface border border-brand-border rounded-full hover:border-brand-silver active:scale-[0.95] transition-[border-color,transform] duration-150 focus:outline-none focus:ring-2 focus:ring-brand-silver"
            >
              <MessageCircle className="w-4 h-4 text-emerald-400" />
            </a>

            <button
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Abrir menu de navegação"
              className="p-2 text-brand-silver hover:text-brand-white focus:outline-none focus:ring-2 focus:ring-brand-silver rounded"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Menu */}
      <MobileNavigation
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      />
    </>
  );
}
