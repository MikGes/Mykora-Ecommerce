import type {
  Brand,
  Bundle,
  Category,
  Coupon,
  Order,
  Product,
  Review,
} from "@/types";

const img = (id: number) =>
  `https://images.unsplash.com/photo-${[
    "1523275335684-37898b6baf30",
    "1505740420928-5e560c06d30e",
    "1526170375885-4d8ecf77b99f",
    "1572635196237-14b490f8493d",
    "1560343090-f0409e92791a",
    "1542291026-7eec264c27ff",
    "1599643477871-682509b1f8b8",
    "1585386657613-0b152a6b72a4",
    "1611319766424-6a6eace48613",
    "1622560481651-0a5b0e5b5b5b",
    "1606107557195-0a0a0a0a0a0a",
    "1608231388442-4473f9c5a8e8",
  ][id % 12]}?w=800&q=80`;

export const mockCategories: Category[] = [
  { id: "cat-1", name: "Electronics", slug: "electronics", description: "Premium tech", image: img(0), productCount: 24 },
  { id: "cat-2", name: "Fashion", slug: "fashion", description: "Curated style", image: img(1), productCount: 36 },
  { id: "cat-3", name: "Home & Living", slug: "home-living", description: "Refined living", image: img(2), productCount: 18 },
  { id: "cat-4", name: "Beauty", slug: "beauty", description: "Self-care essentials", image: img(3), productCount: 15 },
  { id: "cat-5", name: "Sports", slug: "sports", description: "Performance gear", image: img(4), productCount: 12 },
  { id: "cat-6", name: "Accessories", slug: "accessories", description: "Finishing touches", image: img(5), productCount: 20 },
];

export const mockBrands: Brand[] = [
  { id: "brand-1", name: "Auralis", slug: "auralis", logo: img(0) },
  { id: "brand-2", name: "Nordform", slug: "nordform", logo: img(1) },
  { id: "brand-3", name: "Velante", slug: "velante", logo: img(2) },
  { id: "brand-4", name: "Meridian", slug: "meridian", logo: img(3) },
  { id: "brand-5", name: "Crestline", slug: "crestline", logo: img(4) },
  { id: "brand-6", name: "Solstice", slug: "solstice", logo: img(5) },
];

function createProduct(
  i: number,
  overrides: Partial<Product> = {}
): Product {
  const cat = mockCategories[i % mockCategories.length];
  const brand = mockBrands[i % mockBrands.length];
  const basePrice = 29.99 + (i % 20) * 25 + (i % 3) * 50;
  return {
    id: `prod-${i + 1}`,
    name: [
      "Wireless Noise-Cancelling Headphones",
      "Premium Leather Weekender",
      "Smart Fitness Watch Pro",
      "Organic Cotton Essential Tee",
      "Minimalist Desk Lamp",
      "Ceramic Pour-Over Set",
      "Running Shoes Elite",
      "Silk Blend Scarf",
      "Bluetooth Speaker Studio",
      "Wool Blend Overcoat",
      "Ergonomic Office Chair",
      "Stainless Steel Water Bottle",
      "4K Action Camera",
      "Cashmere Crew Sweater",
      "Mechanical Keyboard Pro",
      "Linen Sheet Set",
      "Yoga Mat Premium",
      "Aviator Sunglasses",
      "Portable SSD 1TB",
      "Merino Wool Beanie",
      "Smart Home Hub",
      "Leather Belt Classic",
      "Wireless Earbuds Pro",
      "Ceramic Vase Set",
    ][i % 24],
    slug: `product-${i + 1}`,
    description:
      "Crafted with precision and designed for those who appreciate quality. This product combines exceptional materials with thoughtful engineering to deliver a premium experience that stands the test of time.",
    specifications: {
      Material: "Premium Grade",
      Weight: `${(0.5 + (i % 5) * 0.3).toFixed(1)} kg`,
      Dimensions: `${20 + i % 10} x ${15 + i % 8} x ${5 + i % 5} cm`,
      Warranty: "2 Years",
      Origin: "Designed in USA",
    },
    price: basePrice,
    compareAtPrice: i % 3 === 0 ? basePrice * 1.25 : undefined,
    sku: `MYK-${String(i + 1).padStart(5, "0")}`,
    stock: 5 + (i % 50),
    rating: 3.5 + (i % 15) / 10,
    reviewCount: 12 + (i % 80),
    featured: i < 8,
    trending: i % 4 === 0,
    newArrival: i % 5 === 1,
    bestSeller: i % 3 === 2,
    flashDeal: i % 7 === 0,
    flashDealEnds: i % 7 === 0 ? new Date(Date.now() + 86400000 * 2).toISOString() : undefined,
    categoryId: cat.id,
    categoryName: cat.name,
    categorySlug: cat.slug,
    brandId: brand.id,
    brandName: brand.name,
    brandSlug: brand.slug,
    images: [
      { id: `img-${i}-1`, url: img(i), alt: "Product front", order: 0 },
      { id: `img-${i}-2`, url: img(i + 1), alt: "Product detail", order: 1 },
      { id: `img-${i}-3`, url: img(i + 2), alt: "Product lifestyle", order: 2 },
    ],
    variants: [
      { id: `var-${i}-1`, name: "Color", value: ["Black", "White", "Navy", "Gray"][i % 4], stock: 10 },
      { id: `var-${i}-2`, name: "Size", value: ["S", "M", "L", "XL"][i % 4], stock: 8 },
    ],
    createdAt: new Date(Date.now() - i * 86400000).toISOString(),
    ...overrides,
  };
}

