"use server";

import { auth } from "@/lib/auth";
import { checkRateLimit, getClientIp } from "@/lib/security";
import { cartService } from "@/services/cart.service";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import type { ActionResult } from "@/types";
import type { Cart } from "@/types";

async function getGuestId() {
  const cookieStore = await cookies();
  let guestId = cookieStore.get("mykora_guest")?.value;
  if (!guestId) {
    guestId = `guest-${Date.now()}`;
    cookieStore.set("mykora_guest", guestId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 30,
    });
  }
  return guestId;
}

async function getContext() {
  const session = await auth();
  const guestId = session?.user?.id ? undefined : await getGuestId();
  return { userId: session?.user?.id, guestId };
}

export async function getCartAction(): Promise<Cart> {
  const { userId, guestId } = await getContext();
  return cartService.getCart(userId, guestId);
}

export async function addToCartAction(
  productId: string,
  quantity = 1,
  variantId?: string
): Promise<ActionResult<Cart>> {
  const ip = await getClientIp();
  const { allowed } = checkRateLimit(`cart:${ip}`);
  if (!allowed) return { success: false, error: "Too many requests" };

  try {
    const { userId, guestId } = await getContext();
    const cart = await cartService.addItem(
      productId,
      quantity,
      userId,
      guestId,
      variantId
    );
    revalidatePath("/cart");
    return { success: true, data: cart };
  } catch (e) {
    return {
      success: false,
      error: e instanceof Error ? e.message : "Failed to add item",
    };
  }
}

export async function updateCartQuantityAction(
  itemId: string,
  quantity: number
): Promise<ActionResult<Cart>> {
  try {
    const { userId, guestId } = await getContext();
    const cart = await cartService.updateQuantity(
      itemId,
      quantity,
      userId,
      guestId
    );
    revalidatePath("/cart");
    return { success: true, data: cart };
  } catch (e) {
    return {
      success: false,
      error: e instanceof Error ? e.message : "Failed to update",
    };
  }
}

export async function removeFromCartAction(
  itemId: string
): Promise<ActionResult<Cart>> {
  try {
    const { userId, guestId } = await getContext();
    const cart = await cartService.removeItem(itemId, userId, guestId);
    revalidatePath("/cart");
    return { success: true, data: cart };
  } catch (e) {
    return {
      success: false,
      error: e instanceof Error ? e.message : "Failed to remove",
    };
  }
}

export async function applyCouponAction(
  code: string
): Promise<ActionResult<Cart>> {
  try {
    const { userId, guestId } = await getContext();
    const { cart, error } = await cartService.applyCoupon(
      code,
      userId,
      guestId
    );
    revalidatePath("/cart");
    if (error) return { success: false, error };
    return { success: true, data: cart };
  } catch (e) {
    return {
      success: false,
      error: e instanceof Error ? e.message : "Failed to apply coupon",
    };
  }
}

export async function saveForLaterAction(
  itemId: string
): Promise<ActionResult<Cart>> {
  try {
    const { userId, guestId } = await getContext();
    const cart = await cartService.saveForLater(itemId, userId, guestId);
    revalidatePath("/cart");
    return { success: true, data: cart };
  } catch (e) {
    return { success: false, error: "Failed to save for later" };
  }
}
