"use client";

import { useState } from "react";
import { useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Reveal } from "@/components/ui/Reveal";
import { Icon, type IconName } from "@/components/icons/Icon";

const industryIcons: IconName[] = [
  "life-buoy", // Healthcare
  "users", // Education
  "cart", // Retail
  "share", // Restaurants
  "map-pin", // Real Estate
  "wrench", // Construction
  "credit-card", // Finance
  "cpu", // Manufacturing
  "layers", // Logistics
  "users", // NGOs
  "globe", // Government
  "compass", // Travel
  "hotel", // Hospitality
  "zap", // Agriculture
  "diamond", // Mining
  "smartphone", // Telecommunications
];

const sectorCapabilitiesEn: Record<string, string> = {
  Healthcare: "Patient portals, appointment booking, telehealth & clinic management platforms.",
  Education: "E-learning platforms, student portals, school management & digital admissions.",
  Retail: "Custom e-commerce storefronts, inventory tracking & Mobile Money checkout.",
  Restaurants: "Digital menus, online ordering, table reservations & kitchen workflow systems.",
  "Real Estate": "Property listing portals, virtual showcase tours & tenant management systems.",
  Construction: "Project management portals, job-site tracking & equipment maintenance logs.",
  Finance: "Fintech web apps, Mobile Money payment gateways & secure financial dashboards.",
  Manufacturing: "Production tracking, supply chain portals & equipment monitoring dashboards.",
  Logistics: "Fleet dispatch systems, real-time cargo tracking & warehouse management.",
  NGOs: "Donor management, impact reporting dashboards & field data collection apps.",
  Government: "Citizen self-service portals, municipal workflows & document verification.",
  Travel: "Tour booking engines, itinerary management & multilingual digital guides.",
  Hospitality: "Direct booking engines, guest concierge apps & hotel PMS integrations.",
  Agriculture: "Agri-tech dashboards, harvest tracking & cooperative supply portals.",
  Mining: "Site safety portals, asset management dashboards & resource analytics.",
  Telecommunications: "Subscriber portals, airtime/bundle integrations & customer self-care apps.",
};

const sectorCapabilitiesFr: Record<string, string> = {
  Santé: "Portails patients, prise de rendez-vous, télésanté et gestion clinique.",
  Éducation: "Plateformes e-learning, portails étudiants et gestion académique.",
  "Commerce de détail": "Boutiques en ligne sur mesure, gestion des stocks et paiement mobile.",
  Restauration: "Menus digitaux, commandes en ligne, réservations et gestion cuisine.",
  Immobilier: "Portails d'annonces, visites virtuelles et gestion locative.",
  Construction: "Suivi de chantiers, gestion de projets et matériel.",
  Finance: "Applications fintech, passerelles Mobile Money et tableaux de bord financiers.",
  Industrie: "Suivi de production, chaîne d'approvisionnement et maintenance.",
  Logistique: "Gestion de flotte, suivi de fret en temps réel et gestion d'entrepôt.",
  ONGs: "Gestion des donateurs, rapports d'impact et collecte de données terrain.",
  Gouvernement: "Portails citoyens, démarches en ligne et vérification de documents.",
  Voyage: "Moteurs de réservation de voyages, circuits et guides multilingues.",
  Hôtellerie: "Réservations directes, conciergerie digitale et intégration PMS.",
  Agriculture: "Tableaux de bord agri-tech, suivi des récoltes et coopératives.",
  Mines: "Portails de sécurité de site, gestion des actifs et analytique minière.",
  Télécommunications: "Portails abonnés, recharge forfaits et service client digital.",
};

