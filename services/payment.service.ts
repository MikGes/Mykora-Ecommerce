export interface PaymentRequest {
  method: string;
  amount: number;
  currency?: string;
  metadata?: Record<string, string>;
}

export interface PaymentResult {
  success: boolean;
  paymentId?: string;
  error?: string;
}

export const paymentService = {
  getAvailableMethods() {
    return [
      { id: "card", name: "Credit / Debit Card", provider: "stripe" },
      { id: "paypal", name: "PayPal", provider: "paypal" },
      { id: "chapa", name: "Chapa", provider: "chapa" },
    ];
  },

  async processPayment(request: PaymentRequest): Promise<PaymentResult> {
    // Abstracted for future Stripe/Chapa integration
    await new Promise((r) => setTimeout(r, 500));
    if (!request.method) {
      return { success: false, error: "Payment method required" };
    }
    return {
      success: true,
      paymentId: `pay_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    };
  },

  async refund(paymentId: string, amount: number): Promise<PaymentResult> {
    await new Promise((r) => setTimeout(r, 300));
    return { success: true, paymentId: `refund_${paymentId}` };
  },
};
