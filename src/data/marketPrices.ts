import type { CropId } from "./crops";

export interface PriceRow {
  cropId: CropId;
  unitLabel: string;
  current: number;
  history: number[]; // last 7 days, oldest first
}

const base: Record<string, PriceRow[]> = {
  default: [
    { cropId: "maize",    unitLabel: "90kg",  current: 2700, history: [2580, 2600, 2610, 2640, 2660, 2680, 2700] },
    { cropId: "beans",    unitLabel: "90kg",  current: 5600, history: [5680, 5670, 5660, 5650, 5640, 5620, 5600] },
    { cropId: "potatoes", unitLabel: "50kg",  current: 1800, history: [1740, 1750, 1760, 1770, 1780, 1790, 1800] },
    { cropId: "tomatoes", unitLabel: "crate", current: 3200, history: [3110, 3120, 3140, 3160, 3170, 3180, 3200] },
    { cropId: "kales",    unitLabel: "bunch", current: 1200, history: [1210, 1208, 1206, 1204, 1203, 1202, 1200] },
  ],
  Nairobi: [
    { cropId: "maize",    unitLabel: "90kg",  current: 2900, history: [2780, 2800, 2810, 2840, 2860, 2880, 2900] },
    { cropId: "beans",    unitLabel: "90kg",  current: 5900, history: [5980, 5970, 5960, 5950, 5940, 5920, 5900] },
    { cropId: "potatoes", unitLabel: "50kg",  current: 2000, history: [1940, 1950, 1960, 1970, 1980, 1990, 2000] },
    { cropId: "tomatoes", unitLabel: "crate", current: 3500, history: [3410, 3420, 3440, 3460, 3470, 3480, 3500] },
    { cropId: "kales",    unitLabel: "bunch", current: 1400, history: [1410, 1408, 1406, 1404, 1403, 1402, 1400] },
  ],
};

export function getMarketPrices(county: string): PriceRow[] {
  return base[county] ?? base.default;
}

export function trendOf(history: number[]): { dir: "up" | "down" | "flat"; pct: number } {
  if (history.length < 2) return { dir: "flat", pct: 0 };
  const first = history[0]; const last = history[history.length - 1];
  const pct = ((last - first) / first) * 100;
  if (Math.abs(pct) < 0.2) return { dir: "flat", pct: 0 };
  return { dir: pct > 0 ? "up" : "down", pct: Math.abs(pct) };
}
