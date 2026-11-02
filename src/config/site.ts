export interface SiteConfig {
  name: string;
  tagline: string;
  description: string;
  demoMode: boolean;
  instagram: {
    handle: string;
    url: string;
  };
  whatsapp: {
    rawNumber: string; // ex: 5519971548423
    displayNumber: string; // ex: (19) 97154-8423
    isConfirmed: boolean; // se false, avisa ou aguarda confirmação comercial
    defaultMessage: string;
    productInquiryMessage: (productName: string) => string;
  };
  storeLocation: {
    isAddressConfirmed: boolean;
    street?: string;
    city?: string;
    state?: string;
    hours: {
      monday: string;
      tuesdayToSaturday: string;
      sunday: string;
    };
    hoursNote: string;
  };
}

export const siteConfig: SiteConfig = {
  name: "BLACK STORE",
  tagline: "Elegância em cada detalhe.",
  description:
    "Moda masculina premium para quem valoriza estilo, conforto e personalidade. Roupas casuais, esportivas, sociais e calçados.",
  demoMode: true,
  instagram: {
    handle: "@soublackstore",
    url: "https://www.instagram.com/soublackstore/",
  },
  whatsapp: {
    // Número preliminar identificado nos materiais visuais do Instagram
    rawNumber: "5519971548423",
    displayNumber: "(19) 97154-8423",
    isConfirmed: true, // Configurado com o canal direto da Black Store
    defaultMessage:
      "Olá! Conheci a Black Store pelo site e gostaria de saber mais sobre as coleções.",
    productInquiryMessage: (productName: string) =>
      `Olá! Vi o produto ${productName} no site da Black Store e gostaria de consultar disponibilidade, tamanhos e valores.`,
  },
  storeLocation: {
    // Endereço exato aguarda confirmação do proprietário para exibição de rota no Google Maps
    isAddressConfirmed: false,
    hours: {
      monday: "12h às 18h",
      tuesdayToSaturday: "09h às 19h",
      sunday: "09h às 12h",
    },
    hoursNote: "Horários preliminares baseados no atendimento da loja.",
  },
};
