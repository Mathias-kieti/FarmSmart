import { PageShell } from "@/components/agri/PageShell";
import { BookOpen, Droplet, ShieldCheck, Sprout } from "lucide-react";

export default function Learn() {
  const items = [
    { I: Sprout, t: "Choosing the right seed variety", s: "Match seeds to soil type, altitude, and rainfall pattern." },
    { I: Droplet, t: "Smart irrigation in dry seasons", s: "Stretch every drop with drip lines and mulching." },
    { I: ShieldCheck, t: "Pest & disease management", s: "Spot blight, aphids, and fall armyworm early." },
    { I: BookOpen, t: "Reading the market", s: "How to time your harvest for the best price." },
  ];
  return (
    <PageShell>
      <h1 className="text-2xl sm:text-3xl font-bold mb-1">Learn & Resources</h1>
      <p className="text-sm text-muted-foreground mb-6">Free guides curated for Kenyan smallholder farmers.</p>
      <div className="grid sm:grid-cols-2 gap-4">
        {items.map(({ I, t, s }) => (
          <div key={t} className="rounded-2xl bg-card border border-border p-5 flex gap-4">
            <div className="h-10 w-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <I className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-bold mb-1">{t}</h3>
              <p className="text-sm text-muted-foreground">{s}</p>
            </div>
          </div>
        ))}
      </div>
    </PageShell>
  );
}

