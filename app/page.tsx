import { HeroSection } from "@/components/home/hero-section";
import { ProductSection } from "@/components/home/product-section";
import { CategoriesSection } from "@/components/home/categories-section";
import { NewsletterSection } from "@/components/home/newsletter-section";
import { TestimonialsSection } from "@/components/home/testimonials-section";
import { FaqSection } from "@/components/home/faq-section";
import { productService } from "@/services/product.service";
import Image from "next/image";
import Link from "next/link";
import { mockBrands } from "@/lib/mock-data";

export default async function HomePage() {
  const [featured, trending, newArrivals, bestSellers, flashDeals, categories] =
    await Promise.all([
      productService.getFeatured(),
      productService.getTrending(),
      productService.getNewArrivals(),
      productService.getBestSellers(),
      productService.getFlashDeals(),
      productService.getCategories(),
    ]);

  return (
    <>
      <HeroSection />
      <ProductSection
        title="Featured Products"
        subtitle="Handpicked selections from our curators"
        products={featured}
        href="/shop"
      />
      {flashDeals.length > 0 && (
        <section className="bg-[#111827] py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex items-end justify-between">
              <div>
                <h2 className="text-2xl font-semibold text-white">Flash Deals</h2>
                <p className="mt-1 text-gray-400">Limited time offers — act fast</p>
              </div>
              <Link href="/shop?flash=true" className="text-sm text-[#2563EB] hover:underline">
                View all deals
              </Link>
            </div>
            <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
              {flashDeals.map((p) => (
                <Link
                  key={p.id}
                  href={`/products/${p.slug}`}
                  className="rounded-lg bg-gray-800 p-4 transition-colors hover:bg-gray-700"
                >
                  <div className="relative aspect-square">
                    <Image
                      src={p.images[0]?.url ?? ""}
                      alt={p.name}
                      fill
                      className="rounded object-cover"
                      sizes="200px"
                    />
                  </div>
                  <p className="mt-2 line-clamp-2 text-sm text-white">{p.name}</p>
                  <p className="mt-1 font-semibold text-white">${p.price.toFixed(2)}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
      <ProductSection title="Trending Now" products={trending} href="/shop?sort=popularity" />
      <CategoriesSection categories={categories} />
      <ProductSection title="New Arrivals" products={newArrivals} href="/shop?sort=newest" />
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-semibold text-[#111827] dark:text-white">Popular Brands</h2>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-8 md:gap-12">
            {mockBrands.map((brand) => (
              <Link
                key={brand.id}
                href={`/shop?brand=${brand.slug}`}
                className="text-lg font-medium text-gray-400 transition-colors hover:text-[#111827] dark:hover:text-white"
              >
                {brand.name}
              </Link>
            ))}
          </div>
        </div>
      </section>
      <ProductSection title="Best Sellers" products={bestSellers} href="/shop?sort=popularity" />
      <TestimonialsSection />
      <FaqSection />
      <NewsletterSection />
    </>
  );
}
