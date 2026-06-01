"use server";

import { auth } from "@/lib/auth";
import { orderService } from "@/services/order.service";
import { revalidatePath } from "next/cache";
import type { ActionResult, Order } from "@/types";

export async function cancelOrderAction(
  orderId: string
): Promise<ActionResult<Order>> {
  const session = await auth();
  if (!session?.user?.id) return { success: false, error: "Unauthorized" };

  try {
    const order = await orderService.cancelOrder(session.user.id, orderId);
    revalidatePath("/account/orders");
    return { success: true, data: order };
  } catch (e) {
    return {
      success: false,
      error: e instanceof Error ? e.message : "Cancel failed",
    };
  }
}

export async function reorderAction(
  orderId: string
): Promise<ActionResult> {
  const session = await auth();
  if (!session?.user?.id) return { success: false, error: "Unauthorized" };

  const order = await orderService.getOrderById(session.user.id, orderId);
  if (!order) return { success: false, error: "Order not found" };

  const { addToCartAction } = await import("./cart.actions");
  for (const item of order.items) {
    await addToCartAction(item.productId, item.quantity);
  }
  return { success: true };
}
