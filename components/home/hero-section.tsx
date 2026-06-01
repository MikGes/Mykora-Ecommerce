import Link from "next/link";
import { Button } from "@/components/ui/button";
import { BRAND } from "@/lib/constants";
import { ArrowRight } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-[#F9FAFB] dark:bg-gray-950">
      <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-medium tracking-wide text-[#2563EB] uppercase">
            Premium E-Commerce
          </p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-[#111827] sm:text-6xl dark:text-white">
            {BRAND.name}
          </h1>
          <p className="mt-2 text-xl text-gray-500">{BRAND.tagline}</p>
          <p className="mx-auto mt-6 max-w-xl text-lg text-gray-600 dark:text-gray-400">
            Discover curated products from world-class brands. Quality you can trust,
            service you deserve.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button size="lg" asChild>
              <Link href="/shop">
                Shop Collection
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/budget">Smart Budget Shopping</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
