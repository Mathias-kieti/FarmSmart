import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";

import { useUserStore } from "@/stores/userStore";

interface AuthGuardProps {
  children: ReactNode;
}

export default function AuthGuard({ children }: AuthGuardProps) {
  const { isAuthenticated, loading } = useUserStore();
  const location = useLocation();

  // Firebase needs a moment to restore the session after a page refresh.
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-sm text-muted-foreground">
        Checking your session...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <>{children}</>;
}
