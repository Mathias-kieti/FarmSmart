import { Link } from "react-router-dom";
import { PageShell } from "@/components/agri/PageShell";
import { useUserStore } from "@/stores/userStore";
import { useLocationStore } from "@/stores/locationStore";
import { getRecommendations } from "@/data/recommendations";
import { getMarketPrices } from "@/data/marketPrices";
import { useListingsStore } from "@/stores/listingsStore";
import { CROPS } from "@/data/crops";
import tomatoesHero from "@/assets/crop-tomatoes.jpg";
import { TrendBadge } from "@/components/agri/TrendBadge";
import { ListingCard } from "@/components/agri/ListingCard";
import { useState } from "react";
import {
  ArrowRight,
  BarChart3,
  Calendar,
  CalendarDays,
  Cloud,
  CloudRain,
  Headphones,
  Lightbulb,
  ShieldCheck,
  ShoppingCart,
  Sprout,
  Sun,
  TrendingUp,
  Users,
  Wheat,
  Carrot,
  Apple,
  Leaf,
  Plus,
  TrendingDown,
  Check,
} from "lucide-react";

const TILE_COLORS = {
  cream: "bg-tile-cream",
  sky: "bg-tile-sky",
  peach: "bg-tile-peach",
  lavender: "bg-tile-lavender",
} as const;

function QuickAction({
  to,
  label,
  sub,
  icon: Icon,
  color,
}: {
  to: string;
  label: string;
  sub: string;
  icon: any;
  color: keyof typeof TILE_COLORS;
}) {
  return (
    <Link
      to={to}
      className={`${TILE_COLORS[color]} rounded-2xl p-4 flex flex-col gap-3 hover:scale-[1.02] transition-transform`}
    >
      <Icon className="h-6 w-6 text-foreground/80" />
      <div>
        <p className="font-bold text-sm">{label}</p>
        <p className="text-[11px] text-foreground/70 mt-0.5">{sub}</p>
      </div>
      <ArrowRight className="h-4 w-4 self-end text-foreground/60" />
    </Link>
  );
}

