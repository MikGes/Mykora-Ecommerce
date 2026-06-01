import { couponService } from "@/services/coupon.service";
import { formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export const metadata = { title: "Coupons" };

export default async function AdminCouponsPage() {
  const coupons = await couponService.getAll();

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Coupons</h1>
        <Button>Create Coupon</Button>
      </div>
      <div className="mt-8 overflow-x-auto rounded-lg border">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-4 text-left">Code</th>
              <th className="p-4 text-left">Type</th>
              <th className="p-4 text-left">Value</th>
              <th className="p-4 text-left">Used</th>
              <th className="p-4 text-left">Expires</th>
              <th className="p-4 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {coupons.map((c) => (
              <tr key={c.id} className="border-t">
                <td className="p-4 font-mono font-medium">{c.code}</td>
                <td className="p-4">{c.type}</td>
                <td className="p-4">{c.type === "PERCENTAGE" ? `${c.value}%` : `$${c.value}`}</td>
                <td className="p-4">{c.usedCount}{c.maxUses ? ` / ${c.maxUses}` : ""}</td>
                <td className="p-4">{c.expiresAt ? formatDate(c.expiresAt) : "—"}</td>
                <td className="p-4">
                  <Badge variant={c.active ? "success" : "destructive"}>
                    {c.active ? "Active" : "Inactive"}
                  </Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
