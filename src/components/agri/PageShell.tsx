import { ReactNode } from "react";
import { AppSidebar } from "./Sidebar";
import { BottomNav } from "./BottomNav";
import { TopBar } from "./TopBar";

export function PageShell({ children, hideTopBar }: { children: ReactNode; hideTopBar?: boolean }) {
  return (
    <div className="min-h-screen flex bg-background">
      <AppSidebar />
      <main className="flex-1 min-w-0 px-4 sm:px-6 lg:px-10 py-4 sm:py-6 pb-32 max-w-6xl mx-auto w-full">
        {!hideTopBar && <TopBar />}
        {children}
      </main>
      <BottomNav />
    </div>
  );
}
