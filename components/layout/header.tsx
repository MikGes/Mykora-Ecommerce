"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { useTheme } from "next-themes";
import {
  Search,
  ShoppingBag,
  Heart,
  User,
  Menu,
  Sun,
  Moon,
  Bell,
  GitCompare,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { BRAND } from "@/lib/constants";
import { useState } from "react";
import { useRouter } from "next/navigation";

export function Header() {
  const { data: session } = useSession();
  const { theme, setTheme } = useTheme();
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/shop?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery("");
    }
  };

  return (
    <header className="sticky top-0 z-50 border-b border-gray-100 bg-white/80 backdrop-blur-md dark:border-gray-800 dark:bg-gray-950/80">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl font-semibold tracking-tight text-[#111827] dark:text-white">
              {BRAND.name}
            </span>
          </Link>
          <nav className="hidden items-center gap-6 md:flex">
            <Link href="/shop" className="text-sm text-gray-600 hover:text-[#111827] dark:text-gray-300 dark:hover:text-white">
              Shop
            </Link>
            <Link href="/shop?sort=newest" className="text-sm text-gray-600 hover:text-[#111827] dark:text-gray-300 dark:hover:text-white">
              New Arrivals
            </Link>
            <Link href="/bundles" className="text-sm text-gray-600 hover:text-[#111827] dark:text-gray-300 dark:hover:text-white">
              Bundles
            </Link>
            <Link href="/budget" className="text-sm text-gray-600 hover:text-[#111827] dark:text-gray-300 dark:hover:text-white">
              Smart Budget
            </Link>
          </nav>
        </div>

        <div className="flex flex-1 items-center justify-center px-4">
          {searchOpen ? (
            <form onSubmit={handleSearch} className="w-full max-w-md">
              <input
                autoFocus
                type="search"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onBlur={() => !searchQuery && setSearchOpen(false)}
                className="w-full rounded-md border border-gray-200 bg-gray-50 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB] dark:border-gray-700 dark:bg-gray-900"
              />
            </form>
          ) : (
            <button
              onClick={() => setSearchOpen(true)}
              className="hidden items-center gap-2 rounded-md border border-gray-200 bg-gray-50 px-4 py-2 text-sm text-gray-500 hover:bg-gray-100 md:flex dark:border-gray-700 dark:bg-gray-900 dark:text-gray-400 w-full max-w-md"
            >
              <Search className="h-4 w-4" />
              Search products...
            </button>
          )}
        </div>

        <div className="flex items-center gap-1 sm:gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
          <Button variant="ghost" size="icon" asChild>
            <Link href="/compare" aria-label="Compare products">
              <GitCompare className="h-5 w-5" />
            </Link>
          </Button>
          <Button variant="ghost" size="icon" asChild>
            <Link href="/account/wishlist" aria-label="Wishlist">
              <Heart className="h-5 w-5" />
            </Link>
          </Button>
          {session && (
            <Button variant="ghost" size="icon" asChild>
              <Link href="/account/notifications" aria-label="Notifications">
                <Bell className="h-5 w-5" />
              </Link>
            </Button>
          )}
          <Button variant="ghost" size="icon" asChild>
            <Link href="/cart" aria-label="Cart">
              <ShoppingBag className="h-5 w-5" />
            </Link>
          </Button>
          <Button variant="ghost" size="icon" asChild>
            <Link href={session ? "/account" : "/login"} aria-label="Account">
              <User className="h-5 w-5" />
            </Link>
          </Button>
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
}
