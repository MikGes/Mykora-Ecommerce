"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ShopPaginationProps {
  page: number;
  totalPages: number;
  hasMore: boolean;
}

export function ShopPagination({ page, totalPages, hasMore }: ShopPaginationProps) {
  const searchParams = useSearchParams();

  const buildUrl = (p: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(p));
    return `/shop?${params.toString()}`;
  };

  if (totalPages <= 1) return null;

  return (
    <div className="mt-8 flex items-center justify-center gap-4">
      <Button variant="outline" size="sm" disabled={page <= 1} asChild={page > 1}>
        {page > 1 ? (
          <Link href={buildUrl(page - 1)}>
            <ChevronLeft className="h-4 w-4" /> Previous
          </Link>
        ) : (
          <span>
            <ChevronLeft className="h-4 w-4" /> Previous
          </span>
        )}
      </Button>
      <span className="text-sm text-gray-500">
        Page {page} of {totalPages}
      </span>
      <Button variant="outline" size="sm" disabled={!hasMore} asChild={hasMore}>
        {hasMore ? (
          <Link href={buildUrl(page + 1)}>
            Next <ChevronRight className="h-4 w-4" />
          </Link>
        ) : (
          <span>
            Next <ChevronRight className="h-4 w-4" />
          </span>
        )}
      </Button>
    </div>
  );
}
