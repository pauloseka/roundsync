import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MarketingArticlePage } from "@/components/marketing/MarketingArticlePage";
import { getSolutionsPage, solutionsPageSlugs } from "@/lib/marketing-pages/content";

interface SolutionsPageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return solutionsPageSlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: SolutionsPageProps): Promise<Metadata> {
  const { slug } = await params;
  const content = getSolutionsPage(slug);
  if (!content) return {};

  return {
    title: content.metaTitle,
    description: content.metaDescription,
  };
}

export default async function SolutionsTopicPage({ params }: SolutionsPageProps) {
  const { slug } = await params;
  const content = getSolutionsPage(slug);
  if (!content) notFound();

  return <MarketingArticlePage content={content} />;
}
