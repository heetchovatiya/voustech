import type { IconName } from "@/components/icons/Icon";

export type ServiceCategory =
  | "web-apps"
  | "design-branding"
  | "business-systems"
  | "infrastructure-growth";

export interface ServiceDef {
  slug: string;
  category: ServiceCategory;
  icon: IconName;
}

export const services: ServiceDef[] = [
  // Web & Apps
  { slug: "website-development", category: "web-apps", icon: "globe" },
  { slug: "custom-web-applications", category: "web-apps", icon: "code" },
  { slug: "mobile-app-development", category: "web-apps", icon: "smartphone" },
  { slug: "ui-ux-design", category: "web-apps", icon: "pen-tool" },
  { slug: "website-maintenance", category: "web-apps", icon: "wrench" },
  { slug: "ecommerce-development", category: "web-apps", icon: "cart" },
  { slug: "custom-software-development", category: "web-apps", icon: "terminal" },

  // Design & Branding
  { slug: "brand-identity", category: "design-branding", icon: "palette" },
  { slug: "logo-design", category: "design-branding", icon: "diamond" },
  { slug: "graphic-design", category: "design-branding", icon: "image" },
  { slug: "social-media-management", category: "design-branding", icon: "share" },

  // Business Systems
  { slug: "erp-solutions", category: "business-systems", icon: "layers" },
  { slug: "crm-development", category: "business-systems", icon: "users" },
  { slug: "business-automation", category: "business-systems", icon: "zap" },
  { slug: "data-analytics", category: "business-systems", icon: "bar-chart" },
  { slug: "ai-integration", category: "business-systems", icon: "cpu" },

  // Infrastructure & Growth
  { slug: "seo-optimization", category: "infrastructure-growth", icon: "search" },
  { slug: "cloud-solutions", category: "infrastructure-growth", icon: "cloud" },
  { slug: "hosting", category: "infrastructure-growth", icon: "server" },
  { slug: "domain-registration", category: "infrastructure-growth", icon: "link" },
  { slug: "api-integration", category: "infrastructure-growth", icon: "plug" },
  {
    slug: "payment-gateway-integration",
    category: "infrastructure-growth",
    icon: "credit-card",
  },
  { slug: "digital-marketing", category: "infrastructure-growth", icon: "megaphone" },
  { slug: "technical-consulting", category: "infrastructure-growth", icon: "compass" },
  { slug: "software-support", category: "infrastructure-growth", icon: "life-buoy" },
  { slug: "cyber-security", category: "infrastructure-growth", icon: "lock" },
  {
    slug: "performance-optimization",
    category: "infrastructure-growth",
    icon: "gauge",
  },
];

export type ServiceCategoryLabelKey =
  | "webApps"
  | "designBranding"
  | "businessSystems"
  | "infrastructureGrowth";

export const serviceCategories: {
  id: ServiceCategory;
  labelKey: ServiceCategoryLabelKey;
}[] = [
  { id: "web-apps", labelKey: "webApps" },
  { id: "design-branding", labelKey: "designBranding" },
  { id: "business-systems", labelKey: "businessSystems" },
  { id: "infrastructure-growth", labelKey: "infrastructureGrowth" },
];

export function getServiceBySlug(slug: string) {
  return services.find((s) => s.slug === slug);
}

export function getServiceCategory(categoryId: ServiceCategory) {
  return serviceCategories.find((c) => c.id === categoryId);
}

/** Services grouped in category order for mega-menu / index layouts. */
export function getServicesByCategory() {
  return serviceCategories.map((category) => ({
    ...category,
    services: services.filter((s) => s.category === category.id),
  }));
}
