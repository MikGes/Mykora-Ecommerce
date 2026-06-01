import { productService } from "@/services/product.service";
import { ProductGrid } from "@/components/products/product-grid";
import { ShopFilters } from "@/components/shop/shop-filters";
import { ShopPagination } from "@/components/shop/shop-pagination";
import type { ProductFilters, SortOption } from "@/types";
import { ITEMS_PER_PAGE } from "@/lib/constants";

interface ShopPageProps {
  searchParams: Promise<{
    q?: string;
    category?: string;
    brand?: string;
    minPrice?: string;
    maxPrice?: string;
    rating?: string;
    inStock?: string;
    sort?: string;
    page?: string;
    flash?: string;
  }>;
}

export const metadata = { title: "Shop" };

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const params = await searchParams;
  const filters: ProductFilters = {
    search: params.q,
    category: params.category,
    brand: params.brand,
    minPrice: params.minPrice ? Number(params.minPrice) : undefined,
    maxPrice: params.maxPrice ? Number(params.maxPrice) : undefined,
    minRating: params.rating ? Number(params.rating) : undefined,
    inStock: params.inStock === "true",
    sort: (params.sort as SortOption) ?? "popularity",
    page: params.page ? Number(params.page) : 1,
    limit: ITEMS_PER_PAGE,
  };

  const [result, categories, brands] = await Promise.all([
    productService.getProducts(filters),
    productService.getCategories(),
    productService.getBrands(),
  ]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold tracking-tight text-[#111827] dark:text-white">
          {params.q ? `Results for "${params.q}"` : "Shop All Products"}
        </h1>
        <p className="mt-1 text-gray-500">{result.total} products</p>
      </div>
      <div className="flex flex-col gap-8 lg:flex-row">
        <aside className="w-full shrink-0 lg:w-64">
          <ShopFilters categories={categories} brands={brands} />
        </aside>
        <div className="flex-1">
          <ProductGrid products={result.data} />
          <ShopPagination
            page={result.page}
            totalPages={result.totalPages}
            hasMore={result.hasMore}
          />
        </div>
      </div>
    </div>
  );
}
