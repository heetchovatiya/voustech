export interface TechCategory {
  key: string;
  items: string[];
}

/** Tech names are proper nouns — identical across locales. Category label is translated (technologies.categories.<key>). */
export const technologyCategories: TechCategory[] = [
  { key: "frontend", items: ["React", "Angular", "Vue.js", "Next.js", "HTML5/CSS3", "Tailwind CSS", "TypeScript"] },
  { key: "backend", items: ["Node.js", "Laravel (PHP)", "Django (Python)", "Express.js", "NestJS", ".NET Core"] },
  { key: "mobile", items: ["Flutter", "React Native", "Kotlin (Android)", "Swift (iOS)"] },
  { key: "database", items: ["MySQL", "PostgreSQL", "MongoDB", "Firebase", "Redis"] },
  { key: "cloud", items: ["AWS", "Google Cloud Platform", "Microsoft Azure", "DigitalOcean"] },
  { key: "devops", items: ["Docker", "GitHub Actions", "CI/CD Pipelines", "Kubernetes"] },
  { key: "ui", items: ["Figma", "Bootstrap", "Material UI", "Shadcn/UI"] },
  { key: "cms", items: ["WordPress", "Strapi", "Webflow", "Sanity"] },
  { key: "ecommerce", items: ["WooCommerce", "Shopify", "Custom Cart Systems"] },
  { key: "ai", items: ["OpenAI API", "TensorFlow", "LangChain", "Custom ML Models"] },
];
