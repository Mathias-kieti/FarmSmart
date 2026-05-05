import { PageShell } from "@/components/agri/PageShell";
import { ListingCard } from "@/components/agri/ListingCard";
import { useLocationStore } from "@/stores/locationStore";
import { useListingsStore } from "@/stores/listingsStore";
import { useState } from "react";

export default function Marketplace() {
  const listings = useListingsStore((s) => s.listings);
  const county = useLocationStore((s) => s.county);
  const [scope, setScope] = useState<"local" | "all">("local");
  const filtered = (
    scope === "local" ? listings.filter((l) => l.county === county) : listings
  )
    .filter((l) => l.status === "Active")
    .sort((a, b) => b.createdAt - a.createdAt);

  return (
    <PageShell>
      <div className="flex items-end justify-between mb-4 gap-3 flex-wrap">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Marketplace</h1>
          <p className="text-sm text-muted-foreground">
            Fresh produce from verified farmers.
          </p>
        </div>
        <div className="inline-flex rounded-full bg-muted p-1 text-xs">
          <button
            onClick={() => setScope("local")}
            className={`px-3 py-1.5 rounded-full font-semibold ${scope === "local" ? "bg-card shadow-sm" : "text-muted-foreground"}`}
          >
            {county}
          </button>
          <button
            onClick={() => setScope("all")}
            className={`px-3 py-1.5 rounded-full font-semibold ${scope === "all" ? "bg-card shadow-sm" : "text-muted-foreground"}`}
          >
            All Kenya
          </button>
        </div>
      </div>
      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border p-12 text-center">
          <p className="font-semibold">No listings available in your area</p>
          <p className="text-sm text-muted-foreground mt-1">
            Try switching to All Kenya or check back soon.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {filtered.map((l) => (
            <ListingCard key={l.id} listing={l} />
          ))}
        </div>
      )}
    </PageShell>
  );
}
