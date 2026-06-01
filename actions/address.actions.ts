"use server";

import { auth } from "@/lib/auth";
import { addressService } from "@/services/address.service";
import { addressSchema } from "@/lib/validators";
import { revalidatePath } from "next/cache";
import type { ActionResult, Address } from "@/types";

export async function addAddressAction(
  data: Omit<Address, "id">
): Promise<ActionResult<Address>> {
  const session = await auth();
  if (!session?.user?.id) return { success: false, error: "Unauthorized" };

  const parsed = addressSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message };
  }

  const address = await addressService.addAddress(
    session.user.id,
    parsed.data as Omit<Address, "id">
  );
  revalidatePath("/account/addresses");
  return { success: true, data: address };
}

export async function deleteAddressAction(
  addressId: string
): Promise<ActionResult> {
  const session = await auth();
  if (!session?.user?.id) return { success: false, error: "Unauthorized" };

  await addressService.deleteAddress(session.user.id, addressId);
  revalidatePath("/account/addresses");
  return { success: true };
}
