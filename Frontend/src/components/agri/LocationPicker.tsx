import { MapPin, Crosshair, Loader2 } from "lucide-react";
import { useLocationStore } from "@/stores/locationStore";
import { COUNTIES } from "@/data/counties";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export function LocationPicker() {
  const { county, setCounty, detectGps, detecting } = useLocationStore();
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const filtered = COUNTIES.filter((c) => c.toLowerCase().includes(q.toLowerCase()));

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button className="flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm font-medium shadow-sm hover:bg-accent transition-colors">
          <MapPin className="h-4 w-4 text-primary" />
          <span>{county}, Kenya</span>
          <svg width="10" height="6" viewBox="0 0 10 6" className="text-muted-foreground"><path d="M1 1l4 4 4-4" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round"/></svg>
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-72 p-3" align="start">
        <Button variant="outline" size="sm" className="w-full justify-start mb-2" onClick={() => detectGps()} disabled={detecting}>
          {detecting ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Crosshair className="h-4 w-4 mr-2 text-primary" />}
          Use my current location
        </Button>
        <input
          autoFocus
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search county…"
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
        />
        <div className="mt-2 max-h-60 overflow-auto">
          {filtered.map((c) => (
            <button
              key={c}
              onClick={() => { setCounty(c); setOpen(false); }}
              className={`w-full text-left px-3 py-2 rounded-md text-sm hover:bg-accent ${c === county ? "bg-accent font-semibold" : ""}`}
            >{c}</button>
          ))}
          {filtered.length === 0 && <p className="text-sm text-muted-foreground p-3">No matches.</p>}
        </div>
      </PopoverContent>
    </Popover>
  );
}
