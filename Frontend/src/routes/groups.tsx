import { PageShell } from "@/components/agri/PageShell";
import { CROPS } from "@/data/crops";
import { apiFetch, withQuery } from "@/lib/api";
import { useLocationStore } from "@/stores/locationStore";
import type { SellingGroup } from "@/types/api";
import {
  BarChart3,
  Check,
  Clock,
  Plus,
  Search,
  TrendingUp,
  Users,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

export default function GroupSelling() {
  const county = useLocationStore((s) => s.county);
  const [activeTab, setActiveTab] = useState<"active" | "mine" | "insights">(
    "active",
  );
  const [groups, setGroups] = useState<SellingGroup[]>([]);
  const [myGroups, setMyGroups] = useState<SellingGroup[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [cropFilter, setCropFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"boost" | "members" | "progress">(
    "boost",
  );

  const loadGroups = async () => {
    const [all, mine] = await Promise.all([
      apiFetch<SellingGroup[]>("/groups"),
      apiFetch<SellingGroup[]>("/groups/mine").catch(() => []),
    ]);
    setGroups(all);
    setMyGroups(mine);
  };

  useEffect(() => {
    loadGroups().catch(() => {
      setGroups([]);
      setMyGroups([]);
    });
  }, []);

  const filteredGroups = useMemo(() => {
    let result = groups;

    if (searchTerm) {
      result = result.filter(
        (group) =>
          group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          group.county.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    if (cropFilter !== "all") {
      result = result.filter((group) => group.cropId === cropFilter);
    }

    if (statusFilter !== "all") {
      result = result.filter((group) => group.status === statusFilter);
    }

    if (sortBy === "boost") {
      result = [...result].sort((a, b) => b.priceBoostPct - a.priceBoostPct);
    } else if (sortBy === "members") {
      result = [...result].sort((a, b) => b.memberIds.length - a.memberIds.length);
    } else {
      result = [...result].sort(
        (a, b) => b.collectedKg / b.targetKg - a.collectedKg / a.targetKg,
      );
    }

    return result;
  }, [cropFilter, groups, searchTerm, sortBy, statusFilter]);

  const createDemoGroup = async () => {
    try {
      const group = await apiFetch<SellingGroup>("/groups", {
        method: "POST",
        body: JSON.stringify({
          name: `${county} ${CROPS.maize.name} Collective`,
          cropId: "maize",
          county,
          targetKg: 1000,
          collectedKg: 0,
          priceBoostPct: 12,
        }),
      });
      setGroups((current) => [group, ...current]);
      setMyGroups((current) => [group, ...current]);
      toast.success("Group created");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not create group");
    }
  };

  const joinGroup = async (id: string) => {
    try {
      const updated = await apiFetch<SellingGroup>(withQuery(`/groups/${id}/join`, {}), {
        method: "POST",
      });
      setGroups((current) =>
        current.map((group) => (group.id === updated.id ? updated : group)),
      );
      setMyGroups((current) =>
        current.some((group) => group.id === updated.id)
          ? current.map((group) => (group.id === updated.id ? updated : group))
          : [updated, ...current],
      );
      toast.success("Joined group");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not join group");
    }
  };

  const GroupCard = ({
    group,
    isOwned = false,
  }: {
    group: SellingGroup;
    isOwned?: boolean;
  }) => {
    const crop = CROPS[group.cropId];
    const progress = Math.min(100, (group.collectedKg / group.targetKg) * 100);

    return (
      <div
        className={`rounded-xl border p-4 shadow-sm hover:shadow-md transition ${
          isOwned ? "bg-white border-green-200" : "bg-white border-blue-200"
        }`}
      >
        <div className="flex items-start justify-between mb-3">
          <div>
            <h4 className="font-bold text-foreground">{group.name}</h4>
            <p className="text-xs text-muted-foreground">
              {group.memberIds.length} farmers - {group.county} - {crop.name}
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
            style={{ width: `${progress}%` }}
          />
        </div>

        <p className="text-xs text-muted-foreground mb-3">
          {group.collectedKg}/{group.targetKg}kg collected -{" "}
          <span className={isOwned ? "font-semibold text-green-700" : "font-semibold text-blue-700"}>
            +{group.priceBoostPct}% profit
          </span>
        </p>

        <button
          onClick={() => (isOwned ? undefined : joinGroup(group.id))}
          className={`w-full py-2 rounded-lg font-semibold text-sm transition ${
            isOwned
              ? "bg-green-600 text-white"
              : "bg-blue-600 text-white hover:bg-blue-700"
          }`}
        >
          {isOwned ? "Manage Group" : "Join Group"}
        </button>
      </div>
    );
  };

  return (
    <PageShell>
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold">Group Selling Hub</h1>
        <p className="text-sm text-muted-foreground mt-2">
          Join collectives and boost your profits through group selling.
        </p>
      </div>

      <div className="flex border-b border-border mb-8 overflow-x-auto">
        {[
          { key: "active", label: "Active Groups", icon: Users },
          { key: "mine", label: "My Groups", icon: Check },
          { key: "insights", label: "Performance", icon: BarChart3 },
        ].map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key as typeof activeTab)}
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

      {activeTab === "active" && (
        <div className="space-y-6">
          <div className="rounded-2xl bg-card border border-border p-4 space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search groups by name or county..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-border bg-background"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
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

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm"
              >
                <option value="all">All Status</option>
                <option value="collecting">Collecting</option>
                <option value="ready">Ready to Sell</option>
              </select>

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

          <p className="text-sm text-muted-foreground">
            Showing {filteredGroups.length} group
            {filteredGroups.length !== 1 ? "s" : ""}
          </p>

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
                <button
                  onClick={createDemoGroup}
                  className="mt-4 bg-primary text-primary-foreground px-4 py-2 rounded-lg font-semibold text-sm hover:opacity-90"
                >
                  <Plus className="h-4 w-4 inline mr-1" /> Create Group
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === "mine" && (
        <div className="space-y-4">
          {myGroups.map((group) => (
            <GroupCard key={group.id} group={group} isOwned />
          ))}
          {myGroups.length === 0 && (
            <div className="rounded-2xl border border-dashed border-border p-12 text-center">
              <Users className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
              <p className="font-semibold text-foreground mb-1">No groups joined</p>
              <p className="text-sm text-muted-foreground mb-4">
                Start your first group sale or join an active collective.
              </p>
              <button
                onClick={createDemoGroup}
                className="bg-primary text-primary-foreground px-4 py-2 rounded-lg font-semibold text-sm hover:opacity-90"
              >
                <Plus className="h-4 w-4 inline mr-1" /> Create Group
              </button>
            </div>
          )}
        </div>
      )}

      {activeTab === "insights" && (
        <div className="space-y-4">
          {groups.slice(0, 5).map((group) => (
            <div
              key={group.id}
              className="rounded-xl bg-card border border-border p-4 flex items-center justify-between"
            >
              <div>
                <h4 className="font-semibold text-foreground">{group.name}</h4>
                <p className="text-xs text-muted-foreground">
                  {group.memberIds.length} members
                </p>
              </div>
              <div className="text-right">
                <p className="font-bold text-success">+{group.priceBoostPct}%</p>
                <p className="text-xs flex items-center justify-end gap-1 text-green-600">
                  <TrendingUp className="h-3 w-3" />
                  Growing
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </PageShell>
  );
}
