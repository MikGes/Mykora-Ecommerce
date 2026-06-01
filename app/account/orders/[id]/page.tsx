import { auth } from "@/lib/auth";
import { orderService } from "@/services/order.service";
import { notFound } from "next/navigation";
import { formatDate, formatPrice } from "@/lib/utils";
import { ORDER_STATUS_LABELS } from "@/lib/constants";
import { Badge } from "@/components/ui/badge";
import { OrderTimeline } from "@/components/account/order-timeline";
import Image from "next/image";

interface OrderDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function OrderDetailPage({ params }: OrderDetailPageProps) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user?.id) return null;

  const order = await orderService.getOrderById(session.user.id, id);
  if (!order) notFound();

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">{order.orderNumber}</h1>
          <p className="text-gray-500">Placed {formatDate(order.createdAt)}</p>
        </div>
        <Badge>{ORDER_STATUS_LABELS[order.status]}</Badge>
      </div>
      <OrderTimeline status={order.status} />
      <div className="mt-8 space-y-4">
        {order.items.map((item) => (
          <div key={item.id} className="flex gap-4 rounded-lg border p-4">
            {item.image && (
              <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded bg-gray-50">
                <Image src={item.image} alt="" fill className="object-cover" />
              </div>
            )}
            <div className="flex-1">
              <p className="font-medium">{item.name}</p>
              <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
            </div>
            <p className="font-semibold">{formatPrice(item.price * item.quantity)}</p>
          </div>
        ))}
      </div>
      <dl className="mt-8 space-y-2 border-t pt-6">
        <div className="flex justify-between"><dt>Subtotal</dt><dd>{formatPrice(order.subtotal)}</dd></div>
        <div className="flex justify-between"><dt>Shipping</dt><dd>{formatPrice(order.shipping)}</dd></div>
        <div className="flex justify-between"><dt>Tax</dt><dd>{formatPrice(order.tax)}</dd></div>
        <div className="flex justify-between font-semibold text-lg"><dt>Total</dt><dd>{formatPrice(order.total)}</dd></div>
      </dl>
      {order.trackingNumber && (
        <p className="mt-4 text-sm">Tracking: <span className="font-mono">{order.trackingNumber}</span></p>
      )}
    </div>
  );
}
