import { PageShell } from "@/components/agri/PageShell";
import { CROPS } from "@/data/crops";
import { getMarketPrices } from "@/data/marketPrices";
import { TrendBadge } from "@/components/agri/TrendBadge";
import { useLocationStore } from "@/stores/locationStore";

export default function Markets() {
  const county = useLocationStore((s) => s.county);
  const rows = getMarketPrices(county);
  return (
    <PageShell>
      <h1 className="text-2xl sm:text-3xl font-bold mb-1">Market Prices</h1>
      <p className="text-sm text-muted-foreground mb-6">
        Live prices in {county}, Kenya. Trends from last 7 days.
      </p>
      <div className="rounded-2xl bg-card border border-border overflow-hidden">
        <div className="grid grid-cols-[1fr_auto_auto_auto] gap-4 px-4 py-3 text-xs text-muted-foreground border-b border-border bg-muted/30">
          <span>Crop</span>
          <span className="text-right">Price (KES)</span>
          <span className="text-right">7-day</span>
          <span className="text-right">Change</span>
        </div>
        {rows.map((r) => {
          const c = CROPS[r.cropId];
          return (
            <div
              key={r.cropId}
              className="grid grid-cols-[1fr_auto_auto_auto] gap-4 items-center px-4 py-3 border-b border-border last:border-0"
            >
              <div className="flex items-center gap-3 min-w-0">
                <img src={c.image} alt="" className="h-10 w-10 rounded-lg object-cover" loading="lazy" />
                <div className="min-w-0">
                  <p className="font-semibold truncate">{c.name}</p>
                  <p className="text-xs text-muted-foreground">{r.unitLabel}</p>
                </div>
              </div>
              <p className="font-bold tabular-nums text-right">{r.current.toLocaleString()}</p>
              <div className="text-right">
                <Sparkline data={r.history} />
              </div>
              <div className="text-right">
                <TrendBadge history={r.history} />
              </div>
            </div>
          );
        })}
      </div>
    </PageShell>
  );
}

function Sparkline({ data }: { data: number[] }) {
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const w = 80,
    h = 28;
  const points = data
    .map((v, i) => `${(i / (data.length - 1)) * w},${h - ((v - min) / range) * h}`)
    .join(" ");
  const up = data[data.length - 1] >= data[0];
  return (
    <svg width={w} height={h} className="overflow-visible">
      <polyline
        fill="none"
        stroke={up ? "var(--success)" : "var(--destructive)"}
        strokeWidth="1.8"
        points={points}
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  );
}

