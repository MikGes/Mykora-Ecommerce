"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SORT_OPTIONS } from "@/lib/constants";
import type { Brand, Category } from "@/types";

interface ShopFiltersProps {
  categories: Category[];
  brands: Brand[];
}

export function ShopFilters({ categories, brands }: ShopFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const updateParam = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    params.delete("page");
    router.push(`/shop?${params.toString()}`);
  };

  return (
    <div className="space-y-6 rounded-lg border border-gray-100 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
      <div>
        <Label>Sort By</Label>
        <select
          className="mt-2 w-full rounded-md border border-gray-200 px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-900"
          value={searchParams.get("sort") ?? "popularity"}
          onChange={(e) => updateParam("sort", e.target.value)}
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
      <div>
        <Label>Category</Label>
        <select
          className="mt-2 w-full rounded-md border border-gray-200 px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-900"
          value={searchParams.get("category") ?? ""}
          onChange={(e) => updateParam("category", e.target.value)}
        >
          <option value="">All Categories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.slug}>
              {c.name}
            </option>
          ))}
        </select>
      </div>
      <div>
        <Label>Brand</Label>
        <select
          className="mt-2 w-full rounded-md border border-gray-200 px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-900"
          value={searchParams.get("brand") ?? ""}
          onChange={(e) => updateParam("brand", e.target.value)}
        >
          <option value="">All Brands</option>
          {brands.map((b) => (
            <option key={b.id} value={b.slug}>
              {b.name}
            </option>
          ))}
        </select>
      </div>
      <div>
        <Label>Price Range</Label>
        <div className="mt-2 flex gap-2">
          <Input
            type="number"
            placeholder="Min"
            defaultValue={searchParams.get("minPrice") ?? ""}
            onBlur={(e) => updateParam("minPrice", e.target.value)}
          />
          <Input
            type="number"
            placeholder="Max"
            defaultValue={searchParams.get("maxPrice") ?? ""}
            onBlur={(e) => updateParam("maxPrice", e.target.value)}
          />
        </div>
      </div>
      <div>
        <Label>Minimum Rating</Label>
        <select
          className="mt-2 w-full rounded-md border border-gray-200 px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-900"
          value={searchParams.get("rating") ?? ""}
          onChange={(e) => updateParam("rating", e.target.value)}
        >
          <option value="">Any</option>
          <option value="4">4+ Stars</option>
          <option value="3">3+ Stars</option>
        </select>
      </div>
      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={searchParams.get("inStock") === "true"}
          onChange={(e) => updateParam("inStock", e.target.checked ? "true" : "")}
        />
        In stock only
      </label>
      <Button
        variant="outline"
        className="w-full"
        onClick={() => router.push("/shop")}
      >
        Clear Filters
      </Button>
    </div>
  );
}
