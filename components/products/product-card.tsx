"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatPrice, cn } from "@/lib/utils";
import type { Product } from "@/types";
import { addToCartAction } from "@/actions/cart.actions";
import { toggleWishlistAction } from "@/actions/wishlist.actions";
import { toast } from "sonner";
import { useState } from "react";

interface ProductCardProps {
  product: Product;
  className?: string;
}

export function ProductCard({ product, className }: ProductCardProps) {
  const [loading, setLoading] = useState(false);
  const discount = product.compareAtPrice
    ? Math.round((1 - product.price / product.compareAtPrice) * 100)
    : 0;

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    setLoading(true);
    const result = await addToCartAction(product.id);
    setLoading(false);
    if (result.success) toast.success("Added to cart");
    else toast.error(result.error ?? "Failed to add");
  };

  const handleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    const result = await toggleWishlistAction(product.id);
    if (result.success) toast.success("Wishlist updated");
    else toast.error(result.error ?? "Sign in required");
  };

  return (
    <Link
      href={`/products/${product.slug}`}
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-lg border border-gray-100 bg-white transition-shadow hover:shadow-md dark:border-gray-800 dark:bg-gray-900",
        className
      )}
    >
      <div className="relative aspect-square overflow-hidden bg-gray-50">
        <Image
          src={product.images[0]?.url ?? "/placeholder.png"}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 768px) 50vw, 25vw"
        />
        {product.flashDeal && (
          <Badge variant="destructive" className="absolute left-3 top-3">
            Flash Deal
          </Badge>
        )}
        {discount > 0 && !product.flashDeal && (
          <Badge variant="accent" className="absolute left-3 top-3">
            -{discount}%
          </Badge>
        )}
        <button
          onClick={handleWishlist}
          className="absolute right-3 top-3 rounded-full bg-white/90 p-2 opacity-0 transition-opacity group-hover:opacity-100"
          aria-label="Add to wishlist"
        >
          <Heart className="h-4 w-4" />
        </button>
      </div>
      <div className="flex flex-1 flex-col p-4">
        {product.brandName && (
          <p className="text-xs text-gray-500">{product.brandName}</p>
        )}
        <h3 className="mt-1 line-clamp-2 text-sm font-medium text-[#111827] dark:text-white">
          {product.name}
        </h3>
        <div className="mt-1 flex items-center gap-1">
          <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
          <span className="text-xs text-gray-500">
            {product.rating.toFixed(1)} ({product.reviewCount})
          </span>
        </div>
        <div className="mt-auto flex items-center justify-between pt-3">
          <div className="flex items-baseline gap-2">
            <span className="font-semibold text-[#111827] dark:text-white">
              {formatPrice(product.price)}
            </span>
            {product.compareAtPrice && (
              <span className="text-sm text-gray-400 line-through">
                {formatPrice(product.compareAtPrice)}
              </span>
            )}
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={handleAddToCart}
            disabled={loading || product.stock <= 0}
          >
            {product.stock <= 0 ? "Sold Out" : "Add"}
          </Button>
        </div>
      </div>
    </Link>
  );
}
