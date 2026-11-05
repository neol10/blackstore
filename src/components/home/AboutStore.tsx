import React from "react";
import Image from "next/image";
import { Sparkles, CheckCircle2 } from "lucide-react";

export function AboutStore() {
  return (
    <section id="sobre" className="py-24 bg-brand-surface relative border-t border-brand-border/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Text and Philosophy */}
          <div className="lg:col-span-6 flex flex-col justify-center">
            <div className="flex items-center gap-2 mb-3">
              <span className="w-6 h-[1px] bg-brand-silver"></span>
              <span className="text-xs font-semibold uppercase tracking-[0.25em] text-brand-silver">
                Identidade & Propósito
              </span>
            </div>

            <h2 className="font-display text-4xl sm:text-5xl font-bold uppercase tracking-tight text-brand-white leading-tight mb-6">
              Mais Que Roupas.
              <br />
              <span className="text-brand-silver">Uma Questão de Estilo.</span>
            </h2>

            <div className="space-y-4 text-brand-silver/90 text-sm sm:text-base leading-relaxed">
              <p>
                Na Black Store, você encontra opções de moda masculina para diferentes momentos do seu dia. Do visual casual ao esportivo, nossa proposta é reunir variedade, estilo e praticidade em um só lugar.
              </p>
              <p>
                Acreditamos que a vestimenta expressa segurança e atitude. Por isso, selecionamos peças com atenção ao caimento, à textura dos tecidos e à harmonia das combinações.
              </p>
            </div>

            {/* Diferenciais Claros e Objetivos */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8 pt-8 border-t border-brand-border/60">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-brand-white shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-xs uppercase font-bold text-brand-white">Curadoria Específica</h3>
                  <p className="text-xs text-brand-silver/70 mt-0.5">Modelagens alinhadas às tendências contemporâneas.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-brand-white shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-xs uppercase font-bold text-brand-white">Atendimento Dedicado</h3>
                  <p className="text-xs text-brand-silver/70 mt-0.5">Suporte direto pelo WhatsApp para escolher o melhor tamanho.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-brand-white shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-xs uppercase font-bold text-brand-white">Variedade Completa</h3>
                  <p className="text-xs text-brand-silver/70 mt-0.5">Do look de treino à camisa social alinhada.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-brand-white shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-xs uppercase font-bold text-brand-white">Espaço Físico</h3>
                  <p className="text-xs text-brand-silver/70 mt-0.5">Ambiente preparado para provar e receber você.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Visual Showcase */}
          <div className="lg:col-span-6 relative">
            <div className="relative aspect-[4/5] sm:aspect-square w-full overflow-hidden border border-brand-border/80 shadow-2xl">
              <Image
                src="https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?auto=format&fit=crop&w=800&q=70"
                alt="Ambiente de moda masculina e exposição de coleções"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover object-center filter grayscale-[30%] contrast-[1.05]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-black/80 via-transparent to-transparent" />
              
              <div className="absolute bottom-6 left-6 right-6 p-4 bg-brand-black/90 backdrop-blur-md border border-brand-border/60">
                <div className="flex items-center gap-3">
                  <div className="relative w-8 h-8 rounded-full overflow-hidden border border-brand-border bg-black shrink-0">
                    <Image
                      src="/logo.jpg"
                      alt="BLACK STORE"
                      fill
                      className="object-contain"
                    />
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-brand-white">
                      Black Store
                    </p>
                    <p className="text-[10px] text-brand-silver uppercase tracking-widest">
                      Elegância em cada detalhe
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
