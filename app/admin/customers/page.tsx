import { authService } from "@/services/auth.service";
import { Badge } from "@/components/ui/badge";

export const metadata = { title: "Customers" };

export default async function AdminCustomersPage() {
  const users = await authService.getAllUsers();

  return (
    <div>
      <h1 className="text-2xl font-semibold">Customers</h1>
      <div className="mt-8 overflow-x-auto rounded-lg border">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-4 text-left">Name</th>
              <th className="p-4 text-left">Email</th>
              <th className="p-4 text-left">Role</th>
              <th className="p-4 text-left">Loyalty</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-t">
                <td className="p-4 font-medium">{u.name}</td>
                <td className="p-4 text-gray-500">{u.email}</td>
                <td className="p-4"><Badge>{u.role}</Badge></td>
                <td className="p-4 capitalize">{u.loyaltyTier} · {u.loyaltyPoints} pts</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
