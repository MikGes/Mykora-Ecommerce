"use client";

import { useCallback, useEffect, useState } from "react";
import type { Product } from "@/types";

const STORAGE_KEY = "mykora_recently_viewed";

interface ViewedItem {
  product: Product;
  viewedAt: string;
}

export function useRecentlyViewed() {
  const [items, setItems] = useState<ViewedItem[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setItems(JSON.parse(stored));
    } catch {
      /* ignore */
    }
  }, []);

  const addProduct = useCallback((product: Product) => {
    setItems((prev) => {
      const filtered = prev.filter((i) => i.product.id !== product.id);
      const updated = [
        { product, viewedAt: new Date().toISOString() },
        ...filtered,
      ].slice(0, 20);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const grouped = {
    today: items.filter((i) => isToday(i.viewedAt)),
    yesterday: items.filter((i) => isYesterday(i.viewedAt)),
    lastWeek: items.filter((i) => isLastWeek(i.viewedAt)),
    earlier: items.filter(
      (i) =>
        !isToday(i.viewedAt) &&
        !isYesterday(i.viewedAt) &&
        !isLastWeek(i.viewedAt)
    ),
  };

  return { items, grouped, addProduct };
}

function isToday(date: string) {
  const d = new Date(date);
  const now = new Date();
  return d.toDateString() === now.toDateString();
}

function isYesterday(date: string) {
  const d = new Date(date);
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return d.toDateString() === yesterday.toDateString();
}

function isLastWeek(date: string) {
  const d = new Date(date);
  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);
  return d > weekAgo && !isToday(date) && !isYesterday(date);
}
