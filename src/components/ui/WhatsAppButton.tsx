"use client";

import React from "react";
import { MessageCircle } from "lucide-react";
import { createWhatsAppLink } from "@/lib/whatsapp";
import { siteConfig } from "@/config/site";

interface WhatsAppButtonProps {
  message?: string;
  className?: string;
  variant?: "primary" | "secondary" | "floating" | "outline";
  children?: React.ReactNode;
}

export function WhatsAppButton({
  message,
  className = "",
  variant = "primary",
  children,
}: WhatsAppButtonProps) {
  const url = createWhatsAppLink(message);

  if (variant === "floating") {
    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Falar com a Black Store no WhatsApp"
        className={`fixed bottom-6 right-6 z-40 flex items-center gap-3 px-4 py-3 bg-[#25D366] text-black font-semibold rounded-full shadow-2xl hover:bg-[#20ba59] hover:scale-105 active:scale-95 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#25D366] focus:ring-offset-2 focus:ring-offset-brand-black ${className}`}
      >
        <MessageCircle className="w-6 h-6 stroke-[2.2]" />
        <span className="hidden sm:inline-block text-xs uppercase tracking-wider font-bold">
          Fale Conosco
        </span>
      </a>
    );
  }

  const baseStyles =
    "inline-flex items-center justify-center gap-2.5 font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-brand-black text-sm uppercase tracking-wider select-none";

  const variantStyles = {
    primary:
      "bg-brand-white text-brand-black hover:bg-brand-silver font-semibold px-6 py-3.5 border border-brand-white",
    secondary:
      "bg-transparent text-brand-white border border-brand-border hover:border-brand-silver hover:bg-brand-surface px-6 py-3.5",
    outline:
      "bg-brand-surface/80 text-brand-offwhite border border-brand-border hover:border-brand-silver px-5 py-2.5 text-xs hover:text-white",
    floating: "",
  };

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={typeof children === "string" ? children : "Contato WhatsApp"}
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
    >
      <MessageCircle className="w-4 h-4 text-emerald-400" />
      {children || "Falar no WhatsApp"}
    </a>
  );
}