export default function Dashboard() {
  const { user } = useUserStore();
  const county = useLocationStore((s) => s.county);
  const recs = getRecommendations(county);
  const top = recs[0];
  const alts = recs.slice(1, 4);
  const prices = getMarketPrices(county);
  const listings = useListingsStore((s) => s.listings).slice(0, 8);
  const [activeGroupTab, setActiveGroupTab] = useState<"active" | "mine" | "insights">("active");

  const heroImg =
    CROPS[top.cropId].hero ?? CROPS[top.cropId].image ?? tomatoesHero;

  // Mock group data
  const activeGroups = [
    { id: 1, name: "Maize Bulk Sale", crop: "Maize", farmers: 5, target: 1200, collected: 600, priceBoost: 15, status: "collecting" },
    { id: 2, name: "Tomato Collective", crop: "Tomatoes", farmers: 8, target: 800, collected: 620, priceBoost: 18, status: "collecting" },
    { id: 3, name: "Bean Alliance", crop: "Beans", farmers: 3, target: 500, collected: 500, priceBoost: 12, status: "ready" },
  ];

  const myGroups = [
    { id: 101, name: "Potato Producers Network", crop: "Potatoes", farmers: 6, target: 1500, collected: 900, priceBoost: 20, role: "Admin" },
  ];

  const groupInsights = [
    { name: "Maize Bulk Sale", members: 5, avgProfit: "KES +2,400", trend: "up" },
    { name: "Tomato Collective", members: 8, avgProfit: "KES +3,100", trend: "up" },
    { name: "Bean Alliance", members: 3, avgProfit: "KES +1,800", trend: "down" }
  ];

  return (
    <PageShell>
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold">
          Maximize Your Farm Profits Today
        </h1>
        <p className="text-sm text-muted-foreground mt-2">
          AI-driven decisions for your farm in {county}.
        </p>
      </div>

      {/* Main Decision Card */}
      <section className="relative rounded-3xl overflow-hidden border border-border bg-gradient-to-br from-card to-muted/20 mb-8 shadow-lg">
        <div className="grid md:grid-cols-2 min-h-[300px]">
          <div className="p-6 sm:p-8 flex flex-col gap-6">
            <div className="flex items-center gap-2 text-success font-semibold text-sm">
              <Sprout className="h-5 w-5" /> Profit Opportunity for {county}
            </div>
            <div>
              <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
                Plant {CROPS[top.cropId].name}
              </h2>
              <p className="mt-3 text-base text-muted-foreground flex items-center gap-2">
                <Calendar className="h-5 w-5" /> Best time: {top.plantingWindow}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-xl bg-green-50 border border-green-200 p-4">
                <p className="text-xs text-green-700 font-medium">Expected Profit</p>
                <p className="font-bold text-green-800 text-xl leading-tight mt-1">
                  KES {top.estProfitKes.toLocaleString()}
                  <span className="text-sm font-normal text-green-600"> /acre</span>
                </p>
              </div>
              <div className={`rounded-xl p-4 border ${top.risk === 'High' ? 'bg-red-50 border-red-200' : top.risk === 'Medium' ? 'bg-yellow-50 border-yellow-200' : 'bg-green-50 border-green-200'}`}>
                <p className={`text-xs font-medium ${top.risk === 'High' ? 'text-red-700' : top.risk === 'Medium' ? 'text-yellow-700' : 'text-green-700'}`}>Risk Level</p>
                <p className={`font-bold text-xl leading-tight mt-1 ${top.risk === 'High' ? 'text-red-800' : top.risk === 'Medium' ? 'text-yellow-800' : 'text-green-800'}`}>
                  {top.risk}
                </p>
              </div>
            </div>
            <div className="rounded-xl bg-blue-50 border border-blue-200 p-4">
              <p className="text-xs text-blue-700 font-medium">Confidence Score</p>
              <p className="font-bold text-blue-800 text-xl leading-tight mt-1">
                {top.matchScore}%
              </p>
            </div>
            <p className="text-base text-foreground/90 leading-relaxed">
              <span className="font-semibold">Why now?</span> {top.reasoning}
            </p>
            <Link
              to="/crop-advisor"
              className="inline-flex w-fit items-center gap-2 rounded-full bg-primary text-primary-foreground px-6 py-3 font-semibold text-base hover:opacity-90 transition-opacity"
            >
              View Full Plan <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
          <div className="relative min-h-[300px] md:min-h-full">
            <img
              src={heroImg}
              alt={`${CROPS[top.cropId].name} field`}
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute top-4 right-4 px-4 py-2 rounded-full bg-foreground/90 text-background text-sm font-bold">
              {top.matchScore}% Match
            </div>
          </div>
        </div>
      </section>

      {/* Quick Decisions */}
      <section className="mb-8">
        <h3 className="text-xl font-bold mb-4">Quick Decisions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <QuickAction
            to="/crop-advisor"
            label="Plant Now"
            sub="Get profit-maximizing crop plans"
            icon={Sprout}
            color="cream"
          />
          <QuickAction
            to="/markets"
            label="Sell Timing"
            sub="When to sell for best prices"
            icon={BarChart3}
            color="sky"
          />
          <QuickAction
            to="/sell"
            label="List Produce"
            sub="Turn decisions into sales"
            icon={ShoppingCart}
            color="peach"
          />
          <QuickAction
            to="/groups"
            label="Group Selling"
            sub="Join collectives for better prices"
            icon={Users}
            color="lavender"
          />
        </div>
      </section>

      {/* Market Decision Insights */}
      <section className="grid lg:grid-cols-5 gap-6 mb-8">
        <div className="lg:col-span-3 rounded-2xl bg-card border border-border p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold">Market Decision Insights</h3>
            <Link
              to="/markets"
              className="text-sm font-semibold text-success hover:underline"
            >
              View All
            </Link>
          </div>
          <div className="grid grid-cols-[1fr_auto_auto_auto_auto] gap-x-4 gap-y-2 text-xs text-muted-foreground border-b border-border pb-3 mb-3">
            <span>Crop</span>
            <span className="text-center">Action</span>
            <span className="text-right">Profit Est</span>
            <span className="text-center">Risk</span>
            <span className="text-center">Confidence</span>
          </div>
          <div className="space-y-3">
            {prices.map((p) => {
              const c = CROPS[p.cropId];
              const isRising = p.history[p.history.length - 1] > p.history[0];
              const action = isRising ? "Sell" : "Plant";
              const profitEst = Math.round(p.current * 1.2); // Mock profit est
              const risk = p.cropId === 'tomatoes' ? 'Low' : p.cropId === 'beans' ? 'Medium' : 'High'; // Mock
              const confidence = 85; // Mock
              const Icon = c.id === 'maize' ? Wheat : c.id === 'tomatoes' ? Apple : c.id === 'potatoes' ? Carrot : Leaf;
              return (
                <div
                  key={p.cropId}
                  className="grid grid-cols-[1fr_auto_auto_auto_auto] gap-x-4 items-center py-3 rounded-lg bg-muted/20 px-3"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <Icon className="h-6 w-6 text-foreground/80" />
                    <div>
                      <span className="font-medium">{c.name}</span>
                      <span className="text-xs text-muted-foreground block">({p.unitLabel})</span>
                    </div>
                  </div>
                  <span className={`text-center font-semibold px-2 py-1 rounded-full text-xs ${action === 'Sell' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
                    {action}
                  </span>
                  <span className="font-bold text-green-700 text-right tabular-nums">
                    KES {profitEst.toLocaleString()}
                  </span>
                  <span className={`text-center font-semibold px-2 py-1 rounded-full text-xs ${risk === 'High' ? 'bg-red-100 text-red-800' : risk === 'Medium' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>
                    {risk}
                  </span>
                  <span className="text-center font-semibold text-blue-700">
                    {confidence}%
                  </span>
                </div>
              );
            })}
          </div>
        </div>
        <div className="lg:col-span-2">
          {/* Groups Management Tabs */}
          <div className="rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-100 border border-blue-200 p-0 overflow-hidden flex flex-col">
            <div className="flex border-b border-blue-200 bg-white/50 backdrop-blur-sm">
              <button
                onClick={() => setActiveGroupTab("active")}
                className={`flex-1 px-4 py-3 font-semibold text-sm flex items-center justify-center gap-2 transition-all ${
                  activeGroupTab === "active"
                    ? "bg-blue-600 text-white border-b-2 border-blue-600"
                    : "text-blue-700 hover:bg-blue-50"
                }`}
              >
                <Users className="h-4 w-4" /> Active
              </button>
              <button
                onClick={() => setActiveGroupTab("mine")}
                className={`flex-1 px-4 py-3 font-semibold text-sm flex items-center justify-center gap-2 transition-all ${
                  activeGroupTab === "mine"
                    ? "bg-blue-600 text-white border-b-2 border-blue-600"
                    : "text-blue-700 hover:bg-blue-50"
                }`}
              >
                <Check className="h-4 w-4" /> Mine
              </button>
              <button
                onClick={() => setActiveGroupTab("insights")}
                className={`flex-1 px-4 py-3 font-semibold text-sm flex items-center justify-center gap-2 transition-all ${
                  activeGroupTab === "insights"
                    ? "bg-blue-600 text-white border-b-2 border-blue-600"
                    : "text-blue-700 hover:bg-blue-50"
                }`}
              >
                <BarChart3 className="h-4 w-4" /> Performance
              </button>
            </div>

            <div className="p-6 space-y-3 flex-1">
              {activeGroupTab === "active" && (
                <div className="space-y-3">
                  {activeGroups.slice(0, 2).map((group) => (
                    <div key={group.id} className="rounded-lg bg-white border border-blue-200 p-3 shadow-sm hover:shadow-md transition">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h4 className="font-bold text-sm text-blue-900">{group.name}</h4>
                          <p className="text-xs text-gray-600">{group.farmers} farmers</p>
                        </div>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${group.status === 'ready' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
                          {group.status === 'ready' ? '✓ Ready' : 'Collecting'}
                        </span>
                      </div>
                      <div className="w-full bg-blue-200 rounded-full h-1.5 mb-2">
                        <div className="bg-blue-600 h-1.5 rounded-full" style={{ width: `${(group.collected / group.target) * 100}%` }}></div>
                      </div>
                      <p className="text-xs text-gray-600">{group.collected}/{group.target}kg • <span className="font-semibold text-green-700">+{group.priceBoost}%</span></p>
                    </div>
                  ))}
                  <Link
                    to="/groups"
                    className="w-full block text-center bg-blue-600 text-white py-2 rounded-lg font-semibold text-sm hover:bg-blue-700 transition"
                  >
                    View All {activeGroups.length}+ Groups →
                  </Link>
                </div>
              )}

              {activeGroupTab === "mine" && (
                <div className="space-y-3">
                  {myGroups.map((group) => (
                    <div key={group.id} className="rounded-lg bg-white border border-green-200 p-3 shadow-sm">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h4 className="font-bold text-sm text-green-900">{group.name}</h4>
                          <p className="text-xs text-gray-600">{group.farmers} farmers • {group.role}</p>
                        </div>
                      </div>
                      <div className="w-full bg-green-200 rounded-full h-1.5 mb-2">
                        <div className="bg-green-600 h-1.5 rounded-full" style={{ width: `${(group.collected / group.target) * 100}%` }}></div>
                      </div>
                      <p className="text-xs text-gray-600">{group.collected}/{group.target}kg • <span className="font-semibold text-green-700">+{group.priceBoost}%</span></p>
                    </div>
                  ))}
                  {myGroups.length === 0 && (
                    <div className="text-center py-4">
                      <p className="text-sm text-blue-700 font-semibold mb-2">No groups yet</p>
                      <Link to="/groups" className="text-blue-600 font-semibold hover:underline text-sm">
                        Browse & Join Groups
                      </Link>
                    </div>
                  )}
                </div>
              )}

              {activeGroupTab === "insights" && (
                <div className="space-y-2">
                  {groupInsights.map((insight, idx) => (
                    <div key={idx} className="rounded-lg bg-white border border-blue-200 p-3 flex items-center justify-between">
                      <div className="min-w-0">
                        <h4 className="font-semibold text-sm text-blue-900">{insight.name}</h4>
                        <p className="text-xs text-gray-600">{insight.members} members</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-sm text-green-700">{insight.avgProfit}</p>
                        <p className={`text-xs text-green-600`}>
                          <TrendingUp className="h-3 w-3 inline" /> Growing
                        </p>
                      </div>
                    </div>
                  ))}
                  <Link
                    to="/groups"
                    className="w-full block text-center bg-blue-600 text-white py-2 rounded-lg font-semibold text-xs hover:bg-blue-700 transition mt-2"
                  >
                    View Full Performance Dashboard
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Active Selling Opportunities */}
      <section className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold">Active Selling Opportunities</h3>
          <Link
            to="/marketplace"
            className="text-sm font-semibold text-success hover:underline"
          >
            View All Listings
          </Link>
        </div>
        {listings.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border p-8 text-center text-muted-foreground">
            No listings available in your area
          </div>
        ) : (
          <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 sm:-mx-6 lg:-mx-10 px-4 sm:px-6 lg:px-10 snap-x">
            {listings.map((l) => (
              <div key={l.id} className="w-44 sm:w-52 shrink-0 snap-start">
                <ListingCard listing={l} />
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Trust & Benefits */}
      <section className="rounded-2xl bg-card border border-border p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          {
            I: ShieldCheck,
            t: "Trusted Platform",
            s: "Secure transactions with verified buyers",
          },
          {
            I: Lightbulb,
            t: "AI-Powered Insights",
            s: "Data-driven decisions for maximum profits",
          },
          {
            I: Headphones,
            t: "Expert Support",
            s: "Get help from our farming specialists",
          },
        ].map(({ I, t, s }) => (
          <div key={t} className="flex items-start gap-3">
            <div className="h-9 w-9 rounded-lg bg-success/10 flex items-center justify-center shrink-0">
              <I className="h-4 w-4 text-success" />
            </div>
            <div>
              <p className="font-semibold text-sm">{t}</p>
              <p className="text-xs text-muted-foreground leading-snug">{s}</p>
            </div>
          </div>
        ))}
      </section>
    </PageShell>
  );
}
