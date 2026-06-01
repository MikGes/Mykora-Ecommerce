"use client";

import { useCallback, useEffect, useState } from "react";
import { MAX_COMPARE_PRODUCTS } from "@/lib/constants";

const STORAGE_KEY = "mykora_compare";

export function useCompare() {
  const [productIds, setProductIds] = useState<string[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setProductIds(JSON.parse(stored));
    } catch {
      /* ignore */
    }
  }, []);

  const add = useCallback((id: string) => {
    setProductIds((prev) => {
      if (prev.includes(id)) return prev;
      if (prev.length >= MAX_COMPARE_PRODUCTS) return prev;
      const updated = [...prev, id];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const remove = useCallback((id: string) => {
    setProductIds((prev) => {
      const updated = prev.filter((p) => p !== id);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const clear = useCallback(() => {
    setProductIds([]);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  return { productIds, add, remove, clear, count: productIds.length };
}
