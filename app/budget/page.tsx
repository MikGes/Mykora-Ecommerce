"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { budgetSchema } from "@/lib/validators";
import { productService } from "@/services/product.service";
import { ProductGrid } from "@/components/products/product-grid";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Product } from "@/types";

export default function BudgetPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [searched, setSearched] = useState(false);
  const { register, handleSubmit, formState: { isSubmitting } } = useForm({
    resolver: zodResolver(budgetSchema),
  });

  const onSubmit = async (data: { budget: number }) => {
    const results = await productService.getByBudget(data.budget);
    setProducts(results);
    setSearched(true);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-semibold">Smart Budget Shopping</h1>
      <p className="mt-2 text-gray-500">Enter your budget and we&apos;ll recommend products within your range</p>
      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 flex max-w-md gap-4">
        <div className="flex-1">
          <Label>Budget ($)</Label>
          <Input type="number" step="0.01" placeholder="500" {...register("budget", { valueAsNumber: true })} />
        </div>
        <Button type="submit" className="self-end" disabled={isSubmitting}>
          Find Products
        </Button>
      </form>
      {searched && (
        <div className="mt-12">
          <h2 className="text-xl font-semibold mb-6">
            {products.length} products within your budget
          </h2>
          <ProductGrid products={products} />
        </div>
      )}
    </div>
  );
}
