import { mockProducts } from "@/lib/mock-data";

const alerts = new Map<string, Set<string>>();

export const priceAlertService = {
  async watch(userId: string, productId: string): Promise<void> {
    if (!alerts.has(userId)) alerts.set(userId, new Set());
    alerts.get(userId)!.add(productId);
  },

  async unwatch(userId: string, productId: string): Promise<void> {
    alerts.get(userId)?.delete(productId);
  },

  async isWatching(userId: string, productId: string): Promise<boolean> {
    return (alerts.get(userId) ?? new Set()).has(productId);
  },

  async getWatchedProducts(userId: string) {
    const ids = alerts.get(userId) ?? new Set();
    return Array.from(ids)
      .map((id) => mockProducts.find((p) => p.id === id))
      .filter(Boolean);
  },
};
