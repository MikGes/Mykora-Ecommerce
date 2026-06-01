import { mockProducts } from "@/lib/mock-data";
import type { AdminStats, AuditLogEntry } from "@/types";
import { authService } from "./auth.service";
import { orderService } from "./order.service";

const auditLogs: AuditLogEntry[] = [
  { id: "audit-1", action: "USER_LOGIN", entity: "User", userId: "user-1", userName: "Demo User", ipAddress: "192.168.1.1", createdAt: new Date(Date.now() - 3600000).toISOString() },
  { id: "audit-2", action: "ORDER_CREATED", entity: "Order", entityId: "order-1", userId: "user-1", userName: "Demo User", createdAt: new Date(Date.now() - 86400000).toISOString() },
  { id: "audit-3", action: "PRODUCT_UPDATED", entity: "Product", entityId: "prod-1", userId: "admin-1", userName: "Admin User", createdAt: new Date(Date.now() - 172800000).toISOString() },
  { id: "audit-4", action: "COUPON_CREATED", entity: "Coupon", entityId: "coup-1", userId: "admin-1", userName: "Admin User", createdAt: new Date(Date.now() - 259200000).toISOString() },
  { id: "audit-5", action: "FAILED_LOGIN", entity: "User", ipAddress: "10.0.0.55", createdAt: new Date(Date.now() - 300000).toISOString() },
];

export const adminService = {
  async getStats(): Promise<AdminStats> {
    const allOrders = await orderService.getAllOrders();
    const revenue = allOrders.reduce((s, o) => s + o.total, 0);
    const users = await authService.getAllUsers();

    return {
      revenue,
      orders: allOrders.length + 156,
      customers: users.length + 1247,
      products: mockProducts.length,
      conversionRate: 3.2,
      revenueByMonth: [
        { month: "Jan", revenue: 42000 },
        { month: "Feb", revenue: 38500 },
        { month: "Mar", revenue: 45200 },
        { month: "Apr", revenue: 51800 },
        { month: "May", revenue: 48900 },
        { month: "Jun", revenue: 55400 },
      ],
      topProducts: mockProducts.slice(0, 5).map((p, i) => ({
        name: p.name,
        sales: 120 - i * 15,
        revenue: p.price * (120 - i * 15),
      })),
      topCustomers: [
        { name: "Sarah Mitchell", orders: 12, spent: 2450 },
        { name: "James Cooper", orders: 9, spent: 1890 },
        { name: "Emily Rodriguez", orders: 8, spent: 1650 },
      ],
      categoryPerformance: [
        { name: "Electronics", revenue: 125000, percentage: 35 },
        { name: "Fashion", revenue: 98000, percentage: 27 },
        { name: "Home & Living", revenue: 72000, percentage: 20 },
        { name: "Beauty", revenue: 45000, percentage: 12 },
        { name: "Sports", revenue: 22000, percentage: 6 },
      ],
    };
  },

  async getAuditLogs(): Promise<AuditLogEntry[]> {
    return auditLogs;
  },

  async logAction(
    action: string,
    userId?: string,
    entity?: string,
    entityId?: string,
    ipAddress?: string
  ) {
    auditLogs.unshift({
      id: `audit-${Date.now()}`,
      action,
      entity,
      entityId,
      userId,
      ipAddress,
      createdAt: new Date().toISOString(),
    });
  },
};
