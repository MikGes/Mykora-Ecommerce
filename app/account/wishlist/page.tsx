import { auth } from "@/lib/auth";
import { wishlistService } from "@/services/wishlist.service";
import { ProductGrid } from "@/components/products/product-grid";

export const metadata = { title: "Wishlist" };

export default async function WishlistPage() {
  const session = await auth();
  if (!session?.user?.id) return null;
  const products = await wishlistService.getWishlist(session.user.id);
  const shareToken = wishlistService.getShareToken(session.user.id);

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Wishlist</h1>
        {products.length > 0 && (
          <p className="text-sm text-gray-500">
            Share: /wishlist/{shareToken}
          </p>
        )}
      </div>
      <div className="mt-8">
        <ProductGrid products={products} />
      </div>
    </div>
  );
}
