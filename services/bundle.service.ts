import { mockBundles } from "@/lib/mock-data";
import type { Bundle } from "@/types";

export const bundleService = {
  async getBundles(): Promise<Bundle[]> {
    return mockBundles;
  },

  async getBundleById(id: string): Promise<Bundle | null> {
    return mockBundles.find((b) => b.id === id) ?? null;
  },
};
