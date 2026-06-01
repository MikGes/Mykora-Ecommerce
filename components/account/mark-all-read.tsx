"use client";

import { Button } from "@/components/ui/button";
import { markAllNotificationsReadAction } from "@/actions/notification.actions";
import { useRouter } from "next/navigation";

export function MarkAllReadButton() {
  const router = useRouter();
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={async () => {
        await markAllNotificationsReadAction();
        router.refresh();
      }}
    >
      Mark all read
    </Button>
  );
}
