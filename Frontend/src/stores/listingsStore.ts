import { create } from "zustand";
import type { CropId } from "@/data/crops";
import { apiFetch, withQuery } from "@/lib/api";

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
  updatedAt?: number;
}

interface ListingsState {
  listings: Listing[];
  loading: boolean;
  error: string | null;
  fetchListings: (filters?: {
    county?: string;
    status?: Listing["status"];
    mine?: boolean;
  }) => Promise<void>;
  add: (l: Omit<Listing, "id" | "createdAt" | "updatedAt" | "status" | "sellerName" | "userId">) => Promise<void>;
  markSold: (id: string) => Promise<void>;
  remove: (id: string) => Promise<void>;
}

const messageOf = (error: unknown) =>
  error instanceof Error ? error.message : "Could not load listings";

export const useListingsStore = create<ListingsState>()((set) => ({
  listings: [],
  loading: false,
  error: null,

  fetchListings: async (filters = {}) => {
    set({ loading: true, error: null });
    try {
      const listings = await apiFetch<Listing[]>(
        withQuery("/listings", {
          county: filters.county,
          status: filters.status,
          mine: filters.mine,
        }),
      );
      set({ listings, loading: false });
    } catch (error) {
      set({ error: messageOf(error), loading: false });
    }
  },

  add: async (listing) => {
    const created = await apiFetch<Listing>("/listings", {
      method: "POST",
      body: JSON.stringify(listing),
    });
    set((state) => ({ listings: [created, ...state.listings] }));
  },

  markSold: async (id) => {
    const updated = await apiFetch<Listing>(`/listings/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status: "Sold" }),
    });
    set((state) => ({
      listings: state.listings.map((listing) =>
        listing.id === id ? updated : listing,
      ),
    }));
  },

  remove: async (id) => {
    await apiFetch<void>(`/listings/${id}`, { method: "DELETE" });
    set((state) => ({
      listings: state.listings.filter((listing) => listing.id !== id),
    }));
  },
}));
