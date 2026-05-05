import { PageShell } from "@/components/agri/PageShell";
import { COUNTIES } from "@/data/counties";
import { CROPS, type CropId } from "@/data/crops";
import { formatRelativeTime } from "@/lib/relativeTime";
import { useLocationStore } from "@/stores/locationStore";
import { useListingsStore } from "@/stores/listingsStore";
import { useUserStore } from "@/stores/userStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle2, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";

export default function Sell() {
  const { user } = useUserStore();
  const county = useLocationStore((s) => s.county);
  const { listings, add, markSold, remove } = useListingsStore();
  const myListings = listings.filter((l) => l.userId === user.id).sort((a, b) => b.createdAt - a.createdAt);
  const [tab, setTab] = useState("create");

  const [cropId, setCropId] = useState<CropId>("maize");
  const [price, setPrice] = useState("");
  const [qty, setQty] = useState("");
  const [where, setWhere] = useState(county);
  const [phone, setPhone] = useState(user.phone);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const p = Number(price);
    const q = Number(qty);
    if (!p || !q) {
      toast.error("Enter a valid price and quantity");
      return;
    }
    add({
      cropId,
      unitLabel: CROPS[cropId].unit,
      pricePerUnit: p,
      quantity: q,
      county: where,
      sellerName: user.name,
      sellerPhone: phone,
      userId: user.id,
    });
    toast.success("Listing posted! Buyers can now contact you.");
    setPrice("");
    setQty("");
    setTab("mine");
  };

  return (
    <PageShell>
      <h1 className="text-2xl sm:text-3xl font-bold mb-1">Sell Produce</h1>
      <p className="text-sm text-muted-foreground mb-6">Post a listing or manage your existing ones.</p>

      <Tabs value={tab} onValueChange={setTab} className="w-full">
        <TabsList className="grid grid-cols-2 w-full max-w-sm mb-4">
          <TabsTrigger value="create">Create Listing</TabsTrigger>
          <TabsTrigger value="mine">My Listings ({myListings.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="create">
          <form
            onSubmit={submit}
            className="rounded-2xl bg-card border border-border p-5 sm:p-6 grid sm:grid-cols-2 gap-4 max-w-2xl"
          >
            <div className="sm:col-span-2">
              <Label>Crop</Label>
              <Select value={cropId} onValueChange={(v) => setCropId(v as CropId)}>
                <SelectTrigger className="mt-1.5">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(CROPS).map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.emoji} {c.name} sold by {c.unit}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Quantity ({CROPS[cropId].unit}s)</Label>
              <Input
                type="number"
                min={1}
                value={qty}
                onChange={(e) => setQty(e.target.value)}
                placeholder="e.g. 10"
                className="mt-1.5"
              />
            </div>
            <div>
              <Label>Price per {CROPS[cropId].unit} (KES)</Label>
              <Input
                type="number"
                min={1}
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="e.g. 2700"
                className="mt-1.5"
              />
            </div>
            <div>
              <Label>Location (County)</Label>
              <Select value={where} onValueChange={setWhere}>
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
            <div>
              <Label>Phone (buyers will call/WhatsApp)</Label>
              <Input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+2547"
                className="mt-1.5"
              />
            </div>
            <div className="sm:col-span-2 flex justify-end gap-2 pt-2">
              <Button type="submit" className="bg-primary text-primary-foreground hover:opacity-90">
                Post Listing
              </Button>
            </div>
          </form>
        </TabsContent>

        <TabsContent value="mine">
          {myListings.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border p-12 text-center">
              <p className="font-semibold">You have no listings yet</p>
              <p className="text-sm text-muted-foreground mt-1">Switch to Create Listing to post your produce.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {myListings.map((l) => {
                const c = CROPS[l.cropId];
                return (
                  <div key={l.id} className="rounded-2xl bg-card border border-border p-4 flex items-center gap-4">
                    <img src={c.image} alt="" className="h-14 w-14 rounded-xl object-cover" />
                    <div className="flex-1 min-w-0">
                      <p className="font-bold">
                        {c.name} <span className="text-xs font-normal text-muted-foreground"> {l.quantity}  {l.unitLabel}</span>
                      </p>
                      <p className="text-sm text-muted-foreground">
                        KES {l.pricePerUnit.toLocaleString()}  {l.county}  {formatRelativeTime(l.createdAt)}
                      </p>
                    </div>
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                        l.status === "Active" ? "bg-success/15 text-success" : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {l.status}
                    </span>
                    {l.status === "Active" && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          markSold(l.id);
                          toast.success("Marked as sold");
                        }}
                      >
                        <CheckCircle2 className="h-4 w-4 mr-1" /> Sold
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        remove(l.id);
                        toast.success("Listing removed");
                      }}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                );
              })}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </PageShell>
  );
}

