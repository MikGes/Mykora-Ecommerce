export const BRAND = {
  name: "Mykora",
  tagline: "Shop Smarter. Live Better.",
  colors: {
    primary: "#111827",
    secondary: "#374151",
    accent: "#2563EB",
    background: "#FFFFFF",
    surface: "#F9FAFB",
    success: "#10B981",
    danger: "#EF4444",
  },
} as const;

export const LOYALTY_TIERS = {
  SILVER: { minPoints: 0, multiplier: 1 },
  GOLD: { minPoints: 500, multiplier: 1.5 },
  PLATINUM: { minPoints: 2000, multiplier: 2 },
} as const;

export const SORT_OPTIONS = [
  { value: "popularity", label: "Popularity" },
  { value: "newest", label: "Newest" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "rating", label: "Highest Rated" },
] as const;

export const ORDER_STATUS_LABELS: Record<string, string> = {
  PENDING: "Pending",
  CONFIRMED: "Confirmed",
  PROCESSING: "Processing",
  SHIPPED: "Shipped",
  DELIVERED: "Delivered",
  CANCELLED: "Cancelled",
  REFUNDED: "Refunded",
};

export const ITEMS_PER_PAGE = 12;
export const MAX_COMPARE_PRODUCTS = 4;
export const RATE_LIMIT_WINDOW_MS = 60_000;
export const RATE_LIMIT_MAX_REQUESTS = 100;
