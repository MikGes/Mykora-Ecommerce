import Link from "next/link";
import { ProductGrid } from "@/components/products/product-grid";
import type { Product } from "@/types";
import { ArrowRight } from "lucide-react";

interface ProductSectionProps {
  title: string;
  subtitle?: string;
  products: Product[];
  href: string;
}

export function ProductSection({ title, subtitle, products, href }: ProductSectionProps) {
  return (
    <section className="py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-[#111827] dark:text-white">
              {title}
            </h2>
            {subtitle && <p className="mt-1 text-gray-500">{subtitle}</p>}
          </div>
          <Link
            href={href}
            className="flex items-center gap-1 text-sm font-medium text-[#2563EB] hover:underline"
          >
            View all <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="mt-8">
          <ProductGrid products={products} />
        </div>
      </div>
    </section>
  );
}
