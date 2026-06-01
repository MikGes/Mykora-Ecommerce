import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { AccountNav } from "@/components/account/account-nav";

export default async function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session) redirect("/login?callbackUrl=/account");

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-8 lg:flex-row">
        <aside className="w-full lg:w-56 shrink-0">
          <AccountNav user={session.user} />
        </aside>
        <div className="flex-1">{children}</div>
      </div>
    </div>
  );
}
