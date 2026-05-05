import { PageShell } from "@/components/agri/PageShell";
import { CROPS } from "@/data/crops";
import { getRecommendations } from "@/data/recommendations";
import { apiFetch, withQuery } from "@/lib/api";
import { useLocationStore } from "@/stores/locationStore";
import type { FarmPlanStep, Recommendation } from "@/types/api";
import { CalendarDays, Droplet, Scissors, Sprout } from "lucide-react";
import { useEffect, useState } from "react";

const ICONS = {
  sprout: Sprout,
  calendar: CalendarDays,
  water: Droplet,
  harvest: Scissors,
} as const;

const fallbackSteps = (recommendations: Recommendation[]): FarmPlanStep[] => [
  {
    icon: "sprout",
    title: "Land preparation",
    description: "Plough and harrow. Apply 5 t/acre well-decomposed manure.",
    dateLabel: "Now - Apr 8",
  },
  {
    icon: "calendar",
    title: "Planting",
    description: `Plant ${CROPS[recommendations[0].cropId].name} during the recommended window.`,
    dateLabel: recommendations[0].plantingWindow,
  },
  {
    icon: "water",
    title: "Top dressing and irrigation",
    description: "Apply CAN at 6 weeks. Irrigate weekly if rains delay.",
    dateLabel: "Week 6 - 10",
  },
  {
    icon: "harvest",
    title: "Harvest",
    description: "Expected yield window. Coordinate with buyers early.",
    dateLabel: "Week 12 - 16",
  },
];

export default function FarmPlan() {
  const county = useLocationStore((s) => s.county);
  const [recommendations, setRecommendations] = useState<Recommendation[]>(() =>
    getRecommendations(county),
  );
  const [steps, setSteps] = useState<FarmPlanStep[]>(() =>
    fallbackSteps(getRecommendations(county)),
  );

  const top = recommendations[0];
  const crop = CROPS[top.cropId];

  useEffect(() => {
    let cancelled = false;

    Promise.all([
      apiFetch<Recommendation[]>(withQuery("/advisor/recommendations", { county })),
      apiFetch<FarmPlanStep[]>(withQuery("/farm-plan", { county })),
    ])
      .then(([nextRecommendations, nextSteps]) => {
        if (!cancelled) {
          setRecommendations(nextRecommendations);
          setSteps(nextSteps);
        }
      })
      .catch(() => {
        if (!cancelled) {
          const fallback = getRecommendations(county);
          setRecommendations(fallback);
          setSteps(fallbackSteps(fallback));
        }
      });

    return () => {
      cancelled = true;
    };
  }, [county]);

  return (
    <PageShell>
      <h1 className="text-2xl sm:text-3xl font-bold mb-1">My Farm Plan</h1>
      <p className="text-sm text-muted-foreground mb-6">
        Based on AI recommendation:{" "}
        <span className="font-semibold text-foreground">{crop.name}</span> in{" "}
        {county}.
      </p>
      <ol className="relative border-l-2 border-border ml-3 space-y-6">
        {steps.map((step, index) => {
          const Icon = ICONS[step.icon];
          return (
            <li key={`${step.title}-${index}`} className="ml-6">
              <span className="absolute -left-[13px] flex items-center justify-center h-6 w-6 rounded-full bg-primary text-primary-foreground">
                <Icon className="h-3.5 w-3.5" />
              </span>
              <div className="rounded-2xl bg-card border border-border p-4">
                <div className="flex items-baseline justify-between">
                  <h3 className="font-bold">{step.title}</h3>
                  <span className="text-xs text-muted-foreground">{step.dateLabel}</span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">{step.description}</p>
              </div>
            </li>
          );
        })}
      </ol>
    </PageShell>
  );
}
