"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import { X, MessageCircle, ArrowRight } from "lucide-react";
import { InstagramIcon } from "@/components/ui/InstagramIcon";
import { siteConfig } from "@/config/site";
import { createWhatsAppLink } from "@/lib/whatsapp";

interface MobileNavigationProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileNavigation({ isOpen, onClose }: MobileNavigationProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const navLinks = [
    { label: "Início", href: "#inicio" },
    { label: "Coleções", href: "#colecoes" },
    { label: "Destaques", href: "#destaques" },
    { label: "Linha Esportiva", href: "#esportivo" },
    { label: "A Black Store", href: "#sobre" },
    { label: "Nossa Loja", href: "#loja" },
    { label: "Contato", href: "#contato" },
  ];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Menu de Navegação Mobile"
      className="fixed inset-0 z-50 flex flex-col bg-brand-black/95 backdrop-blur-xl transition-all duration-300 md:hidden"
    >
      {/* Top Bar */}
      <div className="flex items-center justify-between px-6 py-5 border-b border-brand-border/60">
        <div className="flex items-center gap-3">
          <div className="relative w-8 h-8 rounded-full overflow-hidden border border-brand-border bg-black">
            <Image
              src="/logo.jpg"
              alt="BLACK STORE"
              fill
              className="object-contain"
            />
          </div>
          <span className="font-display tracking-widest text-lg font-bold text-brand-white">
            BLACK STORE
          </span>
        </div>

        <button
          onClick={onClose}
          aria-label="Fechar menu"
          className="p-2 text-brand-silver hover:text-brand-white focus:outline-none focus:ring-2 focus:ring-brand-silver rounded"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Nav Links */}
      <nav className="flex-1 overflow-y-auto px-6 py-8 flex flex-col justify-between">
        <ul className="space-y-4">
          {navLinks.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                onClick={onClose}
                className="flex items-center justify-between py-2 text-xl font-display uppercase tracking-widest text-brand-silver hover:text-brand-white transition-colors border-b border-brand-border/30"
              >
                <span>{link.label}</span>
                <ArrowRight className="w-4 h-4 opacity-40" />
              </a>
            </li>
          ))}
        </ul>

        {/* Action Bottom */}
        <div className="mt-8 space-y-4 pt-6 border-t border-brand-border/60">
          <a
            href={createWhatsAppLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-2 py-3.5 bg-brand-white text-brand-black font-semibold uppercase tracking-wider text-sm hover:bg-brand-silver transition-colors"
          >
            <MessageCircle className="w-5 h-5 text-emerald-600" />
            Fale no WhatsApp
          </a>

          <a
            href={siteConfig.instagram.url}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-2 py-3 bg-brand-surface text-brand-silver border border-brand-border text-xs uppercase tracking-widest hover:text-brand-white hover:border-brand-silver transition-colors"
          >
            <InstagramIcon className="w-4 h-4" />
            Instagram {siteConfig.instagram.handle}
          </a>

          <p className="text-[11px] text-center text-brand-muted uppercase tracking-widest pt-2">
            Elegância em cada detalhe.
          </p>
        </div>
      </nav>
    </div>
  );
}
