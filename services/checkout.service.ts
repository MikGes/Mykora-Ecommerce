import type { CheckoutData } from "@/types";
import { orderService } from "./order.service";
import { paymentService } from "./payment.service";

export const checkoutService = {
  async processCheckout(
    userId: string | undefined,
    guestEmail: string | undefined,
    data: CheckoutData
  ) {
    const paymentResult = await paymentService.processPayment({
      method: data.paymentMethod,
      amount: 0,
    });

    if (!paymentResult.success) {
      throw new Error(paymentResult.error ?? "Payment failed");
    }

    const order = await orderService.createOrder(userId, guestEmail, data);
    return { order, paymentId: paymentResult.paymentId };
  },

  getShippingMethods() {
    return [
      { id: "standard", name: "Standard Shipping", price: 5.99, days: "3-5 business days" },
      { id: "express", name: "Express Shipping", price: 14.99, days: "1-2 business days" },
      { id: "overnight", name: "Overnight Shipping", price: 29.99, days: "Next business day" },
    ];
  },

  getPaymentMethods() {
    return paymentService.getAvailableMethods();
  },
};
