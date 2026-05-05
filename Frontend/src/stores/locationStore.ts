import { create } from "zustand";
import { persist } from "zustand/middleware";

interface LocationState {
  county: string;
  setCounty: (c: string) => void;
  detecting: boolean;
  detectGps: () => Promise<void>;
}

export const useLocationStore = create<LocationState>()(
  persist(
    (set) => ({
      county: "Nyeri",
      setCounty: (c) => set({ county: c }),
      detecting: false,
      detectGps: async () => {
        if (typeof navigator === "undefined" || !navigator.geolocation) return;
        set({ detecting: true });
        await new Promise<void>((resolve) => {
          navigator.geolocation.getCurrentPosition(
            () => { set({ county: "Nairobi", detecting: false }); resolve(); },
            () => { set({ detecting: false }); resolve(); },
            { timeout: 8000 },
          );
        });
      },
    }),
    { name: "FarmSmart-location" },
  ),
);
