import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CLASS_TYPES } from "@/lib/constants";
import { ClassDetailContent } from "./content";

export function generateStaticParams() {
  return CLASS_TYPES.map((cls) => ({ slug: cls.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const cls = CLASS_TYPES.find((c) => c.slug === slug);
  if (!cls) return { title: "Class Not Found" };
  return {
    title: `${cls.name} Classes`,
    description: cls.description,
  };
}

export default async function ClassDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const cls = CLASS_TYPES.find((c) => c.slug === slug);
  if (!cls) notFound();
  return <ClassDetailContent classData={cls} />;
}
