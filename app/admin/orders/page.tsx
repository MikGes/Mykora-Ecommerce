import { orderService } from "@/services/order.service";
import { formatDate, formatPrice } from "@/lib/utils";
import { ORDER_STATUS_LABELS } from "@/lib/constants";
import { Badge } from "@/components/ui/badge";

export const metadata = { title: "Orders" };

export default async function AdminOrdersPage() {
  const orders = await orderService.getAllOrders();

  return (
    <div>
      <h1 className="text-2xl font-semibold">Orders</h1>
      <div className="mt-8 overflow-x-auto rounded-lg border">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-4 text-left">Order</th>
              <th className="p-4 text-left">Date</th>
              <th className="p-4 text-left">Status</th>
              <th className="p-4 text-left">Total</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.id} className="border-t">
                <td className="p-4 font-medium">{o.orderNumber}</td>
                <td className="p-4 text-gray-500">{formatDate(o.createdAt)}</td>
                <td className="p-4">
                  <Badge variant="secondary">{ORDER_STATUS_LABELS[o.status]}</Badge>
                </td>
                <td className="p-4 font-semibold">{formatPrice(o.total)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
