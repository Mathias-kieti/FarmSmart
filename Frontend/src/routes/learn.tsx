import { PageShell } from "@/components/agri/PageShell";
import { apiFetch } from "@/lib/api";
import type { LearningResource } from "@/types/api";
import { BookOpen, Droplet, ShieldCheck, Sprout } from "lucide-react";
import { useEffect, useState } from "react";

const ICONS = {
  crops: Sprout,
  water: Droplet,
  pests: ShieldCheck,
  markets: BookOpen,
} as const;

export default function Learn() {
  const [items, setItems] = useState<LearningResource[]>([
    { id: "local-1", category: "crops", title: "Choosing the right seed variety", summary: "Match seeds to soil type, altitude, and rainfall pattern." },
    { id: "local-2", category: "water", title: "Smart irrigation in dry seasons", summary: "Stretch every drop with drip lines and mulching." },
    { id: "local-3", category: "pests", title: "Pest and disease management", summary: "Spot blight, aphids, and fall armyworm early." },
    { id: "local-4", category: "markets", title: "Reading the market", summary: "How to time your harvest for the best price." },
  ]);

  useEffect(() => {
    let cancelled = false;

    apiFetch<LearningResource[]>("/learn")
      .then((resources) => {
        if (!cancelled) setItems(resources);
      })
      .catch(() => {});

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <PageShell>
      <h1 className="text-2xl sm:text-3xl font-bold mb-1">Learn & Resources</h1>
      <p className="text-sm text-muted-foreground mb-6">Free guides curated for Kenyan smallholder farmers.</p>
      <div className="grid sm:grid-cols-2 gap-4">
        {items.map((item) => {
          const Icon = ICONS[item.category];
          return (
          <div key={item.id} className="rounded-2xl bg-card border border-border p-5 flex gap-4">
            <div className="h-10 w-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <Icon className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-bold mb-1">{item.title}</h3>
              <p className="text-sm text-muted-foreground">{item.summary}</p>
            </div>
          </div>
          );
        })}
      </div>
    </PageShell>
  );
}

