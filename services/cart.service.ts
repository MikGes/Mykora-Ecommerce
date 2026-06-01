import {
  calculateShipping,
  calculateTax,
} from "@/lib/utils";
import { mockProducts } from "@/lib/mock-data";
import { couponService } from "./coupon.service";
import type { Cart, CartItem } from "@/types";

const carts = new Map<string, Cart>();

function getCartKey(userId?: string, guestId?: string) {
  return userId ?? guestId ?? "default-guest";
}

function computeCartTotals(
  items: CartItem[],
  couponCode?: string
): Omit<Cart, "id" | "items" | "couponCode"> {
  const activeItems = items.filter((i) => !i.savedForLater);
  const subtotal = activeItems.reduce(
    (sum, i) => sum + i.product.price * i.quantity,
    0
  );
  let discount = 0;
  if (couponCode) {
    const result = couponService.validateSync(couponCode, subtotal);
    if (result.valid) discount = result.discount;
  }
  const afterDiscount = subtotal - discount;
  const tax = calculateTax(afterDiscount);
  const shipping =
    couponCode === "FREESHIP" && subtotal >= 30
      ? 0
      : calculateShipping(afterDiscount);
  const total = afterDiscount + tax + shipping;
  return { subtotal, discount, tax, shipping, total };
}

export const cartService = {
  async getCart(userId?: string, guestId?: string): Promise<Cart> {
    const key = getCartKey(userId, guestId);
    const existing = carts.get(key);
    if (existing) return existing;

    const empty: Cart = {
      id: `cart-${key}`,
      items: [],
      subtotal: 0,
      discount: 0,
      tax: 0,
      shipping: 0,
      total: 0,
    };
    carts.set(key, empty);
    return empty;
  },

  async addItem(
    productId: string,
    quantity = 1,
    userId?: string,
    guestId?: string,
    variantId?: string
  ): Promise<Cart> {
    const key = getCartKey(userId, guestId);
    const cart = await this.getCart(userId, guestId);
    const product = mockProducts.find((p) => p.id === productId);
    if (!product) throw new Error("Product not found");
    if (product.stock < quantity) throw new Error("Insufficient stock");

    const existingIndex = cart.items.findIndex(
      (i) => i.productId === productId && i.variantId === variantId
    );

    if (existingIndex >= 0) {
      cart.items[existingIndex].quantity += quantity;
    } else {
      cart.items.push({
        id: `ci-${Date.now()}`,
        productId,
        product,
        quantity,
        savedForLater: false,
        variantId,
      });
    }

    const totals = computeCartTotals(cart.items, cart.couponCode);
    const updated = { ...cart, ...totals };
    carts.set(key, updated);
    return updated;
  },

  async updateQuantity(
    itemId: string,
    quantity: number,
    userId?: string,
    guestId?: string
  ): Promise<Cart> {
    const key = getCartKey(userId, guestId);
    const cart = await this.getCart(userId, guestId);
    const item = cart.items.find((i) => i.id === itemId);
    if (!item) throw new Error("Item not found");
    if (quantity <= 0) {
      cart.items = cart.items.filter((i) => i.id !== itemId);
    } else {
      item.quantity = quantity;
    }
    const totals = computeCartTotals(cart.items, cart.couponCode);
    const updated = { ...cart, ...totals };
    carts.set(key, updated);
    return updated;
  },

  async removeItem(
    itemId: string,
    userId?: string,
    guestId?: string
  ): Promise<Cart> {
    const key = getCartKey(userId, guestId);
    const cart = await this.getCart(userId, guestId);
    cart.items = cart.items.filter((i) => i.id !== itemId);
    const totals = computeCartTotals(cart.items, cart.couponCode);
    const updated = { ...cart, ...totals };
    carts.set(key, updated);
    return updated;
  },

  async saveForLater(
    itemId: string,
    userId?: string,
    guestId?: string
  ): Promise<Cart> {
    const key = getCartKey(userId, guestId);
    const cart = await this.getCart(userId, guestId);
    const item = cart.items.find((i) => i.id === itemId);
    if (item) item.savedForLater = true;
    const totals = computeCartTotals(cart.items, cart.couponCode);
    const updated = { ...cart, ...totals };
    carts.set(key, updated);
    return updated;
  },

  async applyCoupon(
    code: string,
    userId?: string,
    guestId?: string
  ): Promise<{ cart: Cart; error?: string }> {
    const key = getCartKey(userId, guestId);
    const cart = await this.getCart(userId, guestId);
    const activeSubtotal = cart.items
      .filter((i) => !i.savedForLater)
      .reduce((s, i) => s + i.product.price * i.quantity, 0);
    const result = couponService.validateSync(code, activeSubtotal);
    if (!result.valid) return { cart, error: result.error };
    cart.couponCode = code.toUpperCase();
    const totals = computeCartTotals(cart.items, cart.couponCode);
    const updated = { ...cart, ...totals };
    carts.set(key, updated);
    return { cart: updated };
  },

  async clearCart(userId?: string, guestId?: string): Promise<Cart> {
    const key = getCartKey(userId, guestId);
    const empty: Cart = {
      id: `cart-${key}`,
      items: [],
      subtotal: 0,
      discount: 0,
      tax: 0,
      shipping: 0,
      total: 0,
    };
    carts.set(key, empty);
    return empty;
  },

  getItemCount(cart: Cart): number {
    return cart.items
      .filter((i) => !i.savedForLater)
      .reduce((s, i) => s + i.quantity, 0);
  },
};
