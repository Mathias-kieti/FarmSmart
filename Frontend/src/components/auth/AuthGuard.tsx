import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useUserStore } from "@/stores/userStore";

export default function AuthGuard() {
  const { isAuthenticated, authReady, loading } = useUserStore();
  const location = useLocation();

  if (!authReady || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-sm text-muted-foreground">
        Loading...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
}