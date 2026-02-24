import type { Metadata } from "next";
import { ProductDetailContent } from "./content";

// Mock product slugs for static generation
const productSlugs = [
  "performance-t-shirt-black",
  "training-shorts",
  "gym-hoodie",
  "compression-leggings",
  "whey-protein-chocolate",
  "pre-workout-formula",
  "bcaa-recovery-mix",
  "creatine-monohydrate",
  "gym-bag-pro",
  "shaker-bottle",
  "resistance-bands-set",
  "lifting-gloves",
];

export function generateStaticParams() {
  return productSlugs.map((slug) => ({ productId: slug }));
}

export function generateMetadata({
  params,
}: {
  params: Promise<{ productId: string }>;
}): Promise<Metadata> {
  // In Next.js 16, params is a Promise
  return params.then(({ productId }) => ({
    title: `${productId.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())} | Big Vision Shop`,
  }));
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ productId: string }>;
}) {
  const { productId } = await params;
  return <ProductDetailContent slug={productId} />;
}
