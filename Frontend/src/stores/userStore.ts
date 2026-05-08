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

import { FirebaseError } from "firebase/app";
import { auth } from "@/lib/firebase";
import { apiFetch } from "@/lib/api";

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
  user: AppUser;
  firebaseUser: FirebaseUser | null;
  isAuthenticated: boolean;
  loading: boolean;
  authReady: boolean;
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
  if (error instanceof FirebaseError) {
    switch (error.code) {
      case "auth/user-not-found":
        return "No account found with this email";
      case "auth/invalid-credential":
        return "Invalid email or password";
      case "auth/invalid-email":
        return "Invalid email address";
      case "auth/too-many-requests":
        return "Too many attempts. Try again later.";
      case "auth/network-request-failed":
        return "Network error. Check your connection.";
      case "auth/email-already-in-use":
        return "Email is already registered";
      default:
        return "Authentication failed. Please try again.";
    }
  }

  if (error instanceof Error) return error.message;
  return "Authentication failed";
};

const buildUserFromFirebase = (
  firebaseUser: FirebaseUser | null,
  previousUser: AppUser,
): AppUser => {
  if (!firebaseUser) return defaultUser;

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
      authReady: false,
      error: null,

      setUser: async (updates) => {
        const nextUser = { ...get().user, ...updates };
        set({ user: nextUser });

        if (auth.currentUser && updates.name) {
          await updateProfile(auth.currentUser, { displayName: updates.name });
        }

        const saved = await apiFetch<AppUser>("/profile/me", {
          method: "PATCH",
          body: JSON.stringify(updates),
        });

        set({ user: saved });
      },

      login: async (email, password) => {
        set({ loading: true, error: null });

        try {
          const result = await signInWithEmailAndPassword(auth, email, password);

          // 🔥 CRITICAL FIX: immediately set auth state
          set({
            user: buildUserFromFirebase(result.user, get().user),
            firebaseUser: result.user,
            isAuthenticated: true,
            loading: false,
            authReady: true,
          });
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

          const profile: AppUser = {
            id: result.user.uid,
            name,
            email,
            phone,
            county,
          };

          set({
            firebaseUser: result.user,
            isAuthenticated: true,
            user: profile,
            loading: false,
            authReady: true,
          });

          const saved = await apiFetch<AppUser>("/profile/me", {
            method: "PATCH",
            body: JSON.stringify(profile),
          });

          set({ user: saved });
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
            authReady: true,
          });
        } catch (error) {
          set({
            error: getErrorMessage(error),
            loading: false,
            isAuthenticated: false,
          });

          throw error;
        }
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: "FarmSmart-user",

      // Firebase persists the auth session; Zustand only keeps app profile data.
      partialize: (state) => ({
        user: state.user,
      }),
    }
  )
);

// Firebase session restore.
onAuthStateChanged(auth, async (firebaseUser) => {
  if (!firebaseUser) {
    useUserStore.setState({
      user: defaultUser,
      firebaseUser: null,
      isAuthenticated: false,
      loading: false,
      authReady: true,
      error: null,
    });
    return;
  }

  useUserStore.setState((state) => ({
    user: buildUserFromFirebase(firebaseUser, state.user),
    firebaseUser,
    isAuthenticated: true,
    loading: false,
    authReady: true,
    error: null,
  }));

  try {
    const profile = await apiFetch<AppUser>("/profile/me");
    useUserStore.setState({ user: profile });
  } catch {
    // ignore backend failure
  }
});
