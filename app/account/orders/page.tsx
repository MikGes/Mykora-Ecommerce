import { auth } from "@/lib/auth";
import { orderService } from "@/services/order.service";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { formatDate, formatPrice } from "@/lib/utils";
import { ORDER_STATUS_LABELS } from "@/lib/constants";
import { OrderActions } from "@/components/account/order-actions";

export const metadata = { title: "Orders" };

export default async function OrdersPage() {
  const session = await auth();
  if (!session?.user?.id) return null;
  const orders = await orderService.getOrders(session.user.id);

  return (
    <div>
      <h1 className="text-2xl font-semibold">Orders</h1>
      <div className="mt-8 space-y-4">
        {orders.length === 0 ? (
          <p className="text-gray-500">No orders yet. <Link href="/shop" className="text-[#2563EB]">Start shopping</Link></p>
        ) : (
          orders.map((order) => (
            <div key={order.id} className="rounded-lg border border-gray-100 p-6 dark:border-gray-800">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <Link href={`/account/orders/${order.id}`} className="font-semibold hover:underline">
                    {order.orderNumber}
                  </Link>
                  <p className="text-sm text-gray-500">{formatDate(order.createdAt)}</p>
                </div>
                <Badge variant={order.status === "DELIVERED" ? "success" : "secondary"}>
                  {ORDER_STATUS_LABELS[order.status]}
                </Badge>
              </div>
              <p className="mt-4 font-semibold">{formatPrice(order.total)} · {order.items.length} items</p>
              <OrderActions orderId={order.id} status={order.status} />
            </div>
          ))
        )}
      </div>
    </div>
  );
}
