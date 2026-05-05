import { Link, useLocation } from "react-router-dom";
import { Home, BarChart3, Plus, ShoppingCart, User } from "lucide-react";

type NavItem = {
  to: string;
  label: string;
  icon: typeof Home;
  primary?: boolean;
};
const items: NavItem[] = [
  { to: "/", label: "Home", icon: Home },
  { to: "/markets", label: "Markets", icon: BarChart3 },
  { to: "/sell", label: "Sell", icon: Plus, primary: true },
  { to: "/marketplace", label: "Trade", icon: ShoppingCart },
  { to: "/profile", label: "Profile", icon: User },
];

export function BottomNav() {
  const path = useLocation().pathname;
  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 pb-[calc(env(safe-area-inset-bottom)+16px)]">
      <div className="mx-auto w-full max-w-xl px-4">
        <div className="rounded-[28px] bg-gradient-to-r from-primary/15 via-card/95 to-success/15 dark:from-primary/20 dark:via-card/90 dark:to-success/20 backdrop-blur border border-primary/15 shadow-lg shadow-primary/10">
          <div className="grid grid-cols-5 items-end px-3 pt-2 pb-2">
            {items.map((i) => {
              const active = path === i.to;
              const Icon = i.icon;

              if (i.primary) {
                return (
                  <Link
                    key={i.to}
                    to={i.to}
                    className="flex flex-col items-center justify-end -mt-8"
                  >
                    <span className="h-14 w-14 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-xl shadow-primary/30 ring-8 ring-background">
                      <Icon className="h-7 w-7" />
                    </span>
                    <span
                      className={`text-[10px] mt-1 font-medium ${active ? "text-primary" : "text-muted-foreground"}`}
                    >
                      {i.label}
                    </span>
                  </Link>
                );
              }

              return (
                <Link
                  key={i.to}
                  to={i.to}
                  className={`flex flex-col items-center gap-1 py-2 ${active ? "text-primary" : "text-muted-foreground"}`}
                >
                  <Icon className="h-5 w-5" />
                  <span className="text-[10px] font-medium">{i.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}
