import { getCartAction } from "@/actions/cart.actions";
import { CartView } from "@/components/cart/cart-view";

export const metadata = { title: "Shopping Cart" };

export default async function CartPage() {
  const cart = await getCartAction();
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-semibold text-[#111827] dark:text-white">Shopping Cart</h1>
      <CartView cart={cart} />
    </div>
  );
}
