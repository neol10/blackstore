"use client";

import React, { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/home/Hero";
import { BrandMarquee } from "@/components/ui/BrandMarquee";
import { CategoryGrid } from "@/components/catalog/CategoryGrid";
import { ProductGrid } from "@/components/catalog/ProductGrid";
import { SportsEditorial } from "@/components/home/SportsEditorial";
import { StoreStories } from "@/components/home/StoreStories";
import { AboutStore } from "@/components/home/AboutStore";
import { StoreGallery } from "@/components/home/StoreGallery";
import { CustomerReviews } from "@/components/home/CustomerReviews";
import { ContactSection } from "@/components/home/ContactSection";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
import { BlackStoreRadio } from "@/components/ui/BlackStoreRadio";
import { IntroTransition } from "@/components/ui/IntroTransition";
import { productsData } from "@/data/products";
import { ProductCategory } from "@/types";

export default function HomePage() {
  const [selectedCategory, setSelectedCategory] =
    useState<ProductCategory>("all");

  return (
    <div className="min-h-screen bg-brand-black flex flex-col text-brand-offwhite">
      {/* Transição Cinematográfica de Abertura / Porta de Boutique */}
      <IntroTransition />

      {/* Top Header */}
      <Header />

      <main className="flex-1">
        {/* 1. Hero / Primeira Dobra com Vídeo Contínuo */}
        <Hero />

        {/* 2. Marquee Infinito de Conceito da Marca */}
        <BrandMarquee />

        {/* 3. Categorias Principais */}
        <CategoryGrid onSelectCategory={setSelectedCategory} />

        {/* 4. Vitrine de Produtos com Filtros Dinâmicos */}
        <ProductGrid
          products={productsData}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />

        {/* 5. Linha Esportiva & Futebol Editorial */}
        <SportsEditorial onSelectCategory={setSelectedCategory} />

        {/* 6. Destaques & Bastidores em Formato Stories 9:16 */}
        <StoreStories />

        {/* 7. Identidade & Filosofia da Marca */}
        <AboutStore />

        {/* 8. Espaço Físico & Horários */}
        <StoreGallery />

        {/* 9. Prova Social VIP (Feedbacks Reais) */}
        <CustomerReviews />

        {/* 10. CTA Final & Contato */}
        <ContactSection />
      </main>

      {/* Footer */}
      <Footer />

      {/* Floating WhatsApp Action */}
      <WhatsAppButton variant="floating" />

      {/* Rádio Lounge Urbano Black Store */}
      <BlackStoreRadio />
    </div>
  );
}
