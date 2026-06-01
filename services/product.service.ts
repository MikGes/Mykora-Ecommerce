import { ITEMS_PER_PAGE } from "@/lib/constants";
import {
  mockBrands,
  mockCategories,
  mockProducts,
  mockReviews,
} from "@/lib/mock-data";
import type {
  PaginatedResult,
  Product,
  ProductFilters,
  Review,
} from "@/types";

function sortProducts(products: Product[], sort?: string): Product[] {
  const sorted = [...products];
  switch (sort) {
    case "price-asc":
      return sorted.sort((a, b) => a.price - b.price);
    case "price-desc":
      return sorted.sort((a, b) => b.price - a.price);
    case "rating":
      return sorted.sort((a, b) => b.rating - a.rating);
    case "newest":
      return sorted.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    default:
      return sorted.sort((a, b) => b.reviewCount - a.reviewCount);
  }
}

function filterProducts(
  products: Product[],
  filters: ProductFilters
): Product[] {
  return products.filter((p) => {
    if (filters.search) {
      const q = filters.search.toLowerCase();
      if (
        !p.name.toLowerCase().includes(q) &&
        !p.description.toLowerCase().includes(q)
      )
        return false;
    }
    if (filters.category && p.categorySlug !== filters.category) return false;
    if (filters.brand && p.brandSlug !== filters.brand) return false;
    if (filters.minPrice !== undefined && p.price < filters.minPrice)
      return false;
    if (filters.maxPrice !== undefined && p.price > filters.maxPrice)
      return false;
    if (filters.minRating !== undefined && p.rating < filters.minRating)
      return false;
    if (filters.inStock && p.stock <= 0) return false;
    return true;
  });
}

export const productService = {
  async getProducts(
    filters: ProductFilters = {}
  ): Promise<PaginatedResult<Product>> {
    const page = filters.page ?? 1;
    const limit = filters.limit ?? ITEMS_PER_PAGE;
    const filtered = sortProducts(
      filterProducts(mockProducts, filters),
      filters.sort
    );
    const total = filtered.length;
    const totalPages = Math.ceil(total / limit);
    const start = (page - 1) * limit;
    return {
      data: filtered.slice(start, start + limit),
      total,
      page,
      totalPages,
      hasMore: page < totalPages,
    };
  },

  async getProductBySlug(slug: string): Promise<Product | null> {
    return mockProducts.find((p) => p.slug === slug) ?? null;
  },

  async getProductById(id: string): Promise<Product | null> {
    return mockProducts.find((p) => p.id === id) ?? null;
  },

  async getFeatured(): Promise<Product[]> {
    return mockProducts.filter((p) => p.featured).slice(0, 8);
  },

  async getTrending(): Promise<Product[]> {
    return mockProducts.filter((p) => p.trending).slice(0, 8);
  },

  async getNewArrivals(): Promise<Product[]> {
    return mockProducts.filter((p) => p.newArrival).slice(0, 8);
  },

  async getBestSellers(): Promise<Product[]> {
    return mockProducts.filter((p) => p.bestSeller).slice(0, 8);
  },

  async getFlashDeals(): Promise<Product[]> {
    return mockProducts.filter((p) => p.flashDeal).slice(0, 6);
  },

  async getRelated(productId: string, limit = 4): Promise<Product[]> {
    const product = mockProducts.find((p) => p.id === productId);
    if (!product) return [];
    return mockProducts
      .filter(
        (p) => p.categoryId === product.categoryId && p.id !== productId
      )
      .slice(0, limit);
  },

  async getByBudget(budget: number): Promise<Product[]> {
    return mockProducts
      .filter((p) => p.price <= budget && p.stock > 0)
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 12);
  },

  async getReviews(productId: string): Promise<Review[]> {
    return mockReviews.filter((r) => r.productId === productId);
  },

  async getCategories() {
    return mockCategories;
  },

  async getBrands() {
    return mockBrands;
  },

  async search(query: string, limit = 8): Promise<Product[]> {
    const q = query.toLowerCase();
    return mockProducts
      .filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.brandName?.toLowerCase().includes(q)
      )
      .slice(0, limit);
  },

  async compare(productIds: string[]): Promise<Product[]> {
    return productIds
      .map((id) => mockProducts.find((p) => p.id === id))
      .filter(Boolean) as Product[];
  },
};
