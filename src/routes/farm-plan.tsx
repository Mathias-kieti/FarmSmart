import { PageShell } from "@/components/agri/PageShell";
import { CROPS } from "@/data/crops";
import { getRecommendations } from "@/data/recommendations";
import { useLocationStore } from "@/stores/locationStore";
import { CalendarDays, Droplet, Scissors, Sprout } from "lucide-react";

export default function FarmPlan() {
  const county = useLocationStore((s) => s.county);
  const top = getRecommendations(county)[0];
  const c = CROPS[top.cropId];
  const steps = [
    {
      I: Sprout,
      t: "Land preparation",
      d: "Plough and harrow. Apply 5 t/acre well-decomposed manure.",
      date: "Now ’ Apr 8",
    },
    {
      I: CalendarDays,
      t: "Planting",
      d: `Plant ${c.name} during the recommended window.`,
      date: top.plantingWindow,
    },
    {
      I: Droplet,
      t: "Top dressing & irrigation",
      d: "Apply CAN at 6 weeks. Irrigate weekly if rains delay.",
      date: "Week 6 - 10",
    },
    {
      I: Scissors,
      t: "Harvest",
      d: "Expected yield window. Coordinate with buyers early.",
      date: "Week 12 - 16",
    },
  ];
  return (
    <PageShell>
      <h1 className="text-2xl sm:text-3xl font-bold mb-1">My Farm Plan</h1>
      <p className="text-sm text-muted-foreground mb-6">
        Based on AI recommendation:{" "}
        <span className="font-semibold text-foreground">{c.name}</span> in{" "}
        {county}.
      </p>
      <ol className="relative border-l-2 border-border ml-3 space-y-6">
        {steps.map((s, i) => (
          <li key={i} className="ml-6">
            <span className="absolute -left-[13px] flex items-center justify-center h-6 w-6 rounded-full bg-primary text-primary-foreground">
              <s.I className="h-3.5 w-3.5" />
            </span>
            <div className="rounded-2xl bg-card border border-border p-4">
              <div className="flex items-baseline justify-between">
                <h3 className="font-bold">{s.t}</h3>
                <span className="text-xs text-muted-foreground">{s.date}</span>
              </div>
              <p className="text-sm text-muted-foreground mt-1">{s.d}</p>
            </div>
          </li>
        ))}
      </ol>
    </PageShell>
  );
}
