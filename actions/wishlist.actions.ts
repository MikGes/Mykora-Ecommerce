"use server";

import { auth } from "@/lib/auth";
import { wishlistService } from "@/services/wishlist.service";
import { revalidatePath } from "next/cache";
import type { ActionResult } from "@/types";

export async function toggleWishlistAction(
  productId: string
): Promise<ActionResult<{ inWishlist: boolean }>> {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: "Please sign in to use wishlist" };
  }

  const inWishlist = await wishlistService.isInWishlist(
    session.user.id,
    productId
  );
  if (inWishlist) {
    await wishlistService.remove(session.user.id, productId);
  } else {
    await wishlistService.add(session.user.id, productId);
  }
  revalidatePath("/account/wishlist");
  revalidatePath(`/products`);
  return { success: true, data: { inWishlist: !inWishlist } };
}

export async function moveToCartFromWishlistAction(
  productId: string
): Promise<ActionResult<{ inWishlist: boolean }>> {
  const session = await auth();
  if (!session?.user?.id) return { success: false, error: "Unauthorized" };

  await wishlistService.remove(session.user.id, productId);
  const { addToCartAction } = await import("./cart.actions");
  const result = await addToCartAction(productId, 1);
  return { success: result.success, error: result.error };
}
