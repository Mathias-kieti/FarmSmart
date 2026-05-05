import { PageShell } from "@/components/agri/PageShell";
import { CROPS } from "@/data/crops";
import { getRecommendations } from "@/data/recommendations";
import { useLocationStore } from "@/stores/locationStore";
import { Calendar, ShieldCheck, Sprout, TrendingUp } from "lucide-react";

export default function CropAdvisor() {
  const county = useLocationStore((s) => s.county);
  const recs = getRecommendations(county);
  if (recs.length === 0) {
    return (
      <PageShell>
        <div className="rounded-2xl border border-dashed border-border p-12 text-center">
          <p className="font-semibold">No recommendations found</p>
        </div>
      </PageShell>
    );
  }
  const [best, ...rest] = recs;
  const bestCrop = CROPS[best.cropId];
  return (
    <PageShell>
      <h1 className="text-2xl sm:text-3xl font-bold mb-1">Crop Advisor</h1>
      <p className="text-sm text-muted-foreground mb-6">Personalized for {county}, Kenya.</p>

      <section className="rounded-3xl overflow-hidden border border-border bg-card mb-6">
        <div className="grid md:grid-cols-2">
          <div className="relative min-h-[220px] order-2 md:order-1">
            <img
              src={bestCrop.hero ?? bestCrop.image}
              alt={bestCrop.name}
              className="absolute inset-0 w-full h-full object-cover"
            />
            <span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-success text-primary-foreground text-xs font-bold">
              BEST PICK Â· {best.matchScore}%
            </span>
          </div>
          <div className="p-6 order-1 md:order-2 flex flex-col gap-3">
            <p className="text-sm text-success font-semibold flex items-center gap-2">
              <Sprout className="h-4 w-4" /> Top recommendation
            </p>
            <h2 className="text-3xl font-extrabold">{bestCrop.name}</h2>
            <div className="grid grid-cols-3 gap-2">
              <Stat label="Profit" value={`KES ${best.estProfitKes.toLocaleString()}`} />
              <Stat label="Demand" value={best.demand} />
              <Stat label="Risk" value={best.risk} />
            </div>
            <p className="text-sm text-muted-foreground flex items-center gap-2">
              <Calendar className="h-4 w-4" /> {best.plantingWindow}
            </p>
            <p className="text-sm leading-relaxed">
              <span className="font-semibold">Why this crop?</span> {best.reasoning}
            </p>
          </div>
        </div>
      </section>

      <h3 className="font-bold mb-3">Alternative crops</h3>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {rest.map((r) => {
          const c = CROPS[r.cropId];
          return (
            <article key={r.cropId} className="rounded-2xl bg-card border border-border overflow-hidden">
              <div className="aspect-[16/10] bg-muted overflow-hidden">
                <img src={c.image} alt={c.name} className="w-full h-full object-cover" loading="lazy" />
              </div>
              <div className="p-4 flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold">{c.name}</h4>
                  <span className="text-xs font-bold text-success">{r.matchScore}%</span>
                </div>
                <div className="flex flex-wrap gap-1.5 text-[11px]">
                  <Pill icon={<TrendingUp className="h-3 w-3" />}>{r.demand} demand</Pill>
                  <Pill icon={<ShieldCheck className="h-3 w-3" />}>{r.risk} risk</Pill>
                  <Pill>KES {r.estProfitKes.toLocaleString()}</Pill>
                </div>
                <p className="text-xs text-muted-foreground">
                  <Calendar className="h-3 w-3 inline mr-1" />
                  {r.plantingWindow}
                </p>
                <p className="text-xs leading-snug">{r.reasoning}</p>
              </div>
            </article>
          );
        })}
      </div>
    </PageShell>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border p-2.5">
      <p className="text-[10px] text-muted-foreground uppercase tracking-wide">{label}</p>
      <p className="font-bold text-sm leading-tight mt-0.5">{value}</p>
    </div>
  );
}

function Pill({ children, icon }: { children: React.ReactNode; icon?: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-muted text-foreground/80 font-medium">
      {icon}
      {children}
    </span>
  );
}

