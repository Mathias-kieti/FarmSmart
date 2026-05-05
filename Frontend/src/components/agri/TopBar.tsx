import { Bell } from "lucide-react";
import { LocationPicker } from "./LocationPicker";
import { useUserStore } from "@/stores/userStore";
import { Link } from "react-router-dom";

export function TopBar() {
  const { user } = useUserStore();
  return (
    <header className="flex items-center justify-between gap-3 mb-6">
      <LocationPicker />
      <div className="flex items-center gap-3">
        <button className="relative h-10 w-10 rounded-full bg-card border border-border flex items-center justify-center hover:bg-accent">
          <Bell className="h-4 w-4" />
          <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-destructive text-destructive-foreground text-[10px] font-bold flex items-center justify-center">3</span>
        </button>
        <Link to="/profile" className="flex items-center gap-2 pl-1 pr-3 py-1 rounded-full bg-card border border-border hover:bg-accent">
          <span className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold text-sm">
            {user.name.charAt(0)}
          </span>
          <span className="text-sm font-medium hidden sm:inline">{user.name}</span>
        </Link>
      </div>
    </header>
  );
}
