import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MarketingArticlePage } from "@/components/marketing/MarketingArticlePage";
import { getResourcesPage, resourcesPageSlugs } from "@/lib/marketing-pages/content";

interface ResourcesPageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return resourcesPageSlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: ResourcesPageProps): Promise<Metadata> {
  const { slug } = await params;
  const content = getResourcesPage(slug);
  if (!content) return {};

  return {
    title: content.metaTitle,
    description: content.metaDescription,
  };
}

export default async function ResourcesTopicPage({ params }: ResourcesPageProps) {
  const { slug } = await params;
  const content = getResourcesPage(slug);
  if (!content) notFound();

  return <MarketingArticlePage content={content} />;
}
