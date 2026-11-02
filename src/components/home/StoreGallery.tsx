"use client";

import React from "react";
import Image from "next/image";
import { Clock, MapPin, MessageCircle, AlertCircle } from "lucide-react";
import { siteConfig } from "@/config/site";
import { createWhatsAppLink } from "@/lib/whatsapp";

export function StoreGallery() {
  return (
    <section id="loja" className="py-24 bg-brand-black relative border-t border-brand-border/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header da Seção */}
        <div className="max-w-2xl mb-14">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-6 h-[1px] bg-brand-silver"></span>
            <span className="text-xs font-semibold uppercase tracking-[0.25em] text-brand-silver">
              Atendimento Presencial
            </span>
          </div>
          <h2 className="font-display text-4xl sm:text-5xl font-bold uppercase tracking-tight text-brand-white mb-4">
            Conheça Nosso Espaço.
          </h2>
          <p className="text-brand-silver/90 text-sm sm:text-base font-normal">
            Seu próximo visual pode começar aqui. Um ambiente moderno, pensado para oferecer uma experiência confortável na escolha das suas peças.
          </p>
        </div>

        {/* Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
          
          {/* Main Visual Highlight */}
          <div className="lg:col-span-7 relative min-h-[360px] sm:min-h-[460px] overflow-hidden border border-brand-border/80 bg-brand-surface">
            <Image
              src="https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?auto=format&fit=crop&w=1200&q=80"
              alt="Ambiente e fachada do estabelecimento Black Store"
              fill
              sizes="(max-width: 1024px) 100vw, 60vw"
              className="object-cover object-center filter grayscale-[20%] brightness-90 hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-brand-black/90 via-brand-black/20 to-transparent" />
            
            <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-mono tracking-widest text-brand-silver">
                  Loja Física
                </span>
                <p className="text-lg font-display font-bold uppercase text-brand-white">
                  Espaço Black Store
                </p>
              </div>
              <div className="px-3 py-1 bg-brand-surface/90 border border-brand-border text-[11px] uppercase tracking-wider text-brand-silver">
                Moda Masculina
              </div>
            </div>
          </div>

          {/* Details & Operating Hours Card */}
          <div className="lg:col-span-5 flex flex-col justify-between bg-brand-surface border border-brand-border/80 p-8">
            <div>
              {/* Horários */}
              <div className="flex items-center gap-2.5 pb-4 border-b border-brand-border/60">
                <Clock className="w-5 h-5 text-brand-white" />
                <h3 className="text-sm font-bold uppercase tracking-widest text-brand-white">
                  Horário de Funcionamento
                </h3>
              </div>

              <div className="divide-y divide-brand-border/40 my-6">
                <div className="py-3 flex justify-between items-center text-xs">
                  <span className="text-brand-silver font-medium">Segunda-feira</span>
                  <span className="text-brand-white font-semibold">{siteConfig.storeLocation.hours.monday}</span>
                </div>
                <div className="py-3 flex justify-between items-center text-xs">
                  <span className="text-brand-silver font-medium">Terça a Sábado</span>
                  <span className="text-brand-white font-semibold">{siteConfig.storeLocation.hours.tuesdayToSaturday}</span>
                </div>
                <div className="py-3 flex justify-between items-center text-xs">
                  <span className="text-brand-silver font-medium">Domingo</span>
                  <span className="text-brand-white font-semibold">{siteConfig.storeLocation.hours.sunday}</span>
                </div>
              </div>

              <p className="text-[11px] text-brand-muted italic mb-6">
                * {siteConfig.storeLocation.hoursNote}
              </p>

              {/* Status de Endereço Conforme Regra: não inventar endereço */}
              <div className="p-4 bg-brand-black/60 border border-brand-border/60 mb-6">
                <div className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-brand-silver shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-brand-white">
                      Endereço da Loja
                    </h4>
                    <p className="text-xs text-brand-silver/80 mt-1">
                      {siteConfig.storeLocation.isAddressConfirmed
                        ? `${siteConfig.storeLocation.street}, ${siteConfig.storeLocation.city}`
                        : "Consulte a localização exata e pontos de referência pelo WhatsApp."}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* CTAs */}
            <div className="pt-6 border-t border-brand-border/60">
              <a
                href={createWhatsAppLink("Olá! Gostaria de consultar o endereço e como chegar à loja física da Black Store.")}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2.5 py-3.5 bg-brand-white text-brand-black font-semibold text-xs uppercase tracking-widest hover:bg-brand-silver transition-colors focus:outline-none focus:ring-2 focus:ring-brand-silver"
              >
                <MessageCircle className="w-4 h-4 text-emerald-600" />
                Como Chegar • Fale no WhatsApp
              </a>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
