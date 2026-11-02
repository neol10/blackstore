import { siteConfig } from "@/config/site";

export function createWhatsAppLink(message?: string): string {
  const number = siteConfig.whatsapp.rawNumber;
  const text = message || siteConfig.whatsapp.defaultMessage;
  const encodedText = encodeURIComponent(text);
  return `https://wa.me/${number}?text=${encodedText}`;
}

export function createProductWhatsAppLink(productName: string): string {
  const message = siteConfig.whatsapp.productInquiryMessage(productName);
  return createWhatsAppLink(message);
}
