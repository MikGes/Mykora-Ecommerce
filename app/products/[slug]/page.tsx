import { notFound } from "next/navigation";
import { productService } from "@/services/product.service";
import { ProductDetail } from "@/components/products/product-detail";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await productService.getProductBySlug(slug);
  if (!product) return { title: "Product Not Found" };
  return {
    title: product.name,
    description: product.description.slice(0, 160),
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await productService.getProductBySlug(slug);
  if (!product) notFound();

  const [reviews, related] = await Promise.all([
    productService.getReviews(product.id),
    productService.getRelated(product.id),
  ]);

  return <ProductDetail product={product} reviews={reviews} related={related} />;
}
