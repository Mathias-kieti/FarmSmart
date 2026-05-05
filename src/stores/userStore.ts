import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  type User as FirebaseUser,
} from "firebase/auth";

import { auth } from "@/lib/firebase";

export interface AppUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  county: string;
}

interface SignupInput {
  name: string;
  email: string;
  password: string;
  phone: string;
  county: string;
}

interface UserState {
  // App profile data used by the existing FarmSmart screens.
  user: AppUser;
  // Raw Firebase user. Use this when you need Firebase-specific fields.
  firebaseUser: FirebaseUser | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  setUser: (updates: Partial<Omit<AppUser, "id">>) => Promise<void>;
  signup: (input: SignupInput) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
}

const defaultUser: AppUser = {
  id: "user-0",
  name: "Kieti",
  email: "kietinzioka@.com",
  phone: "+254719688799",
  county: "Nyeri",
};

const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) return error.message;
  return "Authentication failed";
};

const buildUserFromFirebase = (
  firebaseUser: FirebaseUser | null,
  previousUser: AppUser,
): AppUser => {
  // No Firebase session means the app should fall back to its local default profile.
  if (!firebaseUser) {
    return defaultUser;
  }

  // Firebase owns auth fields; the app keeps profile-only fields like phone/county.
  return {
    id: firebaseUser.uid,
    name:
      firebaseUser.displayName ??
      previousUser.name ??
      firebaseUser.email?.split("@")[0] ??
      "Farmer",
    email: firebaseUser.email ?? previousUser.email,
    phone: previousUser.phone,
    county: previousUser.county,
  };
};

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      user: defaultUser,
      firebaseUser: null,
      isAuthenticated: false,
      loading: true,
      error: null,

      setUser: async (updates) => {
        // Update Zustand first so profile changes appear immediately in the UI.
        const nextUser = { ...get().user, ...updates };
        set({ user: nextUser });

        // If the user changed their name, also update Firebase Auth's display name.
        if (auth.currentUser && updates.name) {
          await updateProfile(auth.currentUser, { displayName: updates.name });
        }
      },

      login: async (email, password) => {
        set({ loading: true, error: null });
        try {
          await signInWithEmailAndPassword(auth, email, password);
        } catch (error) {
          set({ error: getErrorMessage(error), loading: false });
          throw error;
        }
      },

      signup: async ({ name, email, password, phone, county }) => {
        set({ loading: true, error: null });
        try {
          const result = await createUserWithEmailAndPassword(auth, email, password);
          await updateProfile(result.user, { displayName: name });

          set({
            firebaseUser: result.user,
            isAuthenticated: true,
            loading: false,
            user: {
              id: result.user.uid,
              name,
              email,
              phone,
              county,
            },
          });
        } catch (error) {
          set({ error: getErrorMessage(error), loading: false });
          throw error;
        }
      },

      logout: async () => {
        set({ loading: true, error: null });
        try {
          await signOut(auth);
          set({
            user: defaultUser,
            firebaseUser: null,
            isAuthenticated: false,
            loading: false,
          });
        } catch (error) {
          set({ error: getErrorMessage(error), loading: false });
          throw error;
        }
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: "FarmSmart-user",
      // Firebase persists the login session itself; Zustand only persists app profile data.
      partialize: (state) => ({
        user: state.user,
      }),
    },
  ),
);

// This listener keeps Zustand synced when Firebase restores, changes, or clears a session.
onAuthStateChanged(auth, (firebaseUser) => {
  useUserStore.setState((state) => ({
    user: buildUserFromFirebase(firebaseUser, state.user),
    firebaseUser,
    isAuthenticated: !!firebaseUser,
    loading: false,
    error: null,
  }));
});
