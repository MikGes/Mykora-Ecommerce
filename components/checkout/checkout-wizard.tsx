"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatPrice } from "@/lib/utils";
import { processCheckoutAction } from "@/actions/checkout.actions";
import { checkoutService } from "@/services/checkout.service";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import type { Address, Cart } from "@/types";
import { Check } from "lucide-react";

const STEPS = ["Address", "Shipping", "Payment", "Review", "Confirmation"];

interface CheckoutWizardProps {
  cart: Cart;
  addresses: Address[];
  isAuthenticated: boolean;
}

export function CheckoutWizard({ cart, addresses, isAuthenticated }: CheckoutWizardProps) {
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [orderNumber, setOrderNumber] = useState("");
  const router = useRouter();
  const shippingMethods = checkoutService.getShippingMethods();
  const paymentMethods = checkoutService.getPaymentMethods();

  const [form, setForm] = useState({
    firstName: addresses[0]?.firstName ?? "",
    lastName: addresses[0]?.lastName ?? "",
    street: addresses[0]?.street ?? "",
    city: addresses[0]?.city ?? "",
    state: addresses[0]?.state ?? "",
    postalCode: addresses[0]?.postalCode ?? "",
    country: addresses[0]?.country ?? "US",
    phone: addresses[0]?.phone ?? "",
    guestEmail: "",
    shippingMethod: "standard",
    paymentMethod: "card",
    couponCode: cart.couponCode ?? "",
    isGift: false,
    giftMessage: "",
    giftWrap: false,
  });

  const address: Address = {
    id: "checkout",
    firstName: form.firstName,
    lastName: form.lastName,
    street: form.street,
    city: form.city,
    state: form.state,
    postalCode: form.postalCode,
    country: form.country,
    phone: form.phone,
    isDefaultShipping: false,
    isDefaultBilling: false,
  };

  const handlePlaceOrder = async () => {
    setLoading(true);
    const result = await processCheckoutAction({
      address,
      shippingMethod: form.shippingMethod,
      paymentMethod: form.paymentMethod,
      couponCode: form.couponCode,
      isGift: form.isGift,
      giftMessage: form.giftMessage,
      giftWrap: form.giftWrap,
      guestEmail: !isAuthenticated ? form.guestEmail : undefined,
    });
    setLoading(false);
    if (result.success && result.data) {
      setOrderNumber(result.data.order.orderNumber);
      setStep(4);
      toast.success("Order placed successfully!");
    } else {
      toast.error(result.error ?? "Checkout failed.");
    }
  };

  if (step === 4) {
    return (
      <div className="mt-12 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
          <Check className="h-8 w-8 text-emerald-600" />
        </div>
        <h2 className="mt-6 text-2xl font-semibold">Order Confirmed</h2>
        <p className="mt-2 text-gray-500">Order #{orderNumber}</p>
        <p className="mt-4 text-gray-600">Thank you for your purchase. A confirmation email has been sent.</p>
        <div className="mt-8 flex justify-center gap-4">
          <Button onClick={() => router.push("/account/orders")}>View Orders</Button>
          <Button variant="outline" onClick={() => router.push("/shop")}>Continue Shopping</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-8">
      <div className="flex justify-between mb-8">
        {STEPS.slice(0, 4).map((s, i) => (
          <div
            key={s}
            className={`flex-1 text-center text-sm ${
              i <= step ? "text-[#2563EB] font-medium" : "text-gray-400"
            }`}
          >
            <div
              className={`mx-auto mb-2 flex h-8 w-8 items-center justify-center rounded-full text-xs ${
                i <= step ? "bg-[#2563EB] text-white" : "bg-gray-200"
              }`}
            >
              {i + 1}
            </div>
            {s}
          </div>
        ))}
      </div>

      {step === 0 && (
        <div className="space-y-4">
          {!isAuthenticated && (
            <div>
              <Label>Email</Label>
              <Input
                type="email"
                value={form.guestEmail}
                onChange={(e) => setForm({ ...form, guestEmail: e.target.value })}
                required
              />
            </div>
          )}
          <div className="grid grid-cols-2 gap-4">
            <div><Label>First Name</Label><Input value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} /></div>
            <div><Label>Last Name</Label><Input value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} /></div>
          </div>
          <div><Label>Street</Label><Input value={form.street} onChange={(e) => setForm({ ...form, street: e.target.value })} /></div>
          <div className="grid grid-cols-3 gap-4">
            <div><Label>City</Label><Input value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} /></div>
            <div><Label>State</Label><Input value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })} /></div>
            <div><Label>ZIP</Label><Input value={form.postalCode} onChange={(e) => setForm({ ...form, postalCode: e.target.value })} /></div>
          </div>
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={form.isGift} onChange={(e) => setForm({ ...form, isGift: e.target.checked })} />
            This is a gift
          </label>
          {form.isGift && (
            <>
              <div><Label>Gift Message</Label><Input value={form.giftMessage} onChange={(e) => setForm({ ...form, giftMessage: e.target.value })} /></div>
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={form.giftWrap} onChange={(e) => setForm({ ...form, giftWrap: e.target.checked })} />
                Add gift wrap (+$4.99)
              </label>
            </>
          )}
        </div>
      )}

      {step === 1 && (
        <div className="space-y-3">
          {shippingMethods.map((m) => (
            <label key={m.id} className="flex cursor-pointer items-center justify-between rounded-lg border p-4">
              <div className="flex items-center gap-3">
                <input
                  type="radio"
                  name="shipping"
                  checked={form.shippingMethod === m.id}
                  onChange={() => setForm({ ...form, shippingMethod: m.id })}
                />
                <div>
                  <p className="font-medium">{m.name}</p>
                  <p className="text-sm text-gray-500">{m.days}</p>
                </div>
              </div>
              <span>{m.price === 0 ? "Free" : formatPrice(m.price)}</span>
            </label>
          ))}
        </div>
      )}

      {step === 2 && (
        <div className="space-y-3">
          {paymentMethods.map((m) => (
            <label key={m.id} className="flex cursor-pointer items-center gap-3 rounded-lg border p-4">
              <input
                type="radio"
                name="payment"
                checked={form.paymentMethod === m.id}
                onChange={() => setForm({ ...form, paymentMethod: m.id })}
              />
              <span className="font-medium">{m.name}</span>
              <span className="text-xs text-gray-400">via {m.provider}</span>
            </label>
          ))}
          <p className="text-xs text-gray-500 mt-4">
            Payment processing is abstracted for future Stripe/Chapa integration.
          </p>
        </div>
      )}

      {step === 3 && (
        <div className="rounded-lg border p-6">
          <h3 className="font-semibold">Order Summary</h3>
          <dl className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between"><dt>Subtotal</dt><dd>{formatPrice(cart.subtotal)}</dd></div>
            <div className="flex justify-between"><dt>Shipping</dt><dd>{formatPrice(cart.shipping)}</dd></div>
            <div className="flex justify-between"><dt>Tax</dt><dd>{formatPrice(cart.tax)}</dd></div>
            <div className="flex justify-between font-semibold text-base border-t pt-2">
              <dt>Total</dt><dd>{formatPrice(cart.total)}</dd>
            </div>
          </dl>
        </div>
      )}

      <div className="mt-8 flex justify-between">
        {step > 0 && (
          <Button variant="outline" onClick={() => setStep(step - 1)}>Back</Button>
        )}
        <div className="ml-auto">
          {step < 3 ? (
            <Button onClick={() => setStep(step + 1)}>Continue</Button>
          ) : (
            <Button onClick={handlePlaceOrder} disabled={loading}>
              {loading ? "Processing..." : "Place Order"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
