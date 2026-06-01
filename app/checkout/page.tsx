import { getCartAction } from "@/actions/cart.actions";
import { CheckoutWizard } from "@/components/checkout/checkout-wizard";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { addressService } from "@/services/address.service";

export const metadata = { title: "Checkout" };

export default async function CheckoutPage() {
  const [cart, session] = await Promise.all([getCartAction(), auth()]);
  const activeItems = cart.items.filter((i) => !i.savedForLater);
  if (activeItems.length === 0) redirect("/cart");

  const addresses = session?.user?.id
    ? await addressService.getAddresses(session.user.id)
    : [];

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-semibold text-[#111827] dark:text-white">Checkout</h1>
      <CheckoutWizard cart={cart} addresses={addresses} isAuthenticated={!!session} />
    </div>
  );
}
