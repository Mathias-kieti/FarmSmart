import { PageShell } from "@/components/agri/PageShell";
import { COUNTIES } from "@/data/counties";
import { useLocationStore } from "@/stores/locationStore";
import { useListingsStore } from "@/stores/listingsStore";
import { useUserStore } from "@/stores/userStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { useState } from "react";

export default function Profile() {
  const { user, setUser } = useUserStore();
  const { setCounty } = useLocationStore();
  const myListings = useListingsStore((s) => s.listings.filter((l) => l.userId === user.id));
  const [name, setName] = useState(user.name);
  const [phone, setPhone] = useState(user.phone);
  const [county, setLocalCounty] = useState(user.county);

  const save = (e: React.FormEvent) => {
    e.preventDefault();
    setUser({ name, phone, county });
    setCounty(county);
    toast.success("Profile updated");
  };

  return (
    <PageShell>
      <h1 className="text-2xl sm:text-3xl font-bold mb-1">My Profile</h1>
      <p className="text-sm text-muted-foreground mb-6">Update your details so buyers can reach you.</p>

      <div className="grid lg:grid-cols-[1fr_280px] gap-6">
        <form onSubmit={save} className="rounded-2xl bg-card border border-border p-6 grid gap-4">
          <div className="flex items-center gap-4 mb-2">
            <div className="h-16 w-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-2xl font-bold">
              {name.charAt(0)}
            </div>
            <div>
              <p className="font-bold text-lg">{name}</p>
              <p className="text-sm text-muted-foreground">{county}, Kenya</p>
            </div>
          </div>
          <div>
            <Label>Full name</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} className="mt-1.5" />
          </div>
          <div>
            <Label>Phone</Label>
            <Input value={phone} onChange={(e) => setPhone(e.target.value)} className="mt-1.5" />
          </div>
          <div>
            <Label>Location (County)</Label>
            <Select value={county} onValueChange={setLocalCounty}>
              <SelectTrigger className="mt-1.5">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {COUNTIES.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button type="submit" className="bg-primary text-primary-foreground w-fit">
            Save changes
          </Button>
        </form>

        <aside className="rounded-2xl bg-card border border-border p-5 h-fit">
          <h3 className="font-bold mb-3">At a glance</h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Total listings</span>
              <span className="font-semibold">{myListings.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Active</span>
              <span className="font-semibold text-success">
                {myListings.filter((l) => l.status === "Active").length}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Sold</span>
              <span className="font-semibold">{myListings.filter((l) => l.status === "Sold").length}</span>
            </div>
          </div>
        </aside>
      </div>
    </PageShell>
  );
}

