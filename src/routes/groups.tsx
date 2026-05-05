import { PageShell } from "@/components/agri/PageShell";
import { useState, useMemo } from "react";
import {
  Users,
  Search,
  Filter,
  TrendingUp,
  Check,
  Clock,
  BarChart3,
  Plus,
  ChevronDown,
} from "lucide-react";
import { CROPS } from "@/data/crops";

export default function GroupSelling() {
  const [activeTab, setActiveTab] = useState<"active" | "mine" | "insights">(
    "active"
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [cropFilter, setCropFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"boost" | "members" | "progress">(
    "boost"
  );

  // Mock data for 100+ groups
  const allGroups = [
    {
      id: 1,
      name: "Maize Bulk Sale",
      crop: "maize",
      farmers: 5,
      target: 1200,
      collected: 600,
      priceBoost: 15,
      status: "collecting",
      createdBy: "John Kamau",
      region: "Nyeri",
    },
    {
      id: 2,
      name: "Tomato Collective",
      crop: "tomatoes",
      farmers: 8,
      target: 800,
      collected: 620,
      priceBoost: 18,
      status: "collecting",
      createdBy: "Mary Njeri",
      region: "Kiambu",
    },
    {
      id: 3,
      name: "Bean Alliance",
      crop: "beans",
      farmers: 3,
      target: 500,
      collected: 500,
      priceBoost: 12,
      status: "ready",
      createdBy: "Peter Mwangi",
      region: "Muranga",
    },
    {
      id: 4,
      name: "Kale Network",
      crop: "kales",
      farmers: 12,
      target: 600,
      collected: 450,
      priceBoost: 10,
      status: "collecting",
      createdBy: "Grace Wanjiru",
      region: "Embu",
    },
    {
      id: 5,
      name: "Potato Producers Network",
      crop: "potatoes",
      farmers: 6,
      target: 1500,
      collected: 900,
      priceBoost: 20,
      status: "collecting",
      createdBy: "David Kipchoge",
      region: "Nyandarua",
    },
    {
      id: 6,
      name: "Premium Maize Collective",
      crop: "maize",
      farmers: 9,
      target: 2000,
      collected: 1800,
      priceBoost: 16,
      status: "ready",
      createdBy: "Samuel Kiplagat",
      region: "Nakuru",
    },
    {
      id: 7,
      name: "Tomato Premium Grade",
      crop: "tomatoes",
      farmers: 7,
      target: 900,
      collected: 300,
      priceBoost: 22,
      status: "collecting",
      createdBy: "Elizabeth Kariuki",
      region: "Kajiado",
    },
    {
      id: 8,
      name: "Bean Farmers Co-op",
      crop: "beans",
      farmers: 4,
      target: 400,
      collected: 200,
      priceBoost: 14,
      status: "collecting",
      createdBy: "James Njoroge",
      region: "Nyeri",
    },
  ];

  const myGroups = [
    {
      id: 101,
      name: "Potato Producers Network",
      crop: "potatoes",
      farmers: 6,
      target: 1500,
      collected: 900,
      priceBoost: 20,
      status: "collecting",
      createdBy: "Kieti",
      region: "Nyandarua",
      role: "Admin",
    },
  ];

  const groupInsights = [
    {
      name: "Premium Maize Collective",
      members: 9,
      avgProfit: "KES +2,700",
      trend: "up",
    },
    {
      name: "Tomato Premium Grade",
      members: 7,
      avgProfit: "KES +3,400",
      trend: "up",
    },
    {
      name: "Potato Producers Network",
      members: 6,
      avgProfit: "KES +2,900",
      trend: "up",
    },
  ];

  // Filtered groups
  const filteredGroups = useMemo(() => {
    let result = allGroups;

    if (searchTerm) {
      result = result.filter(
        (g) =>
          g.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          g.region.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (cropFilter !== "all") {
      result = result.filter((g) => g.crop === cropFilter);
    }

    if (statusFilter !== "all") {
      result = result.filter((g) => g.status === statusFilter);
    }

    // Sort
    if (sortBy === "boost") {
      result.sort((a, b) => b.priceBoost - a.priceBoost);
    } else if (sortBy === "members") {
      result.sort((a, b) => b.farmers - a.farmers);
    } else if (sortBy === "progress") {
      result.sort((a, b) => (b.collected / b.target) - (a.collected / a.target));
    }

    return result;
  }, [searchTerm, cropFilter, statusFilter, sortBy]);

  const GroupCard = ({
    group,
    isOwned = false,
  }: {
    group: (typeof allGroups)[0];
    isOwned?: boolean;
  }) => (
    <div
      className={`rounded-xl border p-4 shadow-sm hover:shadow-md transition ${
        isOwned
          ? "bg-white border-green-200"
          : "bg-white border-blue-200"
      }`}
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <h4 className="font-bold text-foreground">{group.name}</h4>
          <p className="text-xs text-muted-foreground">
            {group.farmers} farmers • {group.region}
          </p>
        </div>
        <span
          className={`px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ${
            group.status === "ready"
              ? "bg-green-100 text-green-800"
              : "bg-blue-100 text-blue-800"
          }`}
        >
          {group.status === "ready" ? (
            <>
              <Check className="h-3 w-3" /> Ready
            </>
          ) : (
            <>
              <Clock className="h-3 w-3" /> Collecting
            </>
          )}
        </span>
      </div>

      <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
        <div
          className={`h-2 rounded-full transition-all ${
            isOwned ? "bg-green-600" : "bg-blue-600"
          }`}
          style={{ width: `${(group.collected / group.target) * 100}%` }}
        ></div>
      </div>

      <p className="text-xs text-muted-foreground mb-3">
        {group.collected}/{group.target}kg collected •{" "}
        <span
          className={`font-semibold ${
            isOwned ? "text-green-700" : "text-blue-700"
          }`}
        >
          +{group.priceBoost}% profit
        </span>
      </p>

      <button
        className={`w-full py-2 rounded-lg font-semibold text-sm transition ${
          isOwned
            ? "bg-green-600 text-white hover:bg-green-700"
            : "bg-blue-600 text-white hover:bg-blue-700"
        }`}
      >
        {isOwned ? "Manage Group" : "Join Group"}
      </button>
    </div>
  );

  return (
    <PageShell>
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold">Group Selling Hub</h1>
        <p className="text-sm text-muted-foreground mt-2">
          Join collectives and boost your profits through group selling.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-border mb-8 overflow-x-auto">
        {[
          { key: "active", label: "Active Groups", icon: Users },
          { key: "mine", label: "My Groups", icon: Check },
          { key: "insights", label: "Performance", icon: BarChart3 },
        ].map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key as any)}
            className={`flex items-center gap-2 px-4 py-3 font-semibold text-sm whitespace-nowrap border-b-2 transition-all ${
              activeTab === key
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <Icon className="h-4 w-4" />
            {label}
          </button>
        ))}
      </div>

      {/* Active Groups Tab */}
      {activeTab === "active" && (
        <div className="space-y-6">
          {/* Search & Filters */}
          <div className="rounded-2xl bg-card border border-border p-4 space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search groups by name or region..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-border bg-background"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Crop Filter */}
              <div>
                <label className="text-xs font-semibold text-muted-foreground block mb-1.5">
                  Crop Type
                </label>
                <select
                  value={cropFilter}
                  onChange={(e) => setCropFilter(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm"
                >
                  <option value="all">All Crops</option>
                  {Object.values(CROPS).map((crop) => (
                    <option key={crop.id} value={crop.id}>
                      {crop.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Status Filter */}
              <div>
                <label className="text-xs font-semibold text-muted-foreground block mb-1.5">
                  Status
                </label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm"
                >
                  <option value="all">All Status</option>
                  <option value="collecting">Collecting</option>
                  <option value="ready">Ready to Sell</option>
                </select>
              </div>

              {/* Sort */}
              <div>
                <label className="text-xs font-semibold text-muted-foreground block mb-1.5">
                  Sort By
                </label>
                <select
                  value={sortBy}
                  onChange={(e) =>
                    setSortBy(e.target.value as "boost" | "members" | "progress")
                  }
                  className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm"
                >
                  <option value="boost">Highest Profit Boost</option>
                  <option value="members">Most Members</option>
                  <option value="progress">Most Progress</option>
                </select>
              </div>
            </div>
          </div>

          {/* Results Count */}
          <p className="text-sm text-muted-foreground">
            Showing {filteredGroups.length} group{filteredGroups.length !== 1 ? "s" : ""}
          </p>

          {/* Groups Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredGroups.length > 0 ? (
              filteredGroups.map((group) => (
                <GroupCard key={group.id} group={group} />
              ))
            ) : (
              <div className="col-span-full rounded-2xl border border-dashed border-border p-12 text-center">
                <Users className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
                <p className="font-semibold text-foreground mb-1">No groups found</p>
                <p className="text-sm text-muted-foreground">
                  Try adjusting your filters or create a new group.
                </p>
                <button className="mt-4 bg-primary text-primary-foreground px-4 py-2 rounded-lg font-semibold text-sm hover:opacity-90">
                  <Plus className="h-4 w-4 inline mr-1" /> Create Group
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* My Groups Tab */}
      {activeTab === "mine" && (
        <div className="space-y-4">
          {myGroups.map((group) => (
            <GroupCard key={group.id} group={group} isOwned={true} />
          ))}
          {myGroups.length === 0 && (
            <div className="rounded-2xl border border-dashed border-border p-12 text-center">
              <Users className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
              <p className="font-semibold text-foreground mb-1">No groups created</p>
              <p className="text-sm text-muted-foreground mb-4">
                Start your first group sale and earn collective discounts.
              </p>
              <button className="bg-primary text-primary-foreground px-4 py-2 rounded-lg font-semibold text-sm hover:opacity-90">
                <Plus className="h-4 w-4 inline mr-1" /> Create Group
              </button>
            </div>
          )}
        </div>
      )}

      {/* Insights Tab */}
      {activeTab === "insights" && (
        <div className="space-y-4">
          {groupInsights.map((insight, idx) => (
            <div
              key={idx}
              className="rounded-xl bg-card border border-border p-4 flex items-center justify-between"
            >
              <div>
                <h4 className="font-semibold text-foreground">{insight.name}</h4>
                <p className="text-xs text-muted-foreground">{insight.members} members</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-success">{insight.avgProfit}</p>
                <p
                  className={`text-xs flex items-center justify-end gap-1 ${
                    insight.trend === "up" ? "text-green-600" : "text-red-600"
                  }`}
                >
                  <TrendingUp className="h-3 w-3" />
                  {insight.trend === "up" ? "Growing" : "Declining"}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </PageShell>
  );
}
