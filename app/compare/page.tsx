"use client";

import { useCompare } from "@/hooks/use-compare";
import { useQuery } from "@tanstack/react-query";
import { productService } from "@/services/product.service";
import { formatPrice } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

export default function ComparePage() {
  const { productIds, remove, clear } = useCompare();

  const { data: products = [] } = useQuery({
    queryKey: ["compare", productIds],
    queryFn: () => productService.compare(productIds),
    enabled: productIds.length > 0,
  });

  if (productIds.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 text-center">
        <h1 className="text-2xl font-semibold">Product Comparison</h1>
        <p className="mt-2 text-gray-500">Add up to 4 products to compare side by side</p>
        <Button className="mt-4" asChild><Link href="/shop">Browse Products</Link></Button>
      </div>
    );
  }

  const specs = products[0]?.specifications
    ? Object.keys(products[0].specifications)
    : [];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 overflow-x-auto">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-semibold">Compare Products</h1>
        <Button variant="outline" onClick={clear}>Clear All</Button>
      </div>
      <table className="w-full min-w-[600px]">
        <thead>
          <tr>
            <th className="p-4 text-left" />
            {products.map((p) => (
              <th key={p.id} className="p-4 text-left align-top">
                <button onClick={() => remove(p.id)} className="float-right text-gray-400 hover:text-red-500">
                  <X className="h-4 w-4" />
                </button>
                <div className="relative mx-auto h-32 w-32">
                  <Image src={p.images[0]?.url ?? ""} alt={p.name} fill className="object-cover rounded" />
                </div>
                <p className="mt-2 font-medium">{p.name}</p>
                <p className="font-semibold">{formatPrice(p.price)}</p>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr className="border-t">
            <td className="p-4 font-medium">Rating</td>
            {products.map((p) => (
              <td key={p.id} className="p-4">{p.rating.toFixed(1)} ({p.reviewCount})</td>
            ))}
          </tr>
          <tr className="border-t">
            <td className="p-4 font-medium">Stock</td>
            {products.map((p) => (
              <td key={p.id} className="p-4">{p.stock > 0 ? "In Stock" : "Out of Stock"}</td>
            ))}
          </tr>
          {specs.map((spec) => (
            <tr key={spec} className="border-t">
              <td className="p-4 font-medium">{spec}</td>
              {products.map((p) => (
                <td key={p.id} className="p-4">{p.specifications?.[spec] ?? "—"}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