export const mockProducts: Product[] = Array.from({ length: 48 }, (_, i) =>
  createProduct(i, {
    slug: [
      "wireless-headphones",
      "leather-weekender",
      "fitness-watch-pro",
      "cotton-essential-tee",
      "minimalist-desk-lamp",
      "pour-over-set",
      "running-shoes-elite",
      "silk-blend-scarf",
      "bluetooth-speaker",
      "wool-overcoat",
      "ergonomic-chair",
      "water-bottle",
      "action-camera-4k",
      "cashmere-sweater",
      "mechanical-keyboard",
      "linen-sheet-set",
      "yoga-mat-premium",
      "aviator-sunglasses",
      "portable-ssd",
      "merino-beanie",
      "smart-home-hub",
      "leather-belt",
      "wireless-earbuds",
      "ceramic-vase-set",
    ][i % 24] + (i >= 24 ? `-${i}` : ""),
  })
);

export const mockCoupons: Coupon[] = [
  { id: "coup-1", code: "WELCOME15", type: "PERCENTAGE", value: 15, minOrderAmount: 50, maxUses: 1000, usedCount: 234, expiresAt: new Date(Date.now() + 86400000 * 90).toISOString(), active: true },
  { id: "coup-2", code: "SAVE25", type: "FIXED", value: 25, minOrderAmount: 100, maxUses: 500, usedCount: 89, expiresAt: new Date(Date.now() + 86400000 * 30).toISOString(), active: true },
  { id: "coup-3", code: "FREESHIP", type: "FREE_SHIPPING", value: 0, minOrderAmount: 30, maxUses: undefined, usedCount: 1200, active: true },
  { id: "coup-4", code: "VIP20", type: "PERCENTAGE", value: 20, minOrderAmount: 150, maxUses: 100, usedCount: 45, expiresAt: new Date(Date.now() + 86400000 * 14).toISOString(), active: true },
];

export const mockReviews: Review[] = mockProducts.slice(0, 10).flatMap((p, pi) =>
  Array.from({ length: 3 }, (_, ri) => ({
    id: `rev-${pi}-${ri}`,
    rating: 4 + (ri % 2),
    title: ["Excellent quality", "Worth every penny", "Great purchase"][ri],
    content: "Exceeded my expectations. The build quality is outstanding and delivery was fast. Would definitely recommend to anyone looking for premium products.",
    helpful: 5 + ri * 3,
    productId: p.id,
    userId: `user-${ri + 1}`,
    userName: ["Sarah M.", "James K.", "Emily R."][ri],
    createdAt: new Date(Date.now() - (pi * 3 + ri) * 86400000).toISOString(),
  }))
);

