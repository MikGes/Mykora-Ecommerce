import { adminService } from "@/services/admin.service";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatPrice } from "@/lib/utils";

export const metadata = { title: "Analytics" };

export default async function AdminAnalyticsPage() {
  const stats = await adminService.getStats();

  return (
    <div>
      <h1 className="text-2xl font-semibold">Analytics</h1>
      <div className="mt-8 grid gap-8 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>Top Customers</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            {stats.topCustomers.map((c) => (
              <div key={c.name} className="flex justify-between">
                <span>{c.name}</span>
                <span className="text-gray-500">{c.orders} orders · {formatPrice(c.spent)}</span>
              </div>
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Category Performance</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            {stats.categoryPerformance.map((c) => (
              <div key={c.name}>
                <div className="flex justify-between text-sm mb-1">
                  <span>{c.name}</span>
                  <span>{c.percentage}%</span>
                </div>
                <div className="h-2 rounded-full bg-gray-100">
                  <div className="h-2 rounded-full bg-[#2563EB]" style={{ width: `${c.percentage}%` }} />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
