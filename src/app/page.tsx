"use client";

import React, { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/home/Hero";
import { CategoryGrid } from "@/components/catalog/CategoryGrid";
import { ProductGrid } from "@/components/catalog/ProductGrid";
import { SportsEditorial } from "@/components/home/SportsEditorial";
import { AboutStore } from "@/components/home/AboutStore";
import { StoreGallery } from "@/components/home/StoreGallery";
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

        {/* 2. Categorias Principais */}
        <CategoryGrid onSelectCategory={setSelectedCategory} />

        {/* 3. Vitrine de Produtos com Filtros Dinâmicos */}
        <ProductGrid
          products={productsData}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />

        {/* 4. Linha Esportiva & Futebol Editorial */}
        <SportsEditorial onSelectCategory={setSelectedCategory} />

        {/* 6. Identidade & Filosofia da Marca */}
        <AboutStore />

        {/* 7. Espaço Físico & Horários */}
        <StoreGallery />

        {/* 8. CTA Final & Contato */}
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
