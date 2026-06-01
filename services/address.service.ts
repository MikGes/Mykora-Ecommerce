import type { Address } from "@/types";

const addresses = new Map<string, Address[]>();

const defaultAddresses: Address[] = [
  {
    id: "addr-1",
    label: "Home",
    firstName: "Demo",
    lastName: "User",
    street: "123 Commerce Street",
    city: "San Francisco",
    state: "CA",
    postalCode: "94102",
    country: "US",
    phone: "+1 (555) 123-4567",
    isDefaultShipping: true,
    isDefaultBilling: true,
  },
];

export const addressService = {
  async getAddresses(userId: string): Promise<Address[]> {
    if (!addresses.has(userId)) {
      addresses.set(userId, [...defaultAddresses]);
    }
    return addresses.get(userId) ?? [];
  },

  async addAddress(userId: string, data: Omit<Address, "id">): Promise<Address> {
    const list = await this.getAddresses(userId);
    const address: Address = { ...data, id: `addr-${Date.now()}` };
    if (address.isDefaultShipping) {
      list.forEach((a) => (a.isDefaultShipping = false));
    }
    if (address.isDefaultBilling) {
      list.forEach((a) => (a.isDefaultBilling = false));
    }
    list.push(address);
    addresses.set(userId, list);
    return address;
  },

  async updateAddress(
    userId: string,
    addressId: string,
    data: Partial<Address>
  ): Promise<Address> {
    const list = await this.getAddresses(userId);
    const index = list.findIndex((a) => a.id === addressId);
    if (index < 0) throw new Error("Address not found");
    list[index] = { ...list[index], ...data };
    return list[index];
  },

  async deleteAddress(userId: string, addressId: string): Promise<void> {
    const list = await this.getAddresses(userId);
    addresses.set(
      userId,
      list.filter((a) => a.id !== addressId)
    );
  },
};
