import { Link, useLocation } from "react-router-dom";
import {
  Home,
  Sprout,
  BarChart3,
  ShoppingCart,
  CalendarDays,
  ListOrdered,
  MessageCircle,
  Users,
  Leaf,
} from "lucide-react";
import promo from "@/assets/promo-seedling.jpg";

const items = [
  { to: "/", label: "Dashboard", icon: Home },
  { to: "/crop-advisor", label: "Crop Advisor", icon: Sprout },
  { to: "/markets", label: "Market Prices", icon: BarChart3 },
  { to: "/marketplace", label: "Marketplace", icon: ShoppingCart },
  { to: "/farm-plan", label: "My Farm Plan", icon: CalendarDays },
  { to: "/sell", label: "My Listings", icon: ListOrdered },
  { to: "/orders", label: "Orders", icon: MessageCircle },
  { to: "/groups", label: "Group Selling", icon: Users, badge: "New" },
] as const;

export function AppSidebar() {
  const path = useLocation().pathname;
  return (
    <aside className="hidden lg:flex lg:w-64 xl:w-72 shrink-0 flex-col bg-sidebar text-sidebar-foreground p-5 sticky top-0 h-screen">
      <div className="mb-6">
        <div className="flex items-center gap-2">
          <div className="h-9 w-9 rounded-lg bg-sidebar-primary/20 flex items-center justify-center">
            <Leaf className="h-5 w-5 text-sidebar-primary" />
          </div>
          <div>
            <p className="text-xl font-bold leading-none">
              Farm<span className="text-sidebar-primary">Smart</span>
            </p>
            <p className="text-[11px] text-sidebar-foreground/60 mt-1">
              Grow Smarter. Earn Better.
            </p>
          </div>
        </div>
      </div>
      <nav className="flex flex-col gap-1">
        {items.map((i) => {
          const active = path === i.to;
          const Icon = i.icon;
          return (
            <Link
              key={i.to}
              to={i.to}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                active
                  ? "bg-sidebar-primary/15 text-sidebar-foreground font-semibold border border-sidebar-primary/30"
                  : "text-sidebar-foreground/80 hover:bg-sidebar-accent/40"
              }`}
            >
              <Icon className="h-4 w-4 shrink-0" />
              <span>{i.label}</span>
            </Link>
          );
        })}
      </nav>
      <div className="mt-auto rounded-2xl bg-sidebar-accent/30 p-4 border border-sidebar-border">
        <p className="text-sm font-semibold leading-snug">
          Smart farming starts with smart decisions.
        </p>
        <img
          src={promo}
          alt=""
          className="my-3 rounded-xl w-full h-28 object-cover"
          loading="lazy"
        />
        <Link
          to="/"
          className="inline-flex items-center gap-1 rounded-md bg-sidebar-primary px-3 py-1.5 text-xs font-semibold text-sidebar-primary-foreground hover:opacity-90"
        >
          View in Dashboard →
        </Link>
      </div>
    </aside>
  );
}
