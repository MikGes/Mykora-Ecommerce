"use server";

import { auth } from "@/lib/auth";
import { notificationService } from "@/services/notification.service";
import { revalidatePath } from "next/cache";

export async function markNotificationReadAction(notificationId: string) {
  const session = await auth();
  if (!session?.user?.id) return;
  await notificationService.markAsRead(session.user.id, notificationId);
  revalidatePath("/account/notifications");
}

export async function markAllNotificationsReadAction() {
  const session = await auth();
  if (!session?.user?.id) return;
  await notificationService.markAllAsRead(session.user.id);
  revalidatePath("/account/notifications");
}
