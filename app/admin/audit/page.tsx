import { adminService } from "@/services/admin.service";
import { formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

export const metadata = { title: "Audit Logs" };

export default async function AdminAuditPage() {
  const logs = await adminService.getAuditLogs();

  return (
    <div>
      <h1 className="text-2xl font-semibold">Audit Logs</h1>
      <div className="mt-8 space-y-2">
        {logs.map((log) => (
          <div key={log.id} className="flex items-center justify-between rounded-lg border p-4">
            <div>
              <Badge variant="outline">{log.action}</Badge>
              <p className="mt-1 text-sm text-gray-600">
                {log.entity && `${log.entity}${log.entityId ? ` #${log.entityId}` : ""}`}
                {log.userName && ` · ${log.userName}`}
                {log.ipAddress && ` · ${log.ipAddress}`}
              </p>
            </div>
            <span className="text-sm text-gray-400">{formatDate(log.createdAt)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
