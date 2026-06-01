export type SortOption =
  | "popularity"
  | "newest"
  | "price-asc"
  | "price-desc"
  | "rating";

export type OrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "PROCESSING"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED"
  | "REFUNDED";

export type CouponType = "PERCENTAGE" | "FIXED" | "FREE_SHIPPING";

export type LoyaltyTier = "SILVER" | "GOLD" | "PLATINUM";

export type NotificationType =
  | "ORDER"
  | "DISCOUNT"
  | "COUPON"
  | "WISHLIST"
  | "PRICE_DROP";

export interface ProductImage {
  id: string;
  url: string;
  alt?: string;
  order: number;
}

export interface ProductVariant {
  id: string;
  name: string;
  value: string;
  price?: number;
  stock: number;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  specifications?: Record<string, string>;
  price: number;
  compareAtPrice?: number;
  sku: string;
  stock: number;
  rating: number;
  reviewCount: number;
  featured: boolean;
  trending: boolean;
  newArrival: boolean;
  bestSeller: boolean;
  flashDeal: boolean;
  flashDealEnds?: string;
  categoryId: string;
  categoryName?: string;
  categorySlug?: string;
  brandId?: string;
  brandName?: string;
  brandSlug?: string;
  images: ProductImage[];
  variants: ProductVariant[];
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  productCount?: number;
}

export interface Brand {
  id: string;
  name: string;
  slug: string;
  logo?: string;
}

export interface Review {
  id: string;
  rating: number;
  title?: string;
  content: string;
  helpful: number;
  productId: string;
  userId: string;
  userName: string;
  userImage?: string;
  createdAt: string;
}

export interface Question {
  id: string;
  question: string;
  answer?: string;
  productId: string;
  userId: string;
  userName: string;
  createdAt: string;
}

export interface CartItem {
  id: string;
  productId: string;
  product: Product;
  quantity: number;
  savedForLater: boolean;
  variantId?: string;
}

export interface Cart {
  id: string;
  items: CartItem[];
  couponCode?: string;
  subtotal: number;
  discount: number;
  tax: number;
  shipping: number;
  total: number;
}

export interface Coupon {
  id: string;
  code: string;
  type: CouponType;
  value: number;
  minOrderAmount?: number;
  maxUses?: number;
  usedCount: number;
  expiresAt?: string;
  active: boolean;
}

export interface Address {
  id: string;
  label?: string;
  firstName: string;
  lastName: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone?: string;
  isDefaultShipping: boolean;
  isDefaultBilling: boolean;
}

export interface OrderItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  variant?: string;
  image?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  subtotal: number;
  tax: number;
  shipping: number;
  discount: number;
  total: number;
  couponCode?: string;
  shippingAddress: Address;
  trackingNumber?: string;
  giftMessage?: string;
  giftWrap: boolean;
  isGift: boolean;
  items: OrderItem[];
  createdAt: string;
  updatedAt: string;
}

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  link?: string;
  createdAt: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  image?: string;
  role: "USER" | "ADMIN";
  loyaltyTier: LoyaltyTier;
  loyaltyPoints: number;
  emailVerified: boolean;
}

export interface DashboardStats {
  totalOrders: number;
  loyaltyPoints: number;
  activeCoupons: number;
  wishlistCount: number;
  addressCount: number;
}

export interface PurchaseInsights {
  monthlySpending: number;
  savings: number;
  topCategories: { name: string; count: number; amount: number }[];
  averageOrderValue: number;
}

export interface ProductFilters {
  search?: string;
  category?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  inStock?: boolean;
  sort?: SortOption;
  page?: number;
  limit?: number;
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  totalPages: number;
  hasMore: boolean;
}

export interface Bundle {
  id: string;
  name: string;
  description?: string;
  productIds: string[];
  products: Product[];
  discount: number;
  totalPrice: number;
  bundlePrice: number;
}

export interface AuditLogEntry {
  id: string;
  action: string;
  entity?: string;
  entityId?: string;
  userId?: string;
  userName?: string;
  ipAddress?: string;
  createdAt: string;
}

export interface AdminStats {
  revenue: number;
  orders: number;
  customers: number;
  products: number;
  conversionRate: number;
  revenueByMonth: { month: string; revenue: number }[];
  topProducts: { name: string; sales: number; revenue: number }[];
  topCustomers: { name: string; orders: number; spent: number }[];
  categoryPerformance: { name: string; revenue: number; percentage: number }[];
}

export interface CheckoutData {
  address: Address;
  shippingMethod: string;
  paymentMethod: string;
  couponCode?: string;
  isGift?: boolean;
  giftMessage?: string;
  giftWrap?: boolean;
  guestEmail?: string;
}

export interface ActionResult<T = void> {
  success: boolean;
  data?: T;
  error?: string;
}
