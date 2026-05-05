import * as React from "react";
import { createBrowserRouter } from "react-router-dom";

import AuthGuard from "@/components/auth/AuthGuard";
import LoginForm from "@/components/auth/loginForm";
import SignupForm from "@/components/auth/signupForm";


import RootLayout, { NotFound } from "@/routes/__root";
import CropAdvisor from "@/routes/crop-advisor";
import Dashboard from "@/routes/index";
import FarmPlan from "@/routes/farm-plan";
import GroupSelling from "@/routes/groups";
import Learn from "@/routes/learn";
import Marketplace from "@/routes/marketplace";
import Markets from "@/routes/markets";
import Orders from "@/routes/orders";
import Profile from "@/routes/profile";
import Sell from "@/routes/sell";

function AuthPage({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen bg-background px-4 py-10 flex items-center justify-center">
      {children}
    </main>
  );
}

export const router = createBrowserRouter([
  {
    path: "/login",
    element: (
      <AuthPage>
        <LoginForm />
      </AuthPage>
    ),
  },
  {
    path: "/signup",
    element: (
      <AuthPage>
        <SignupForm />
      </AuthPage>
    ),
  },
  {
    path: "/",
    element: (
      <AuthGuard>
        <RootLayout />
      </AuthGuard>
    ),
    children: [
      { index: true, element: <Dashboard /> },
      { path: "crop-advisor", element: <CropAdvisor /> },
      { path: "farm-plan", element: <FarmPlan /> },
      { path: "groups", element: <GroupSelling /> },
      { path: "markets", element: <Markets /> },
      { path: "marketplace", element: <Marketplace /> },
      { path: "sell", element: <Sell /> },
      { path: "orders", element: <Orders /> },
      { path: "learn", element: <Learn /> },
      { path: "profile", element: <Profile /> },
      { path: "*", element: <NotFound /> },
    ],
  },
]);
