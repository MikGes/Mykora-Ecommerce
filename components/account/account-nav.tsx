"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { logoutAction } from "@/actions/auth.actions";
import { useRouter } from "next/navigation";
import type { UserProfile } from "@/types";
import {
  LayoutDashboard,
  Package,
  Heart,
  MapPin,
  Bell,
  User,
  BarChart3,
  LogOut,
} from "lucide-react";

const links = [
  { href: "/account", label: "Dashboard", icon: LayoutDashboard },
  { href: "/account/orders", label: "Orders", icon: Package },
  { href: "/account/wishlist", label: "Wishlist", icon: Heart },
  { href: "/account/addresses", label: "Addresses", icon: MapPin },
  { href: "/account/notifications", label: "Notifications", icon: Bell },
  { href: "/account/profile", label: "Profile", icon: User },
  { href: "/account/insights", label: "Insights", icon: BarChart3 },
];

interface AccountNavProps {
  user: UserProfile;
}

export function AccountNav({ user }: AccountNavProps) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await logoutAction();
    router.push("/");
    router.refresh();
  };

  return (
    <nav className="space-y-1">
      <div className="mb-6 px-3">
        <p className="font-semibold text-[#111827] dark:text-white">{user.name}</p>
        <p className="text-sm text-gray-500">{user.email}</p>
        <p className="mt-1 text-xs text-[#2563EB] capitalize">{user.loyaltyTier} · {user.loyaltyPoints} pts</p>
      </div>
      {links.map((link) => {
        const Icon = link.icon;
        const active = pathname === link.href;
        return (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
              active
                ? "bg-[#111827] text-white"
                : "text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
            )}
          >
            <Icon className="h-4 w-4" />
            {link.label}
          </Link>
        );
      })}
      {user.role === "ADMIN" && (
        <Link
          href="/admin"
          className="flex items-center gap-3 rounded-md px-3 py-2 text-sm text-[#2563EB] hover:bg-blue-50"
        >
          Admin Panel
        </Link>
      )}
      <button
        onClick={handleLogout}
        className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm text-red-600 hover:bg-red-50"
      >
        <LogOut className="h-4 w-4" />
        Sign Out
      </button>
    </nav>
  );
}
