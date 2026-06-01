import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";

const adminLinks = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/products", label: "Products" },
  { href: "/admin/orders", label: "Orders" },
  { href: "/admin/customers", label: "Customers" },
  { href: "/admin/coupons", label: "Coupons" },
  { href: "/admin/analytics", label: "Analytics" },
  { href: "/admin/audit", label: "Audit Logs" },
];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") redirect("/");

  return (
    <div className="flex min-h-screen bg-[#F9FAFB] dark:bg-gray-950">
      <aside className="w-56 shrink-0 border-r border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
        <Link href="/admin" className="text-lg font-semibold">Mykora Admin</Link>
        <nav className="mt-8 space-y-1">
          {adminLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "block rounded-md px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <Link href="/" className="mt-8 block text-sm text-gray-500 hover:text-[#111827]">
          ← Back to Store
        </Link>
      </aside>
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}