export function IndustriesClient({ items }: { items: string[] }) {
  const locale = useLocale();
  const isFr = locale?.startsWith("fr");
  const [activeIdx, setActiveIdx] = useState<number | null>(null);

  const capabilitiesMap = isFr ? sectorCapabilitiesFr : sectorCapabilitiesEn;

  const toggleSector = (i: number) => {
    setActiveIdx((prev) => (prev === i ? null : i));
  };

  return (
    <>
      {/* 📱 Mobile View: 2-Column Icon-Tile Grid with Tap-to-Reveal Value Expansion */}
      <div className="mt-6 sm:hidden">
        <p className="mb-3 text-xs font-mono text-tech-blue flex items-center justify-between">
          <span>{isFr ? "Appuyez pour voir les solutions" : "Tap any tile to explore solutions"}</span>
          <span>{activeIdx !== null ? "1 active" : ""}</span>
        </p>

        <div className="grid grid-cols-2 gap-2.5">
          {items.map((item, i) => {
            const isOpen = activeIdx === i;
            const capability = capabilitiesMap[item] || (isFr ? "Solutions logicielles et plateformes sur mesure pour ce secteur." : "Custom software and digital platforms engineered for this sector.");

            return (
              <div
                key={item}
                onClick={() => toggleSector(i)}
                className={`transition-all duration-200 cursor-pointer rounded-sm border ${
                  isOpen
                    ? "col-span-2 border-tech-blue bg-tech-blue/[0.07] p-4 shadow-sm"
                    : "border-line bg-surface p-2.5 flex items-center hover:border-tech-blue/60"
                }`}
              >
                {isOpen ? (
                  // Expanded State: Full span with value pitch + CTA
                  <div className="w-full">
                    <div className="flex items-center justify-between gap-3 border-b border-line/60 pb-2 mb-2">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className="shrink-0 text-tech-blue">
                          <Icon
                            name={industryIcons[i % industryIcons.length]}
                            size={20}
                          />
                        </span>
                        <h3 className="truncate font-display text-body-sm font-semibold text-ink">
                          {item}
                        </h3>
                      </div>
                      <span className="shrink-0 text-[11px] font-mono text-tech-blue border border-tech-blue/40 px-1.5 py-0.5 rounded-sm">
                        {isFr ? "Fermer ✕" : "Close ✕"}
                      </span>
                    </div>

                    <p className="text-xs text-ink-muted leading-relaxed">
                      {capability}
                    </p>

                    <div className="mt-2.5 pt-2 border-t border-line/60 flex items-center justify-between">
                      <Link
                        href="/contact"
                        className="text-xs font-mono font-semibold text-tech-blue hover:underline flex items-center gap-1"
                      >
                        <span>{isFr ? "Discuter d'un projet" : "Start a project in this sector"}</span>
                        <span>→</span>
                      </Link>
                    </div>
                  </div>
                ) : (
                  // Compact Tile State: Icon left, title right (reduced height)
                  <div className="flex items-center gap-2.5 min-w-0 w-full">
                    <span className="shrink-0 text-tech-blue">
                      <Icon
                        name={industryIcons[i % industryIcons.length]}
                        size={17}
                      />
                    </span>
                    <h3 className="truncate text-xs font-display font-semibold text-ink">
                      {item}
                    </h3>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* 💻 Desktop / Tablet View: Full 4-column structured grid */}
      <ul className="mt-8 hidden sm:grid border-t border-l border-line sm:grid-cols-2 lg:grid-cols-4">
        {items.map((item, i) => {
          const index = String(i + 1).padStart(2, "0");

          return (
            <li key={item} className="border-b border-r border-line">
              <Reveal delayMs={(i % 4) * 40} className="h-full">
                <article className="group flex h-full items-center gap-3 px-4 py-4 transition-colors duration-150 hover:bg-tech-blue/[0.04] sm:px-5">
                  <span className="shrink-0 font-mono text-body-sm font-medium tracking-[0.08em] text-tech-blue">
                    {index}
                  </span>
                  <h3 className="min-w-0 flex-1 text-body-sm font-display font-semibold text-ink transition-colors duration-150 group-hover:text-tech-blue">
                    {item}
                  </h3>
                  <span className="shrink-0 text-tech-blue transition-colors duration-150 group-hover:text-deep-ocean">
                    <Icon
                      name={industryIcons[i % industryIcons.length]}
                      size={18}
                    />
                  </span>
                </article>
              </Reveal>
            </li>
          );
        })}
      </ul>
    </>
  );
}
