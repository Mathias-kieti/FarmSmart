import { PageShell } from "@/components/agri/PageShell";

export default function Orders() {
  return (
    <PageShell>
      <h1 className="text-2xl font-bold mb-2">Orders</h1>
      <div className="rounded-2xl border border-dashed border-border p-12 text-center text-muted-foreground">
        No orders yet. Buyers will reach you via Call or WhatsApp on your listings.
      </div>
    </PageShell>
  );
}

