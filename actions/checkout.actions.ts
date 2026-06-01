"use server";

import { auth } from "@/lib/auth";
import { checkoutService } from "@/services/checkout.service";
import { addressSchema } from "@/lib/validators";
import { revalidatePath } from "next/cache";
import type { ActionResult, CheckoutData, Order } from "@/types";

export async function processCheckoutAction(
  data: CheckoutData
): Promise<ActionResult<{ order: Order; paymentId?: string }>> {
  const session = await auth();

  const addressResult = addressSchema.safeParse(data.address);
  if (!addressResult.success) {
    return { success: false, error: "Invalid address" };
  }

  try {
    const result = await checkoutService.processCheckout(
      session?.user?.id,
      data.guestEmail,
      {
        ...data,
        address: {
          ...addressResult.data,
          id: "checkout",
          isDefaultShipping: addressResult.data.isDefaultShipping ?? false,
          isDefaultBilling: addressResult.data.isDefaultBilling ?? false,
        },
      }
    );
    revalidatePath("/account/orders");
    revalidatePath("/cart");
    return { success: true, data: result };
  } catch (e) {
    return {
      success: false,
      error: e instanceof Error ? e.message : "Checkout failed",
    };
  }
}
