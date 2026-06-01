"use client";

import Image from "next/image";
import { useState } from "react";
import { Star, Heart, GitCompare, Bell, ShoppingBag, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ProductGrid } from "./product-grid";
import { formatPrice } from "@/lib/utils";
import { addToCartAction } from "@/actions/cart.actions";
import { toggleWishlistAction } from "@/actions/wishlist.actions";
import { togglePriceAlertAction } from "@/actions/price-alert.actions";
import { useRecentlyViewed } from "@/hooks/use-recently-viewed";
import { useCompare } from "@/hooks/use-compare";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import type { Product, Review } from "@/types";
import { useEffect } from "react";

interface ProductDetailProps {
  product: Product;
  reviews: Review[];
  related: Product[];
}

export function ProductDetail({ product, reviews, related }: ProductDetailProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const { addProduct } = useRecentlyViewed();
  const { add: addToCompare, productIds } = useCompare();
  const router = useRouter();

  useEffect(() => {
    addProduct(product);
  }, [product, addProduct]);

  const handleAddToCart = async () => {
    setLoading(true);
    const result = await addToCartAction(product.id, quantity);
    setLoading(false);
    if (result.success) toast.success("Added to cart");
    else toast.error(result.error);
  };

  const handleBuyNow = async () => {
    await handleAddToCart();
    router.push("/checkout");
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="grid gap-12 lg:grid-cols-2">
        <div>
          <div className="relative aspect-square overflow-hidden rounded-lg bg-gray-50">
            <Image
              src={product.images[selectedImage]?.url ?? ""}
              alt={product.name}
              fill
              className="object-cover transition-transform hover:scale-110 duration-300"
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority
            />
          </div>
          <div className="mt-4 flex gap-2">
            {product.images.map((img, i) => (
              <button
                key={img.id}
                onClick={() => setSelectedImage(i)}
                className={`relative h-20 w-20 overflow-hidden rounded-md border-2 ${
                  selectedImage === i ? "border-[#2563EB]" : "border-transparent"
                }`}
              >
                <Image src={img.url} alt="" fill className="object-cover" sizes="80px" />
              </button>
            ))}
          </div>
        </div>

        <div>
          {product.brandName && (
            <p className="text-sm text-gray-500">{product.brandName}</p>
          )}
          <h1 className="mt-1 text-3xl font-semibold text-[#111827] dark:text-white">
            {product.name}
          </h1>
          <div className="mt-2 flex items-center gap-2">
            <div className="flex">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${
                    i < Math.round(product.rating)
                      ? "fill-amber-400 text-amber-400"
                      : "text-gray-200"
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-gray-500">
              {product.rating.toFixed(1)} ({product.reviewCount} reviews)
            </span>
          </div>
          <div className="mt-6 flex items-baseline gap-3">
            <span className="text-3xl font-semibold">{formatPrice(product.price)}</span>
            {product.compareAtPrice && (
              <span className="text-lg text-gray-400 line-through">
                {formatPrice(product.compareAtPrice)}
              </span>
            )}
          </div>
          {product.stock > 0 ? (
            <Badge variant="success" className="mt-2">In Stock ({product.stock})</Badge>
          ) : (
            <Badge variant="destructive" className="mt-2">Out of Stock</Badge>
          )}
          <p className="mt-6 text-gray-600 dark:text-gray-400">{product.description}</p>

          <div className="mt-6 flex items-center gap-4">
            <div className="flex items-center rounded-md border">
              <button
                className="px-3 py-2"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
              >
                -
              </button>
              <span className="px-4 py-2">{quantity}</span>
              <button
                className="px-3 py-2"
                onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
              >
                +
              </button>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <Button size="lg" onClick={handleAddToCart} disabled={loading || product.stock <= 0}>
              <ShoppingBag className="mr-2 h-4 w-4" /> Add to Cart
            </Button>
            <Button size="lg" variant="accent" onClick={handleBuyNow} disabled={product.stock <= 0}>
              <Zap className="mr-2 h-4 w-4" /> Buy Now
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={async () => {
                const r = await toggleWishlistAction(product.id);
                toast[r.success ? "success" : "error"](r.success ? "Wishlist updated" : r.error);
              }}
            >
              <Heart className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => {
                if (productIds.length >= 4 && !productIds.includes(product.id)) {
                  toast.error("Maximum 4 products for comparison");
                  return;
                }
                addToCompare(product.id);
                toast.success("Added to compare");
              }}
            >
              <GitCompare className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={async () => {
                const r = await togglePriceAlertAction(product.id);
                toast[r.success ? "success" : "error"](r.success ? "Price alert set" : r.error);
              }}
            >
              <Bell className="h-4 w-4" />
            </Button>
          </div>

          {product.specifications && (
            <>
              <Separator className="my-8" />
              <h3 className="font-semibold">Specifications</h3>
              <dl className="mt-4 space-y-2">
                {Object.entries(product.specifications).map(([key, value]) => (
                  <div key={key} className="flex justify-between text-sm">
                    <dt className="text-gray-500">{key}</dt>
                    <dd>{value}</dd>
                  </div>
                ))}
              </dl>
            </>
          )}
        </div>
      </div>

      <Separator className="my-12" />
      <section>
        <h2 className="text-xl font-semibold">Customer Reviews</h2>
        <div className="mt-6 space-y-6">
          {reviews.length === 0 ? (
            <p className="text-gray-500">No reviews yet. Be the first to review!</p>
          ) : (
            reviews.map((review) => (
              <div key={review.id} className="border-b border-gray-100 pb-6 dark:border-gray-800">
                <div className="flex items-center gap-2">
                  <div className="flex">
                    {Array.from({ length: review.rating }).map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <span className="font-medium">{review.userName}</span>
                </div>
                {review.title && <p className="mt-1 font-medium">{review.title}</p>}
                <p className="mt-2 text-sm text-gray-600">{review.content}</p>
              </div>
            ))
          )}
        </div>
      </section>

      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="text-xl font-semibold">Related Products</h2>
          <div className="mt-6">
            <ProductGrid products={related} columns={4} />
          </div>
        </section>
      )}
    </div>
  );
}
