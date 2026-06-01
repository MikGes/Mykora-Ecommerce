import { mockProducts } from "@/lib/mock-data";
import type { Product } from "@/types";

const wishlists = new Map<string, Set<string>>();

export const wishlistService = {
  async getWishlist(userId: string): Promise<Product[]> {
    const ids = wishlists.get(userId) ?? new Set();
    return Array.from(ids)
      .map((id) => mockProducts.find((p) => p.id === id))
      .filter(Boolean) as Product[];
  },

  async getCount(userId: string): Promise<number> {
    return (wishlists.get(userId) ?? new Set()).size;
  },

  async add(userId: string, productId: string): Promise<Product[]> {
    if (!wishlists.has(userId)) wishlists.set(userId, new Set());
    wishlists.get(userId)!.add(productId);
    return this.getWishlist(userId);
  },

  async remove(userId: string, productId: string): Promise<Product[]> {
    wishlists.get(userId)?.delete(productId);
    return this.getWishlist(userId);
  },

  async isInWishlist(userId: string, productId: string): Promise<boolean> {
    return (wishlists.get(userId) ?? new Set()).has(productId);
  },

  getShareToken(userId: string): string {
    return Buffer.from(`wishlist:${userId}`).toString("base64url");
  },
};
