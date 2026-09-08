import type { Metadata } from "next";
import { MarketingArticlePage } from "@/components/marketing/MarketingArticlePage";
import { getHowItWorksPage, howItWorksPage } from "@/lib/marketing-pages/content";

export const metadata: Metadata = {
  title: howItWorksPage.metaTitle,
  description: howItWorksPage.metaDescription,
};

export default function HowItWorksPage() {
  return <MarketingArticlePage content={getHowItWorksPage()} />;
}
