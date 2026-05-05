import type { CropId } from "@/data/crops";

export interface PriceRow {
  cropId: CropId;
  unitLabel: string;
  current: number;
  history: number[];
}

export type Demand = "High" | "Medium" | "Low";
export type Risk = "Low" | "Medium" | "High";

export interface Recommendation {
  cropId: CropId;
  matchScore: number;
  estProfitKes: number;
  demand: Demand;
  risk: Risk;
  plantingWindow: string;
  reasoning: string;
}

export interface FarmPlanStep {
  title: string;
  description: string;
  dateLabel: string;
  icon: "sprout" | "calendar" | "water" | "harvest";
}

export interface SellingGroup {
  id: string;
  name: string;
  cropId: CropId;
  county: string;
  targetKg: number;
  collectedKg: number;
  priceBoostPct: number;
  status: "collecting" | "ready" | "closed";
  createdBy: string;
  memberIds: string[];
  createdAt: number;
  updatedAt: number;
}

export interface LearningResource {
  id: string;
  title: string;
  summary: string;
  category: "crops" | "water" | "pests" | "markets";
  county?: string | null;
}
