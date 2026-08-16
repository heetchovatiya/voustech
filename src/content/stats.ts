export interface StatDef {
  key: string;
  value: number;
  suffix: string;
}

/** Raw numbers for the count-up animation; labels are translated (messages: stats.items.<key>). */
export const stats: StatDef[] = [
  { key: "projects", value: 150, suffix: "+" },
  { key: "experience", value: 8, suffix: "+" },
  { key: "happyClients", value: 95, suffix: "%" },
  { key: "countries", value: 6, suffix: "" },
  { key: "support", value: 24, suffix: "/7" },
];
