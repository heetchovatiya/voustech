export interface StatDef {
  key: string;
  value?: number;
  rawValue?: string;
  suffix: string;
}

/** Authentic engineering benchmarks and standards; labels are translated (messages: stats.items.<key>). */
export const stats: StatDef[] = [
  { key: "ownership", value: 100, suffix: "%" },
  { key: "bilingual", rawValue: "EN / FR", suffix: "" },
  { key: "speed", rawValue: "< 0.5s", suffix: "" },
  { key: "support", value: 24, suffix: "/7" },
  { key: "location", rawValue: "DRC 🇨🇩", suffix: "" },
];
