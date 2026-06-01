import { mockCoupons } from "@/lib/mock-data";
import type { Coupon } from "@/types";

export const couponService = {
  async getActiveCoupons(): Promise<Coupon[]> {
    return mockCoupons.filter((c) => c.active);
  },

  async getByCode(code: string): Promise<Coupon | null> {
    return (
      mockCoupons.find(
        (c) => c.code.toUpperCase() === code.toUpperCase() && c.active
      ) ?? null
    );
  },

  validateSync(
    code: string,
    subtotal: number
  ): { valid: boolean; discount: number; error?: string } {
    const coupon = mockCoupons.find(
      (c) => c.code.toUpperCase() === code.toUpperCase()
    );
    if (!coupon) return { valid: false, discount: 0, error: "Invalid coupon code" };
    if (!coupon.active) return { valid: false, discount: 0, error: "Coupon is inactive" };
    if (coupon.expiresAt && new Date(coupon.expiresAt) < new Date())
      return { valid: false, discount: 0, error: "Coupon has expired" };
    if (coupon.maxUses && coupon.usedCount >= coupon.maxUses)
      return { valid: false, discount: 0, error: "Coupon usage limit reached" };
    if (coupon.minOrderAmount && subtotal < coupon.minOrderAmount)
      return {
        valid: false,
        discount: 0,
        error: `Minimum order of $${coupon.minOrderAmount} required`,
      };

    let discount = 0;
    switch (coupon.type) {
      case "PERCENTAGE":
        discount = subtotal * (coupon.value / 100);
        break;
      case "FIXED":
        discount = Math.min(coupon.value, subtotal);
        break;
      case "FREE_SHIPPING":
        discount = 0;
        break;
    }
    return { valid: true, discount: Math.round(discount * 100) / 100 };
  },

  async getAll(): Promise<Coupon[]> {
    return mockCoupons;
  },

  async create(data: Omit<Coupon, "id" | "usedCount">): Promise<Coupon> {
    const coupon: Coupon = {
      ...data,
      id: `coup-${Date.now()}`,
      usedCount: 0,
    };
    mockCoupons.push(coupon);
    return coupon;
  },

  async disable(id: string): Promise<void> {
    const coupon = mockCoupons.find((c) => c.id === id);
    if (coupon) coupon.active = false;
  },
};
