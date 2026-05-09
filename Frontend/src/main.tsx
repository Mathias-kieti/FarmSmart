import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import "./styles.css";
import { router } from "./router";
import { useUserStore } from "@/stores/userStore";

function App() {
  const authReady = useUserStore((state) => state.authReady);

  //  Wait ONLY for Firebase restore
  if (!authReady) {
    return (
      <div className="min-h-screen flex items-center justify-center text-sm text-muted-foreground">
        Loading...
      </div>
    );
  }

  return <RouterProvider router={router} />;
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
