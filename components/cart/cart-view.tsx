"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatPrice } from "@/lib/utils";
import {
  updateCartQuantityAction,
  removeFromCartAction,
  applyCouponAction,
  saveForLaterAction,
} from "@/actions/cart.actions";
import { toast } from "sonner";
import { useState } from "react";
import type { Cart } from "@/types";
import { Trash2 } from "lucide-react";

interface CartViewProps {
  cart: Cart;
}

export function CartView({ cart: initialCart }: CartViewProps) {
  const [cart, setCart] = useState(initialCart);
  const [couponCode, setCouponCode] = useState("");
  const activeItems = cart.items.filter((i) => !i.savedForLater);
  const savedItems = cart.items.filter((i) => i.savedForLater);

  const updateQty = async (itemId: string, qty: number) => {
    const result = await updateCartQuantityAction(itemId, qty);
    if (result.success && result.data) setCart(result.data);
  };

  const remove = async (itemId: string) => {
    const result = await removeFromCartAction(itemId);
    if (result.success && result.data) {
      setCart(result.data);
      toast.success("Item removed");
    }
  };

  const applyCoupon = async () => {
    const result = await applyCouponAction(couponCode);
    if (result.success && result.data) {
      setCart(result.data);
      toast.success("Coupon applied");
    } else toast.error(result.error);
  };

  if (cart.items.length === 0) {
    return (
      <div className="mt-16 text-center">
        <p className="text-lg text-gray-500">Your cart is empty</p>
        <Button className="mt-4" asChild>
          <Link href="/shop">Continue Shopping</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="mt-8 grid gap-8 lg:grid-cols-3">
      <div className="lg:col-span-2 space-y-4">
        {activeItems.map((item) => (
          <div
            key={item.id}
            className="flex gap-4 rounded-lg border border-gray-100 p-4 dark:border-gray-800"
          >
            <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-md bg-gray-50">
              <Image
                src={item.product.images[0]?.url ?? ""}
                alt={item.product.name}
                fill
                className="object-cover"
              />
            </div>
            <div className="flex flex-1 flex-col">
              <Link href={`/products/${item.product.slug}`} className="font-medium hover:underline">
                {item.product.name}
              </Link>
              <p className="text-sm text-gray-500">{formatPrice(item.product.price)}</p>
              <div className="mt-auto flex items-center gap-4">
                <div className="flex items-center rounded border">
                  <button className="px-2 py-1" onClick={() => updateQty(item.id, item.quantity - 1)}>-</button>
                  <span className="px-3">{item.quantity}</span>
                  <button className="px-2 py-1" onClick={() => updateQty(item.id, item.quantity + 1)}>+</button>
                </div>
                <button
                  className="text-sm text-gray-500 hover:text-[#111827]"
                  onClick={async () => {
                    const r = await saveForLaterAction(item.id);
                    if (r.success && r.data) setCart(r.data);
                  }}
                >
                  Save for later
                </button>
                <button onClick={() => remove(item.id)} className="text-gray-400 hover:text-red-500">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
            <p className="font-semibold">
              {formatPrice(item.product.price * item.quantity)}
            </p>
          </div>
        ))}
        {savedItems.length > 0 && (
          <div className="mt-8">
            <h3 className="font-medium text-gray-500">Saved for Later</h3>
            {savedItems.map((item) => (
              <div key={item.id} className="mt-2 flex gap-4 opacity-60">
                <p>{item.product.name}</p>
                <button onClick={() => updateQty(item.id, item.quantity)} className="text-sm text-[#2563EB]">
                  Move to cart
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="rounded-lg border border-gray-100 bg-[#F9FAFB] p-6 dark:border-gray-800 dark:bg-gray-900">
        <h3 className="font-semibold">Order Summary</h3>
        <dl className="mt-4 space-y-2 text-sm">
          <div className="flex justify-between">
            <dt>Subtotal</dt>
            <dd>{formatPrice(cart.subtotal)}</dd>
          </div>
          {cart.discount > 0 && (
            <div className="flex justify-between text-emerald-600">
              <dt>Discount</dt>
              <dd>-{formatPrice(cart.discount)}</dd>
            </div>
          )}
          <div className="flex justify-between">
            <dt>Shipping</dt>
            <dd>{cart.shipping === 0 ? "Free" : formatPrice(cart.shipping)}</dd>
          </div>
          <div className="flex justify-between">
            <dt>Tax</dt>
            <dd>{formatPrice(cart.tax)}</dd>
          </div>
          <div className="flex justify-between border-t pt-2 text-base font-semibold">
            <dt>Total</dt>
            <dd>{formatPrice(cart.total)}</dd>
          </div>
        </dl>
        <div className="mt-4 flex gap-2">
          <Input
            placeholder="Coupon code"
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value)}
          />
          <Button variant="outline" onClick={applyCoupon}>
            Apply
          </Button>
        </div>
        <Button className="mt-6 w-full" size="lg" asChild>
          <Link href="/checkout">Proceed to Checkout</Link>
        </Button>
      </div>
    </div>
  );
}
