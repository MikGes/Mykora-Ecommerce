import { auth } from "@/lib/auth";
import { orderService } from "@/services/order.service";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatPrice } from "@/lib/utils";

export const metadata = { title: "Purchase Insights" };

export default async function InsightsPage() {
  const session = await auth();
  if (!session?.user?.id) return null;
  const insights = await orderService.getPurchaseInsights(session.user.id);

  return (
    <div>
      <h1 className="text-2xl font-semibold">Purchase Insights</h1>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader><CardTitle className="text-sm text-gray-500">Monthly Spending</CardTitle></CardHeader>
          <CardContent><p className="text-2xl font-semibold">{formatPrice(insights.monthlySpending)}</p></CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="text-sm text-gray-500">Total Savings</CardTitle></CardHeader>
          <CardContent><p className="text-2xl font-semibold text-emerald-600">{formatPrice(insights.savings)}</p></CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="text-sm text-gray-500">Avg Order Value</CardTitle></CardHeader>
          <CardContent><p className="text-2xl font-semibold">{formatPrice(insights.averageOrderValue)}</p></CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="text-sm text-gray-500">Loyalty Tier</CardTitle></CardHeader>
          <CardContent><p className="text-2xl font-semibold capitalize">{session.user.loyaltyTier}</p></CardContent>
        </Card>
      </div>
      <Card className="mt-8">
        <CardHeader><CardTitle>Top Categories</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-4">
            {insights.topCategories.map((cat) => (
              <div key={cat.name} className="flex justify-between">
                <span>{cat.name}</span>
                <span className="text-gray-500">{cat.count} orders · {formatPrice(cat.amount)}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
