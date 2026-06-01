import type { Notification, NotificationType } from "@/types";

const notifications = new Map<string, Notification[]>();

const defaultNotifications: Notification[] = [
  {
    id: "notif-1",
    type: "ORDER",
    title: "Order Shipped",
    message: "Your order MYK-L8X2K9-A3F2 has been shipped and is on its way.",
    read: false,
    link: "/account/orders/order-1",
    createdAt: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: "notif-2",
    type: "PRICE_DROP",
    title: "Price Drop Alert",
    message: "Wireless Noise-Cancelling Headphones dropped to $179.99",
    read: false,
    link: "/products/wireless-headphones",
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: "notif-3",
    type: "COUPON",
    title: "New Coupon Available",
    message: "Use code VIP20 for 20% off orders over $150",
    read: true,
    link: "/shop",
    createdAt: new Date(Date.now() - 172800000).toISOString(),
  },
];

export const notificationService = {
  async getNotifications(userId: string): Promise<Notification[]> {
    if (!notifications.has(userId)) {
      notifications.set(userId, [...defaultNotifications]);
    }
    return notifications.get(userId) ?? [];
  },

  async getUnreadCount(userId: string): Promise<number> {
    const list = await this.getNotifications(userId);
    return list.filter((n) => !n.read).length;
  },

  async markAsRead(userId: string, notificationId: string): Promise<void> {
    const list = await this.getNotifications(userId);
    const notif = list.find((n) => n.id === notificationId);
    if (notif) notif.read = true;
  },

  async markAllAsRead(userId: string): Promise<void> {
    const list = await this.getNotifications(userId);
    list.forEach((n) => (n.read = true));
  },

  async create(
    userId: string,
    type: NotificationType,
    title: string,
    message: string,
    link?: string
  ): Promise<Notification> {
    const list = await this.getNotifications(userId);
    const notif: Notification = {
      id: `notif-${Date.now()}`,
      type,
      title,
      message,
      read: false,
      link,
      createdAt: new Date().toISOString(),
    };
    list.unshift(notif);
    return notif;
  },
};
