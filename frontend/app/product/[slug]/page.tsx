import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MarketingArticlePage } from "@/components/marketing/MarketingArticlePage";
import { getProductPage, productPageSlugs } from "@/lib/marketing-pages/content";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return productPageSlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const content = getProductPage(slug);
  if (!content) return {};

  return {
    title: content.metaTitle,
    description: content.metaDescription,
  };
}

export default async function ProductTopicPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const content = getProductPage(slug);
  if (!content) notFound();

  return <MarketingArticlePage content={content} />;
}
