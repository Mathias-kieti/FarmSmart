import { Phone, MessageCircle } from "lucide-react";
import type { Listing } from "@/stores/listingsStore";
import { CROPS } from "@/data/crops";
import { formatRelativeTime } from "@/lib/relativeTime";

export function ListingCard({ listing }: { listing: Listing }) {
  const crop = CROPS[listing.cropId];
  const waText = encodeURIComponent(`Hi, I'm interested in your ${crop.name} listing on AgriAI (KES ${listing.pricePerUnit.toLocaleString()} / ${listing.unitLabel}).`);
  const waPhone = listing.sellerPhone.replace(/\D/g, "");
  return (
    <article className="rounded-2xl bg-card border border-border overflow-hidden flex flex-col w-full">
      <div className="aspect-square bg-muted overflow-hidden">
        <img src={crop.image} alt={crop.name} loading="lazy" className="w-full h-full object-cover" />
      </div>
      <div className="p-3 flex flex-col gap-1.5 flex-1">
        <div className="flex items-baseline justify-between">
          <h3 className="font-bold">{crop.name}</h3>
          <span className="text-[11px] text-muted-foreground">{formatRelativeTime(listing.createdAt)}</span>
        </div>
        <p className="text-xs text-muted-foreground">{listing.unitLabel}</p>
        <p className="text-xs text-muted-foreground">{listing.county}</p>
        <p className="font-bold text-sm mt-1">KES {listing.pricePerUnit.toLocaleString()} <span className="text-xs font-normal text-muted-foreground">/ {listing.unitLabel.split(" ")[0]}</span></p>
        <span className={`inline-flex w-fit items-center px-2 py-0.5 rounded-full text-[10px] font-semibold ${listing.status === "Active" ? "bg-success/15 text-success" : "bg-muted text-muted-foreground"}`}>
          {listing.status}
        </span>
        <div className="grid grid-cols-2 gap-1.5 mt-2">
          <a href={`tel:${listing.sellerPhone}`} className="inline-flex items-center justify-center gap-1 rounded-md border border-border px-2 py-1.5 text-xs font-medium hover:bg-accent">
            <Phone className="h-3 w-3" /> Call
          </a>
          <a href={`https://wa.me/${waPhone}?text=${waText}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-1 rounded-md bg-success/10 text-success px-2 py-1.5 text-xs font-semibold hover:bg-success/20">
            <MessageCircle className="h-3 w-3" /> WhatsApp
          </a>
        </div>
      </div>
    </article>
  );
}
