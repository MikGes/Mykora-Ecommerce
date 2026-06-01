import { mockProducts } from "@/lib/mock-data";
import { formatPrice } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export const metadata = { title: "Products" };

export default function AdminProductsPage() {
  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Products</h1>
        <Button>Add Product</Button>
      </div>
      <div className="mt-8 overflow-x-auto rounded-lg border">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-4 text-left">Name</th>
              <th className="p-4 text-left">SKU</th>
              <th className="p-4 text-left">Price</th>
              <th className="p-4 text-left">Stock</th>
              <th className="p-4 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {mockProducts.slice(0, 20).map((p) => (
              <tr key={p.id} className="border-t">
                <td className="p-4 font-medium">{p.name}</td>
                <td className="p-4 text-gray-500">{p.sku}</td>
                <td className="p-4">{formatPrice(p.price)}</td>
                <td className="p-4">{p.stock}</td>
                <td className="p-4">
                  <Badge variant={p.stock > 0 ? "success" : "destructive"}>
                    {p.stock > 0 ? "In Stock" : "Out of Stock"}
                  </Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
