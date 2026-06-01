"use server";

import { auth } from "@/lib/auth";
import { priceAlertService } from "@/services/price-alert.service";
import { notificationService } from "@/services/notification.service";
import { revalidatePath } from "next/cache";
import type { ActionResult } from "@/types";

export async function togglePriceAlertAction(
  productId: string
): Promise<ActionResult<{ watching: boolean }>> {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: "Please sign in to set price alerts" };
  }

  const watching = await priceAlertService.isWatching(
    session.user.id,
    productId
  );
  if (watching) {
    await priceAlertService.unwatch(session.user.id, productId);
  } else {
    await priceAlertService.watch(session.user.id, productId);
    await notificationService.create(
      session.user.id,
      "PRICE_DROP",
      "Price alert set",
      "We'll notify you when the price drops.",
      `/products/${productId}`
    );
  }
  revalidatePath(`/products`);
  return { success: true, data: { watching: !watching } };
}
