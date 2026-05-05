import { ArrowDown, ArrowUp, Minus } from "lucide-react";
import { trendOf } from "@/data/marketPrices";

export function TrendBadge({ history }: { history: number[] }) {
  const t = trendOf(history);
  if (t.dir === "flat") {
    return <span className="inline-flex items-center gap-1 text-muted-foreground text-sm font-medium"><Minus className="h-3.5 w-3.5" />0%</span>;
  }
  if (t.dir === "up") {
    return <span className="inline-flex items-center gap-1 text-success text-sm font-semibold"><ArrowUp className="h-3.5 w-3.5" />{t.pct.toFixed(1)}%</span>;
  }
  return <span className="inline-flex items-center gap-1 text-destructive text-sm font-semibold"><ArrowDown className="h-3.5 w-3.5" />{t.pct.toFixed(1)}%</span>;
}
