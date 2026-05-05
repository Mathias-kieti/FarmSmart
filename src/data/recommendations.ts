import type { CropId } from "./crops";

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

const COMMON: Recommendation[] = [
  { cropId: "maize", matchScore: 78, estProfitKes: 22000, demand: "Medium", risk: "Low", plantingWindow: "Mar 15 - Apr 30", reasoning: "Staple crop with steady local demand. Reliable rainfall window." },
  { cropId: "beans", matchScore: 74, estProfitKes: 28000, demand: "High", risk: "Low", plantingWindow: "Mar 20 - May 10", reasoning: "Strong dry-season demand. Fixes nitrogen, good for rotation." },
];

export const RECOMMENDATIONS: Record<string, Recommendation[]> = {
  Nyeri: [
    { cropId: "tomatoes", matchScore: 92, estProfitKes: 35000, demand: "High", risk: "Low", plantingWindow: "Apr 10 - Apr 20", reasoning: "High demand expected in Nairobi and surrounding markets in the next 6 weeks. Cool nights favour fruit set." },
    { cropId: "potatoes", matchScore: 84, estProfitKes: 30000, demand: "High", risk: "Medium", plantingWindow: "Apr 5 - May 5", reasoning: "Highland soils are ideal. Watch for late blight in long rains." },
    ...COMMON,
  ],
  Nakuru: [
    { cropId: "potatoes", matchScore: 90, estProfitKes: 33000, demand: "High", risk: "Low", plantingWindow: "Apr 1 - May 1", reasoning: "Volcanic soils + cool climate make Nakuru a top potato basket. Strong demand from Nairobi traders." },
    { cropId: "kales", matchScore: 81, estProfitKes: 18000, demand: "High", risk: "Low", plantingWindow: "Year round", reasoning: "Quick 6-week cycle. Daily cash flow from urban markets." },
    ...COMMON,
  ],
  Kiambu: [
    { cropId: "kales", matchScore: 89, estProfitKes: 20000, demand: "High", risk: "Low", plantingWindow: "Year round", reasoning: "Direct access to Nairobi market. Fast turnover crop." },
    { cropId: "tomatoes", matchScore: 82, estProfitKes: 32000, demand: "High", risk: "Medium", plantingWindow: "Mar 15 - Apr 25", reasoning: "Greenhouse-friendly. Premium prices in Nairobi." },
    ...COMMON,
  ],
  Meru: [
    { cropId: "tomatoes", matchScore: 88, estProfitKes: 34000, demand: "High", risk: "Medium", plantingWindow: "Apr 1 - Apr 25", reasoning: "Meru tomatoes command premium pricing in upcountry markets." },
    { cropId: "potatoes", matchScore: 80, estProfitKes: 27000, demand: "Medium", risk: "Low", plantingWindow: "Mar 20 - May 5", reasoning: "Reliable highland yields." },
    ...COMMON,
  ],
  "Murang'a": [
    { cropId: "beans", matchScore: 87, estProfitKes: 30000, demand: "High", risk: "Low", plantingWindow: "Mar 25 - May 5", reasoning: "Strong demand from neighbouring counties. Reliable bimodal rains." },
    { cropId: "tomatoes", matchScore: 79, estProfitKes: 28000, demand: "Medium", risk: "Medium", plantingWindow: "Apr 1 - Apr 30", reasoning: "Mid-altitude favours fruit quality." },
    ...COMMON,
  ],
  Machakos: [
    { cropId: "kales", matchScore: 85, estProfitKes: 17000, demand: "High", risk: "Low", plantingWindow: "Year round", reasoning: "Drought-tolerant variety performs well. Daily cash flow." },
    { cropId: "beans", matchScore: 80, estProfitKes: 26000, demand: "High", risk: "Medium", plantingWindow: "Mar 25 - Apr 25", reasoning: "Short-season variety fits rainfall pattern." },
    ...COMMON,
  ],
};

export function getRecommendations(county: string): Recommendation[] {
  return RECOMMENDATIONS[county] ?? COMMON;
}
