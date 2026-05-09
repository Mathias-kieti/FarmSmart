import { PageShell } from "@/components/agri/PageShell";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CROPS } from "@/data/crops";
import type { CropId } from "@/data/crops";
import { apiFetch, withQuery } from "@/lib/api";
import { useLocationStore } from "@/stores/locationStore";
import type { SellingGroup } from "@/types/api";
import {
  BarChart3,
  Check,
  Clock,
  LogOut,
  Plus,
  Search,
  TrendingUp,
  Users,
} from "lucide-react";
import { type FormEvent, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

type GroupFormState = {
  name: string;
  cropId: CropId;
  county: string;
  targetKg: string;
  collectedKg: string;
  priceBoostPct: string;
};

export default function GroupSelling() {
  const county = useLocationStore((s) => s.county);
  const getInitialGroupForm = (): GroupFormState => ({
    name: "",
    cropId: "maize",
    county,
    targetKg: "1000",
    collectedKg: "0",
    priceBoostPct: "12",
  });

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
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [groupForm, setGroupForm] =
    useState<GroupFormState>(getInitialGroupForm);
  const [managedGroup, setManagedGroup] = useState<SellingGroup | null>(null);
  const [managedCollectedKg, setManagedCollectedKg] = useState("");
  const [isUpdatingGroup, setIsUpdatingGroup] = useState(false);
  const [isLeavingGroup, setIsLeavingGroup] = useState(false);

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
      result = [...result].sort(
        (a, b) => b.memberIds.length - a.memberIds.length,
      );
    } else {
      result = [...result].sort(
        (a, b) => b.collectedKg / b.targetKg - a.collectedKg / a.targetKg,
      );
    }

    return result;
  }, [cropFilter, groups, searchTerm, sortBy, statusFilter]);

  const myGroupIds = useMemo(
    () => new Set(myGroups.map((group) => group.id)),
    [myGroups],
  );

  const openCreateGroup = () => {
    setGroupForm(getInitialGroupForm());
    setIsCreateOpen(true);
  };

  const updateGroupForm = (updates: Partial<GroupFormState>) => {
    setGroupForm((current) => ({ ...current, ...updates }));
  };

  const updateGroupInState = (updated: SellingGroup) => {
    setGroups((current) =>
      current.map((group) => (group.id === updated.id ? updated : group)),
    );
    setMyGroups((current) =>
      current.map((group) => (group.id === updated.id ? updated : group)),
    );
  };

  const createGroup = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const targetKg = Number(groupForm.targetKg);
    const collectedKg = Number(groupForm.collectedKg);
    const priceBoostPct = Number(groupForm.priceBoostPct);

    if (!groupForm.name.trim()) {
      toast.error("Add a group name");
      return;
    }

    if (!groupForm.county.trim()) {
      toast.error("Add a county");
      return;
    }

    if (!Number.isFinite(targetKg) || targetKg <= 0) {
      toast.error("Target weight must be more than 0kg");
      return;
    }

    if (!Number.isFinite(collectedKg) || collectedKg < 0) {
      toast.error("Collected weight cannot be negative");
      return;
    }

    if (collectedKg > targetKg) {
      toast.error("Collected weight cannot exceed the target");
      return;
    }

    if (!Number.isFinite(priceBoostPct) || priceBoostPct < 0) {
      toast.error("Profit boost cannot be negative");
      return;
    }

    try {
      setIsCreating(true);
      const group = await apiFetch<SellingGroup>("/groups", {
        method: "POST",
        body: JSON.stringify({
          name: groupForm.name.trim(),
          cropId: groupForm.cropId,
          county: groupForm.county.trim(),
          targetKg,
          collectedKg,
          priceBoostPct: Math.round(priceBoostPct),
        }),
      });
      setGroups((current) => [group, ...current]);
      setMyGroups((current) => [group, ...current]);
      setActiveTab("mine");
      setIsCreateOpen(false);
      setGroupForm(getInitialGroupForm());
      toast.success("Group created");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Could not create group",
      );
    } finally {
      setIsCreating(false);
    }
  };

  const joinGroup = async (id: string) => {
    try {
      const updated = await apiFetch<SellingGroup>(
        withQuery(`/groups/${id}/join`, {}),
        {
          method: "POST",
        },
      );
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
      toast.error(
        error instanceof Error ? error.message : "Could not join group",
      );
    }
  };

  const openManageGroup = (group: SellingGroup) => {
    setManagedGroup(group);
    setManagedCollectedKg(String(group.collectedKg));
  };

  const closeManageGroup = (open: boolean) => {
    if (!open && !isUpdatingGroup && !isLeavingGroup) {
      setManagedGroup(null);
      setManagedCollectedKg("");
    }
  };

  const leaveGroup = async () => {
    if (!managedGroup) return;

    try {
      setIsLeavingGroup(true);
      const isOnlyMember = managedGroup.memberIds.length <= 1;

      if (isOnlyMember) {
        await apiFetch<void>(`/groups/${managedGroup.id}`, {
          method: "DELETE",
        });
        setGroups((current) =>
          current.filter((group) => group.id !== managedGroup.id),
        );
        setMyGroups((current) =>
          current.filter((group) => group.id !== managedGroup.id),
        );
      } else {
        const updated = await apiFetch<SellingGroup>(
          `/groups/${managedGroup.id}/leave`,
          {
            method: "POST",
          },
        );
        setGroups((current) =>
          current.map((group) => (group.id === updated.id ? updated : group)),
        );
        setMyGroups((current) =>
          current.filter((group) => group.id !== updated.id),
        );
      }

      setManagedGroup(null);
      setManagedCollectedKg("");
      toast.success(isOnlyMember ? "Group deleted" : "Exited group");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Could not update group",
      );
    } finally {
      setIsLeavingGroup(false);
    }
  };

  const saveGroupCollection = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!managedGroup) return;

    const collectedKg = Number(managedCollectedKg);

    if (!Number.isFinite(collectedKg) || collectedKg < 0) {
      toast.error("Collected weight cannot be negative");
      return;
    }

    if (collectedKg > managedGroup.targetKg) {
      toast.error("Collected weight cannot exceed the target");
      return;
    }

    try {
      setIsUpdatingGroup(true);
      const updated = await apiFetch<SellingGroup>(
        `/groups/${managedGroup.id}/collection`,
        {
          method: "PATCH",
          body: JSON.stringify({ collectedKg }),
        },
      );
      updateGroupInState(updated);
      setManagedGroup(updated);
      setManagedCollectedKg(String(updated.collectedKg));
      toast.success(
        updated.status === "ready" ? "Group is ready to sell" : "Group updated",
      );
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Could not update group",
      );
    } finally {
      setIsUpdatingGroup(false);
    }
  };

  const GroupCard = ({
    group,
    isOwned = false,
    isMember = false,
  }: {
    group: SellingGroup;
    isOwned?: boolean;
    isMember?: boolean;
  }) => {
    const crop = CROPS[group.cropId];
    const progress = Math.min(100, (group.collectedKg / group.targetKg) * 100);
    const hasJoined = isOwned || isMember;

    return (
      <div
        className={`rounded-xl border p-4 shadow-sm hover:shadow-md transition ${
          hasJoined ? "bg-white border-green-200" : "bg-white border-blue-200"
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
              hasJoined ? "bg-green-600" : "bg-blue-600"
            }`}
            style={{ width: `${progress}%` }}
          />
        </div>

        <p className="text-xs text-muted-foreground mb-3">
          {group.collectedKg}/{group.targetKg}kg collected -{" "}
          <span
            className={
              hasJoined
                ? "font-semibold text-green-700"
                : "font-semibold text-blue-700"
            }
          >
            +{group.priceBoostPct}% profit
          </span>
        </p>

        <button
          onClick={() =>
            isOwned
              ? openManageGroup(group)
              : isMember
                ? openManageGroup(group)
                : joinGroup(group.id)
          }
          className={`w-full py-2 rounded-lg font-semibold text-sm transition ${
            isOwned
              ? "bg-green-600 text-white"
              : isMember
                ? "bg-green-100 text-green-800 hover:bg-green-200"
                : "bg-blue-600 text-white hover:bg-blue-700"
          }`}
        >
          {isOwned
            ? "Manage Group"
            : isMember
              ? "Member - Manage"
              : "Join Group"}
        </button>
      </div>
    );
  };

  return (
    <PageShell>
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold">Group Selling Hub</h1>
          <p className="text-sm text-muted-foreground mt-2">
            Join collectives and boost your profits through group selling.
          </p>
        </div>
        <Button onClick={openCreateGroup} className="w-full sm:w-auto">
          <Plus className="h-4 w-4" />
          Create Group
        </Button>
      </div>

      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create selling group</DialogTitle>
            <DialogDescription>
              Set up a collective sale for farmers pooling the same crop.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={createGroup} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="group-name">Group name</Label>
              <Input
                id="group-name"
                value={groupForm.name}
                onChange={(event) =>
                  updateGroupForm({ name: event.target.value })
                }
                placeholder={`eg.. ${county} ${CROPS[groupForm.cropId].name} Collective`}
                disabled={isCreating}
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="group-crop">Crop</Label>
                <select
                  id="group-crop"
                  value={groupForm.cropId}
                  onChange={(event) =>
                    updateGroupForm({ cropId: event.target.value as CropId })
                  }
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                  disabled={isCreating}
                >
                  {Object.values(CROPS).map((crop) => (
                    <option key={crop.id} value={crop.id}>
                      {crop.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="group-county">County</Label>
                <Input
                  id="group-county"
                  value={groupForm.county}
                  onChange={(event) =>
                    updateGroupForm({ county: event.target.value })
                  }
                  disabled={isCreating}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="group-target">Target kg</Label>
                <Input
                  id="group-target"
                  type="number"
                  min="1"
                  step="1"
                  value={groupForm.targetKg}
                  onChange={(event) =>
                    updateGroupForm({ targetKg: event.target.value })
                  }
                  disabled={isCreating}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="group-collected">Collected kg</Label>
                <Input
                  id="group-collected"
                  type="number"
                  min="0"
                  step="1"
                  value={groupForm.collectedKg}
                  onChange={(event) =>
                    updateGroupForm({ collectedKg: event.target.value })
                  }
                  disabled={isCreating}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="group-boost">Boost %</Label>
                <Input
                  id="group-boost"
                  type="number"
                  min="0"
                  step="1"
                  value={groupForm.priceBoostPct}
                  onChange={(event) =>
                    updateGroupForm({ priceBoostPct: event.target.value })
                  }
                  disabled={isCreating}
                />
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsCreateOpen(false)}
                disabled={isCreating}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isCreating}>
                {isCreating ? "Creating..." : "Create Group"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={Boolean(managedGroup)} onOpenChange={closeManageGroup}>
        <DialogContent>
          {managedGroup && (
            <>
              <DialogHeader>
                <DialogTitle>Manage group</DialogTitle>
                <DialogDescription>
                  Update collection progress and track readiness for this sale.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4">
                <div className="rounded-lg border border-border p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="font-semibold text-foreground">
                        {managedGroup.name}
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        {managedGroup.county} -{" "}
                        {CROPS[managedGroup.cropId].name}
                      </p>
                    </div>
                    <span
                      className={`rounded-full px-2 py-1 text-xs font-semibold ${
                        managedGroup.status === "ready"
                          ? "bg-green-100 text-green-800"
                          : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {managedGroup.status === "ready"
                        ? "Ready"
                        : managedGroup.status === "closed"
                          ? "Closed"
                          : "Collecting"}
                    </span>
                  </div>

                  <div className="mt-4 grid grid-cols-3 gap-3 text-sm">
                    <div>
                      <p className="text-xs text-muted-foreground">Members</p>
                      <p className="font-semibold">
                        {managedGroup.memberIds.length}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Target</p>
                      <p className="font-semibold">{managedGroup.targetKg}kg</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Boost</p>
                      <p className="font-semibold">
                        +{managedGroup.priceBoostPct}%
                      </p>
                    </div>
                  </div>

                  <div className="mt-4">
                    <div className="mb-2 flex justify-between text-xs text-muted-foreground">
                      <span>{managedGroup.collectedKg}kg collected</span>
                      <span>
                        {Math.round(
                          (managedGroup.collectedKg / managedGroup.targetKg) *
                            100,
                        )}
                        %
                      </span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-gray-200">
                      <div
                        className="h-2 rounded-full bg-green-600 transition-all"
                        style={{
                          width: `${Math.min(
                            100,
                            (managedGroup.collectedKg / managedGroup.targetKg) *
                              100,
                          )}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>

                <form onSubmit={saveGroupCollection} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="managed-collected">Collected kg</Label>
                    <Input
                      id="managed-collected"
                      type="number"
                      min="0"
                      max={managedGroup.targetKg}
                      step="1"
                      value={managedCollectedKg}
                      onChange={(event) =>
                        setManagedCollectedKg(event.target.value)
                      }
                      disabled={
                        isUpdatingGroup || managedGroup.status === "closed"
                      }
                    />
                    <p className="text-xs text-muted-foreground">
                      Reaching {managedGroup.targetKg}kg will mark the group
                      ready to sell.
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {managedGroup.memberIds.length <= 1
                        ? "Because you are the only member, exiting will delete this group."
                        : "Exiting removes you from this group but keeps it open for other members."}
                    </p>
                  </div>

                  <DialogFooter>
                    <Button
                      type="button"
                      variant="destructive"
                      onClick={leaveGroup}
                      disabled={isUpdatingGroup || isLeavingGroup}
                    >
                      <LogOut className="h-4 w-4" />
                      {isLeavingGroup
                        ? managedGroup.memberIds.length <= 1
                          ? "Deleting..."
                          : "Exiting..."
                        : managedGroup.memberIds.length <= 1
                          ? "Delete Group"
                          : "Exit Group"}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => closeManageGroup(false)}
                      disabled={isUpdatingGroup || isLeavingGroup}
                    >
                      Close
                    </Button>
                    <Button
                      type="submit"
                      disabled={
                        isUpdatingGroup ||
                        isLeavingGroup ||
                        managedGroup.status === "closed"
                      }
                    >
                      {isUpdatingGroup ? "Saving..." : "Save Progress"}
                    </Button>
                  </DialogFooter>
                </form>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

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
                <GroupCard
                  key={group.id}
                  group={group}
                  isMember={myGroupIds.has(group.id)}
                />
              ))
            ) : (
              <div className="col-span-full rounded-2xl border border-dashed border-border p-12 text-center">
                <Users className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
                <p className="font-semibold text-foreground mb-1">
                  No groups found
                </p>
                <p className="text-sm text-muted-foreground">
                  Try adjusting your filters or create a new group.
                </p>
                <button
                  onClick={openCreateGroup}
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
              <p className="font-semibold text-foreground mb-1">
                No groups joined
              </p>
              <p className="text-sm text-muted-foreground mb-4">
                Start your first group sale or join an active collective.
              </p>
              <button
                onClick={openCreateGroup}
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
                <p className="font-bold text-success">
                  +{group.priceBoostPct}%
                </p>
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
