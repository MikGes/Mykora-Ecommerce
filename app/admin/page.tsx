import { adminService } from "@/services/admin.service";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatPrice } from "@/lib/utils";
import { DollarSign, ShoppingCart, Users, Package, TrendingUp } from "lucide-react";

export const metadata = { title: "Admin Dashboard" };

export default async function AdminDashboard() {
  const stats = await adminService.getStats();

  const cards = [
    { label: "Revenue", value: formatPrice(stats.revenue), icon: DollarSign },
    { label: "Orders", value: stats.orders.toString(), icon: ShoppingCart },
    { label: "Customers", value: stats.customers.toString(), icon: Users },
    { label: "Products", value: stats.products.toString(), icon: Package },
    { label: "Conversion Rate", value: `${stats.conversionRate}%`, icon: TrendingUp },
  ];

  return (
    <div>
      <h1 className="text-2xl font-semibold">Dashboard</h1>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <Card key={card.label}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm text-gray-500">{card.label}</CardTitle>
                <Icon className="h-4 w-4 text-gray-400" />
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-semibold">{card.value}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>
      <div className="mt-8 grid gap-8 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>Revenue by Month</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stats.revenueByMonth.map((m) => (
                <div key={m.month} className="flex items-center gap-4">
                  <span className="w-8 text-sm text-gray-500">{m.month}</span>
                  <div className="flex-1 h-2 rounded-full bg-gray-100">
                    <div
                      className="h-2 rounded-full bg-[#2563EB]"
                      style={{ width: `${(m.revenue / 60000) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium">{formatPrice(m.revenue)}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Top Products</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stats.topProducts.map((p) => (
                <div key={p.name} className="flex justify-between text-sm">
                  <span className="truncate flex-1">{p.name}</span>
                  <span className="text-gray-500 ml-4">{p.sales} sold · {formatPrice(p.revenue)}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
