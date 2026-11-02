import React from "react";
import Image from "next/image";
import { MessageCircle, Clock, MapPin } from "lucide-react";
import { InstagramIcon } from "@/components/ui/InstagramIcon";
import { siteConfig } from "@/config/site";
import { createWhatsAppLink } from "@/lib/whatsapp";

export function Footer() {
  const currentYear = new Date().getFullYear();

  const navLinks = [
    { label: "Início", href: "#inicio" },
    { label: "Coleções", href: "#colecoes" },
    { label: "Destaques", href: "#destaques" },
    { label: "Linha Esportiva", href: "#esportivo" },
    { label: "Sobre a Loja", href: "#sobre" },
    { label: "Espaço Físico", href: "#loja" },
    { label: "Contato", href: "#contato" },
  ];

  return (
    <footer className="bg-brand-black border-t border-brand-border/60 text-brand-silver">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-12">
          
          {/* Brand Presentation */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="relative w-10 h-10 rounded-full overflow-hidden border border-brand-border bg-black">
                <Image
                  src="/logo.jpg"
                  alt="BLACK STORE"
                  fill
                  className="object-contain"
                />
              </div>
              <span className="font-display font-bold text-xl tracking-[0.25em] text-brand-white">
                BLACK STORE
              </span>
            </div>

            <p className="text-xs text-brand-silver/80 leading-relaxed max-w-sm">
              Moda masculina com atitude, elegância e conforto. Peças pensadas para destacar a presença e a personalidade de quem veste.
            </p>

            <div className="pt-2 flex items-center gap-4">
              <a
                href={siteConfig.instagram.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram oficial da Black Store"
                className="w-9 h-9 rounded-full bg-brand-surface border border-brand-border flex items-center justify-center text-brand-silver hover:text-brand-white hover:border-brand-silver transition-colors"
              >
                <InstagramIcon className="w-4 h-4" />
              </a>

              <a
                href={createWhatsAppLink()}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp da Black Store"
                className="w-9 h-9 rounded-full bg-brand-surface border border-brand-border flex items-center justify-center text-brand-silver hover:text-brand-white hover:border-brand-silver transition-colors"
              >
                <MessageCircle className="w-4 h-4 text-emerald-400" />
              </a>
            </div>
          </div>

          {/* Quick Nav */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="font-display text-sm font-bold uppercase tracking-widest text-brand-white">
              Navegação
            </h4>
            <ul className="space-y-2 text-xs">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="hover:text-brand-white transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & Hours */}
          <div className="lg:col-span-4 space-y-3">
            <h4 className="font-display text-sm font-bold uppercase tracking-widest text-brand-white">
              Atendimento
            </h4>
            <div className="space-y-2 text-xs text-brand-silver/80">
              <p className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>WhatsApp: {siteConfig.whatsapp.displayNumber}</span>
              </p>
              <p className="flex items-center gap-2">
                <InstagramIcon className="w-4 h-4 text-brand-silver shrink-0" />
                <span>Instagram: {siteConfig.instagram.handle}</span>
              </p>
              <p className="flex items-start gap-2 pt-1">
                <Clock className="w-4 h-4 text-brand-silver shrink-0 mt-0.5" />
                <span>
                  Seg: {siteConfig.storeLocation.hours.monday} | Ter-Sáb:{" "}
                  {siteConfig.storeLocation.hours.tuesdayToSaturday}
                </span>
              </p>
            </div>

            {siteConfig.demoMode && (
              <div className="mt-4 p-3 bg-brand-surface border border-brand-border/60 text-[11px] text-brand-muted">
                Página demonstrativa conceitual desenvolvida para a marca Black Store.
              </div>
            )}
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-14 pt-8 border-t border-brand-border/40 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-brand-muted uppercase tracking-wider">
          <p>© {currentYear} BLACK STORE. Todos os direitos reservados.</p>
          <p>Elegância em cada detalhe.</p>
        </div>
      </div>
    </footer>
  );
}
