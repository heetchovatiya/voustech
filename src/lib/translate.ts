/**
 * Lightweight bilingual translation utility for French inquiries.
 * Provides English translations for French client requirements, services, and consultation requests.
 */

const serviceTranslations: Record<string, string> = {
  "Développement de sites web": "Website Development",
  "Applications web sur mesure": "Custom Web Applications",
  "Développement d'applications mobiles": "Mobile App Development",
  "Design UI/UX et identité de marque": "UI/UX Design & Branding",
  "Solutions cloud et DevOps": "Cloud Solutions & DevOps",
  "Marketing digital et référencement SEO": "Digital Marketing & SEO",
  "Commerce électronique et paiements": "E-Commerce & Payment Systems",
  "Maintenance et sécurité web": "Web Maintenance & Security",
  "Conseil technologique et audit": "Technology Consulting & Audit",
};

const commonPhrases: [RegExp, string][] = [
  [/bonjour/gi, "Hello"],
  [/merci/gi, "Thank you"],
  [/nous cherchons/gi, "We are looking for"],
  [/nous souhaitons/gi, "We would like to"],
  [/nous voulons/gi, "We want to"],
  [/je cherche/gi, "I am looking for"],
  [/je souhaite/gi, "I would like to"],
  [/j'aimerais/gi, "I would like to"],
  [/créer un site web/gi, "create a website"],
  [/développer une application/gi, "develop an application"],
  [/pour notre entreprise/gi, "for our company"],
  [/pour mon entreprise/gi, "for my company"],
  [/notre projet/gi, "our project"],
  [/mon projet/gi, "my project"],
  [/besoin d'un devis/gi, "need a quote"],
  [/dans les plus brefs délais/gi, "as soon as possible"],
  [/cordialement/gi, "Kind regards"],
  [/système de gestion/gi, "management system"],
  [/boutique en ligne/gi, "online store"],
  [/paiement en ligne/gi, "online payment"],
  [/application mobile/gi, "mobile application"],
  [/plateforme/gi, "platform"],
  [/dès que possible/gi, "as soon as possible"],
];

/**
 * Translates or summarizes a French inquiry into clean English.
 */
export function translateFrenchToEnglish(text: string, serviceInterest?: string): {
  translatedService: string;
  translatedText: string;
} {
  const translatedService = serviceInterest
    ? serviceTranslations[serviceInterest] || serviceInterest
    : "Custom Digital Service";

  if (!text || text.trim().length === 0) {
    return { translatedService, translatedText: "" };
  }

  let translated = text;
  for (const [regex, replacement] of commonPhrases) {
    translated = translated.replace(regex, replacement);
  }

  return {
    translatedService,
    translatedText: translated,
  };
}
