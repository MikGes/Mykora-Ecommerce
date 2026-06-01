import { auth } from "@/lib/auth";
import { notificationService } from "@/services/notification.service";
import { MarkAllReadButton } from "@/components/account/mark-all-read";
import { formatDate } from "@/lib/utils";
import Link from "next/link";

export const metadata = { title: "Notifications" };

export default async function NotificationsPage() {
  const session = await auth();
  if (!session?.user?.id) return null;
  const notifications = await notificationService.getNotifications(session.user.id);

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Notifications</h1>
        <MarkAllReadButton />
      </div>
      <div className="mt-8 space-y-2">
        {notifications.map((n) => (
          <div
            key={n.id}
            className={`rounded-lg border p-4 ${!n.read ? "border-[#2563EB] bg-blue-50/50" : "border-gray-100"}`}
          >
            <div className="flex justify-between">
              <p className="font-medium">{n.title}</p>
              <span className="text-xs text-gray-400">{formatDate(n.createdAt)}</span>
            </div>
            <p className="mt-1 text-sm text-gray-600">{n.message}</p>
            {n.link && (
              <Link href={n.link} className="mt-2 inline-block text-sm text-[#2563EB] hover:underline">
                View details
              </Link>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
