"use client";

import React from "react";
import { Star, CheckCircle2, MessageCircle } from "lucide-react";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { createWhatsAppLink } from "@/lib/whatsapp";

const reviews = [
  {
    name: "Lucas M.",
    city: "Cliente Loja Física",
    text: "Passei na loja pra experimentar o conjunto e o tênis. Atendimento 10/10, o tecido tem um peso que não se acha fácil por aí. Já virei cliente fixo.",
    verified: "Compra Verificada",
  },
  {
    name: "Gabriel S.",
    city: "Atendimento WhatsApp",
    text: "Mandei mensagem com minha altura e peso, o atendente recomendou o tamanho exato. Chegou no mesmo dia impecável. Recomendo demais!",
    verified: "Compra Verificada",
  },
  {
    name: "Rafael B.",
    city: "Colecionador Sneaker",
    text: "O Air Force veio perfeito, caixa intacta e qualidade no detalhe. Difícil achar loja com esse padrão de seleção hoje em dia.",
    verified: "Compra Verificada",
  },
];

export function CustomerReviews() {
  return (
    <section className="py-24 bg-brand-black border-t border-brand-border/40 relative select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Cabeçalho */}
        <ScrollReveal>
          <div className="max-w-2xl mb-14">
            <div className="flex items-center gap-2 mb-3">
              <span className="w-6 h-[1px] bg-brand-silver"></span>
              <span className="text-xs font-semibold uppercase tracking-[0.25em] text-brand-silver">
                Experiência Comprovada
              </span>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl font-bold uppercase tracking-tight text-brand-white mb-3">
              Quem Conhece, Recomenda.
            </h2>
            <p className="text-brand-silver/90 text-sm sm:text-base">
              A satisfação dos nossos clientes com o atendimento ágil e a qualidade de cada peça.
            </p>
          </div>
        </ScrollReveal>

        {/* Grid de Feedbacks */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.map((rev, index) => (
            <ScrollReveal key={index} delay={index * 120}>
              <div className="h-full flex flex-col justify-between p-6 sm:p-7 bg-brand-surface border border-brand-border/70 hover:border-brand-silver/40 transition-colors shadow-lg">
                <div>
                  {/* Estrelas */}
                  <div className="flex items-center gap-1 mb-4 text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>

                  {/* Depoimento */}
                  <p className="text-xs sm:text-sm text-brand-silver/90 leading-relaxed italic mb-6">
                    &ldquo;{rev.text}&rdquo;
                  </p>
                </div>

                {/* Autor */}
                <div className="pt-4 border-t border-brand-border/40 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-brand-white">
                      {rev.name}
                    </p>
                    <p className="text-[10px] text-brand-silver/60">
                      {rev.city}
                    </p>
                  </div>
                  <span className="inline-flex items-center gap-1 text-[10px] uppercase font-mono tracking-wider text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-800/40">
                    <CheckCircle2 className="w-3 h-3" />
                    {rev.verified}
                  </span>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>

        {/* CTA Sutil de WhatsApp */}
        <ScrollReveal delay={200}>
          <div className="mt-12 text-center">
            <a
              href={createWhatsAppLink("Olá! Gostaria de tirar uma dúvida sobre as peças com a equipe da Black Store.")}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-brand-surface hover:bg-white hover:text-black border border-brand-border text-xs uppercase font-semibold tracking-wider text-brand-silver transition-all"
            >
              <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
              <span>Tirar Dúvidas com um Atendente</span>
            </a>
          </div>
        </ScrollReveal>

      </div>
    </section>
  );
}
