"use client";

import { Button } from "@/components/ui/button";
import { cancelOrderAction, reorderAction } from "@/actions/order.actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import type { OrderStatus } from "@/types";

interface OrderActionsProps {
  orderId: string;
  status: OrderStatus;
}

export function OrderActions({ orderId, status }: OrderActionsProps) {
  const router = useRouter();

  return (
    <div className="mt-4 flex gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={async () => {
          const r = await reorderAction(orderId);
          if (r.success) {
            toast.success("Items added to cart");
            router.push("/cart");
          }
        }}
      >
        Reorder
      </Button>
      {!["SHIPPED", "DELIVERED", "CANCELLED"].includes(status) && (
        <Button
          variant="outline"
          size="sm"
          onClick={async () => {
            const r = await cancelOrderAction(orderId);
            if (r.success) {
              toast.success("Order cancelled");
              router.refresh();
            } else toast.error(r.error);
          }}
        >
          Cancel
        </Button>
      )}
      <Button variant="ghost" size="sm" asChild>
        <a href={`/api/invoice/${orderId}`} target="_blank" rel="noopener">
          Download PDF
        </a>
      </Button>
    </div>
  );
}
