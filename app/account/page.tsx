import { auth } from "@/lib/auth";
import { orderService } from "@/services/order.service";
import { wishlistService } from "@/services/wishlist.service";
import { addressService } from "@/services/address.service";
import { couponService } from "@/services/coupon.service";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, Star, Tag, Heart, MapPin } from "lucide-react";

export const metadata = { title: "Dashboard" };

export default async function AccountDashboard() {
  const session = await auth();
  if (!session?.user?.id) return null;

  const [orders, wishlistCount, addresses, coupons] = await Promise.all([
    orderService.getOrders(session.user.id),
    wishlistService.getCount(session.user.id),
    addressService.getAddresses(session.user.id),
    couponService.getActiveCoupons(),
  ]);

  const stats = [
    { label: "Total Orders", value: orders.length, icon: Package },
    { label: "Loyalty Points", value: session.user.loyaltyPoints, icon: Star },
    { label: "Active Coupons", value: coupons.length, icon: Tag },
    { label: "Wishlist Items", value: wishlistCount, icon: Heart },
    { label: "Saved Addresses", value: addresses.length, icon: MapPin },
  ];

  return (
    <div>
      <h1 className="text-2xl font-semibold text-[#111827] dark:text-white">Dashboard</h1>
      <p className="mt-1 text-gray-500">Welcome back, {session.user.name}</p>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">{stat.label}</CardTitle>
                <Icon className="h-4 w-4 text-gray-400" />
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-semibold">{stat.value}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Recent Orders</CardTitle>
        </CardHeader>
        <CardContent>
          {orders.length === 0 ? (
            <p className="text-gray-500">No orders yet</p>
          ) : (
            <div className="space-y-4">
              {orders.slice(0, 3).map((order) => (
                <div key={order.id} className="flex justify-between border-b pb-4 last:border-0">
                  <div>
                    <p className="font-medium">{order.orderNumber}</p>
                    <p className="text-sm text-gray-500">{order.status}</p>
                  </div>
                  <p className="font-semibold">${order.total.toFixed(2)}</p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