export const mockBundles: Bundle[] = [
  {
    id: "bundle-1",
    name: "Work From Home Essentials",
    description: "Everything you need for a productive home office",
    productIds: ["prod-1", "prod-5", "prod-15"],
    products: [],
    discount: 15,
    totalPrice: 0,
    bundlePrice: 0,
  },
  {
    id: "bundle-2",
    name: "Fitness Starter Pack",
    description: "Gear up for your fitness journey",
    productIds: ["prod-3", "prod-7", "prod-17"],
    products: [],
    discount: 20,
    totalPrice: 0,
    bundlePrice: 0,
  },
].map((b) => {
  const products = b.productIds
    .map((id) => mockProducts.find((p) => p.id === id))
    .filter(Boolean) as Product[];
  const totalPrice = products.reduce((s, p) => s + p.price, 0);
  return {
    ...b,
    products,
    totalPrice,
    bundlePrice: totalPrice * (1 - b.discount / 100),
  };
});

export const mockTestimonials = [
  { id: "t1", name: "Alexandra Chen", role: "Creative Director", content: "Mykora has transformed how I shop online. The quality is consistently exceptional, and the experience feels genuinely premium.", rating: 5 },
  { id: "t2", name: "Marcus Williams", role: "Software Engineer", content: "Finally, an e-commerce platform that respects my time. Fast shipping, transparent pricing, and products that match their descriptions.", rating: 5 },
  { id: "t3", name: "Priya Sharma", role: "Marketing Lead", content: "The loyalty program alone makes it worth shopping here. I've saved hundreds while discovering products I actually love.", rating: 5 },
  { id: "t4", name: "David Okonkwo", role: "Entrepreneur", content: "From checkout to delivery, everything is seamless. Mykora sets the standard for what online shopping should be.", rating: 5 },
];

export const mockFaqs = [
  { question: "What is your return policy?", answer: "We offer a 30-day hassle-free return policy on all items. Products must be unused and in original packaging. Return shipping is free for defective items." },
  { question: "How long does shipping take?", answer: "Standard shipping takes 3-5 business days. Express shipping (1-2 days) is available at checkout. Free shipping on orders over $100." },
  { question: "Do you ship internationally?", answer: "Yes, we ship to over 50 countries. International shipping rates and delivery times vary by destination and are calculated at checkout." },
  { question: "How does the loyalty program work?", answer: "Earn 1 point per dollar spent. Silver (0+ pts), Gold (500+ pts), and Platinum (2000+ pts) tiers unlock increasing rewards and exclusive offers." },
  { question: "Is my payment information secure?", answer: "Absolutely. We use industry-standard encryption and never store full payment details. All transactions are processed through PCI-compliant payment providers." },
  { question: "Can I track my order?", answer: "Yes. Once your order ships, you'll receive a tracking number via email and can monitor progress in your account dashboard." },
];

export function getMockOrders(userId: string): Order[] {
  const addr = {
    id: "addr-1",
    firstName: "John",
    lastName: "Doe",
    street: "123 Commerce St",
    city: "San Francisco",
    state: "CA",
    postalCode: "94102",
    country: "US",
    isDefaultShipping: true,
    isDefaultBilling: true,
  };
  return [
    {
      id: "order-1",
      orderNumber: "MYK-L8X2K9-A3F2",
      status: "DELIVERED",
      subtotal: 299.97,
      tax: 24.0,
      shipping: 0,
      discount: 45.0,
      total: 278.97,
      couponCode: "WELCOME15",
      shippingAddress: addr,
      trackingNumber: "1Z999AA10123456784",
      giftWrap: false,
      isGift: false,
      items: mockProducts.slice(0, 3).map((p, i) => ({
        id: `oi-1-${i}`,
        productId: p.id,
        name: p.name,
        price: p.price,
        quantity: 1,
        image: p.images[0]?.url,
      })),
      createdAt: new Date(Date.now() - 86400000 * 14).toISOString(),
      updatedAt: new Date(Date.now() - 86400000 * 7).toISOString(),
    },
    {
      id: "order-2",
      orderNumber: "MYK-M9Y3L0-B4G3",
      status: "SHIPPED",
      subtotal: 149.99,
      tax: 12.0,
      shipping: 5.99,
      discount: 0,
      total: 167.98,
      shippingAddress: addr,
      trackingNumber: "1Z999AA10123456785",
      giftWrap: true,
      isGift: true,
      giftMessage: "Happy Birthday!",
      items: [
        {
          id: "oi-2-0",
          productId: mockProducts[5].id,
          name: mockProducts[5].name,
          price: mockProducts[5].price,
          quantity: 1,
          image: mockProducts[5].images[0]?.url,
        },
      ],
      createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
      updatedAt: new Date(Date.now() - 86400000).toISOString(),
    },
  ];
}
