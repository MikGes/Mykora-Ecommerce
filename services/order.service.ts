import { generateOrderNumber } from "@/lib/utils";
import { getMockOrders } from "@/lib/mock-data";
import type { Address, CheckoutData, Order, OrderStatus } from "@/types";
import { cartService } from "./cart.service";

const orders = new Map<string, Order[]>();

export const orderService = {
  async getOrders(userId: string): Promise<Order[]> {
    if (!orders.has(userId)) {
      orders.set(userId, getMockOrders(userId));
    }
    return orders.get(userId) ?? [];
  },

  async getOrderById(userId: string, orderId: string): Promise<Order | null> {
    const userOrders = await this.getOrders(userId);
    return userOrders.find((o) => o.id === orderId) ?? null;
  },

  async createOrder(
    userId: string | undefined,
    guestEmail: string | undefined,
    checkout: CheckoutData
  ): Promise<Order> {
    const cart = await cartService.getCart(userId);
    const activeItems = cart.items.filter((i) => !i.savedForLater);
    if (activeItems.length === 0) throw new Error("Cart is empty");

    const order: Order = {
      id: `order-${Date.now()}`,
      orderNumber: generateOrderNumber(),
      status: "CONFIRMED",
      subtotal: cart.subtotal,
      tax: cart.tax,
      shipping: cart.shipping,
      discount: cart.discount,
      total: cart.total,
      couponCode: cart.couponCode,
      shippingAddress: checkout.address,
      trackingNumber: undefined,
      giftMessage: checkout.giftMessage,
      giftWrap: checkout.giftWrap ?? false,
      isGift: checkout.isGift ?? false,
      items: activeItems.map((i) => ({
        id: `oi-${Date.now()}-${i.productId}`,
        productId: i.productId,
        name: i.product.name,
        price: i.product.price,
        quantity: i.quantity,
        image: i.product.images[0]?.url,
        variant: i.variantId,
      })),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (userId) {
      const userOrders = await this.getOrders(userId);
      userOrders.unshift(order);
      orders.set(userId, userOrders);
    }

    await cartService.clearCart(userId);
    return order;
  },

  async cancelOrder(userId: string, orderId: string): Promise<Order> {
    const userOrders = await this.getOrders(userId);
    const order = userOrders.find((o) => o.id === orderId);
    if (!order) throw new Error("Order not found");
    if (["SHIPPED", "DELIVERED"].includes(order.status))
      throw new Error("Cannot cancel shipped orders");
    order.status = "CANCELLED";
    order.updatedAt = new Date().toISOString();
    return order;
  },

  async updateStatus(
    orderId: string,
    status: OrderStatus,
    trackingNumber?: string
  ): Promise<void> {
    for (const [, userOrders] of orders) {
      const order = userOrders.find((o) => o.id === orderId);
      if (order) {
        order.status = status;
        if (trackingNumber) order.trackingNumber = trackingNumber;
        order.updatedAt = new Date().toISOString();
        return;
      }
    }
  },

  async getAllOrders(): Promise<Order[]> {
    const all: Order[] = [];
    for (const [, userOrders] of orders) {
      all.push(...userOrders);
    }
    return all.length > 0 ? all : getMockOrders("admin");
  },

  async getPurchaseInsights(userId: string) {
    const userOrders = await this.getOrders(userId);
    const delivered = userOrders.filter((o) => o.status === "DELIVERED");
    const monthlySpending = delivered
      .filter((o) => {
        const d = new Date(o.createdAt);
        const now = new Date();
        return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
      })
      .reduce((s, o) => s + o.total, 0);
    const savings = delivered.reduce((s, o) => s + o.discount, 0);
    const averageOrderValue =
      delivered.length > 0
        ? delivered.reduce((s, o) => s + o.total, 0) / delivered.length
        : 0;
    return {
      monthlySpending,
      savings,
      topCategories: [
        { name: "Electronics", count: 3, amount: 450 },
        { name: "Fashion", count: 2, amount: 280 },
        { name: "Home & Living", count: 1, amount: 120 },
      ],
      averageOrderValue,
    };
  },
};
