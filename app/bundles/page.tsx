import { bundleService } from "@/services/bundle.service";
import Image from "next/image";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export const metadata = { title: "Bundle Builder" };

export default async function BundlesPage() {
  const bundles = await bundleService.getBundles();

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-semibold">Bundle Deals</h1>
      <p className="mt-2 text-gray-500">Save more when you buy curated product bundles</p>
      <div className="mt-12 grid gap-8 md:grid-cols-2">
        {bundles.map((bundle) => (
          <div key={bundle.id} className="rounded-lg border border-gray-100 p-6 dark:border-gray-800">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-xl font-semibold">{bundle.name}</h2>
                <p className="mt-1 text-gray-500">{bundle.description}</p>
              </div>
              <Badge variant="accent">{bundle.discount}% off</Badge>
            </div>
            <div className="mt-6 flex gap-2">
              {bundle.products.map((p) => (
                <div key={p.id} className="relative h-20 w-20 overflow-hidden rounded bg-gray-50">
                  <Image src={p.images[0]?.url ?? ""} alt={p.name} fill className="object-cover" />
                </div>
              ))}
            </div>
            <div className="mt-6 flex items-baseline gap-3">
              <span className="text-2xl font-semibold">{formatPrice(bundle.bundlePrice)}</span>
              <span className="text-gray-400 line-through">{formatPrice(bundle.totalPrice)}</span>
            </div>
            <Button className="mt-4" asChild>
              <Link href="/cart">Add Bundle to Cart</Link>
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
