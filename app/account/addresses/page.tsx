import { auth } from "@/lib/auth";
import { addressService } from "@/services/address.service";
import { Badge } from "@/components/ui/badge";

export const metadata = { title: "Addresses" };

export default async function AddressesPage() {
  const session = await auth();
  if (!session?.user?.id) return null;
  const addresses = await addressService.getAddresses(session.user.id);

  return (
    <div>
      <h1 className="text-2xl font-semibold">Address Book</h1>
      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {addresses.map((addr) => (
          <div key={addr.id} className="rounded-lg border border-gray-100 p-6 dark:border-gray-800">
            {addr.label && <p className="text-sm font-medium text-gray-500">{addr.label}</p>}
            <p className="mt-1 font-medium">{addr.firstName} {addr.lastName}</p>
            <p className="text-sm text-gray-600">{addr.street}</p>
            <p className="text-sm text-gray-600">{addr.city}, {addr.state} {addr.postalCode}</p>
            <div className="mt-3 flex gap-2">
              {addr.isDefaultShipping && <Badge variant="accent">Default Shipping</Badge>}
              {addr.isDefaultBilling && <Badge variant="secondary">Default Billing</Badge>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
