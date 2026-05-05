import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CropId } from "@/data/crops";

export interface Listing {
  id: string;
  cropId: CropId;
  unitLabel: string;
  pricePerUnit: number;
  quantity: number;
  county: string;
  sellerName: string;
  sellerPhone: string;
  userId: string;
  status: "Active" | "Sold";
  createdAt: number;
}

const seed = (): Listing[] => {
  const now = Date.now();
  return [
    { id: "l1", cropId: "maize",    unitLabel: "90kg bag", pricePerUnit: 2700, quantity: 12, county: "Nyeri",     sellerName: "Wanjiru F.", sellerPhone: "+254711000111", userId: "seed-1", status: "Active", createdAt: now - 5  * 60 * 1000 },
    { id: "l2", cropId: "beans",    unitLabel: "90kg bag", pricePerUnit: 5600, quantity: 6,  county: "Murang'a",  sellerName: "Joseph K.",  sellerPhone: "+254711000222", userId: "seed-2", status: "Active", createdAt: now - 35 * 60 * 1000 },
    { id: "l3", cropId: "potatoes", unitLabel: "50kg bag", pricePerUnit: 1800, quantity: 30, county: "Nyandarua", sellerName: "Mary N.",    sellerPhone: "+254711000333", userId: "seed-3", status: "Active", createdAt: now - 2  * 60 * 60 * 1000 },
    { id: "l4", cropId: "tomatoes", unitLabel: "crate",    pricePerUnit: 3200, quantity: 18, county: "Nyeri",     sellerName: "Peter M.",   sellerPhone: "+254711000444", userId: "seed-4", status: "Active", createdAt: now - 6  * 60 * 60 * 1000 },
    { id: "l5", cropId: "kales",    unitLabel: "bunch",    pricePerUnit: 1200, quantity: 80, county: "Embu",      sellerName: "Grace W.",   sellerPhone: "+254711000555", userId: "seed-5", status: "Active", createdAt: now - 24 * 60 * 60 * 1000 },
  ];
};

interface ListingsState {
  listings: Listing[];
  add: (l: Omit<Listing, "id" | "createdAt" | "status">) => void;
  markSold: (id: string) => void;
  remove: (id: string) => void;
}

export const useListingsStore = create<ListingsState>()(
  persist(
    (set) => ({
      listings: seed(),
      add: (l) => set((s) => ({
        listings: [{ ...l, id: `l${Date.now()}`, createdAt: Date.now(), status: "Active" }, ...s.listings],
      })),
      markSold: (id) => set((s) => ({ listings: s.listings.map((x) => x.id === id ? { ...x, status: "Sold" } : x) })),
      remove: (id) => set((s) => ({ listings: s.listings.filter((x) => x.id !== id) })),
    }),
    { name: "FarmSmart-listings", version: 1 },
  ),
);
