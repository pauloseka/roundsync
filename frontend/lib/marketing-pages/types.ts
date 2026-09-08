export interface ArticleSubsection {
  id: string;
  title: string;
  paragraphs: string[];
  bullets?: string[];
}

export interface ArticleSection {
  id: string;
  title: string;
  paragraphs: string[];
  subsections?: ArticleSubsection[];
  callout?: { label: string; body: string };
}

export interface MarketingArticleContent {
  slug: string;
  eyebrow: string;
  title: string;
  lede: string[];
  metaTitle: string;
  metaDescription: string;
  sections: ArticleSection[];
  readingTimeMinutes?: number;
}

export interface TocHeading {
  id: string;
  title: string;
  level: 2 | 3;
}

export interface MarketingDetailSection {
  title: string;
  description?: string;
  items: Array<{ title: string; body: string }>;
}

/** @deprecated Legacy card layout — converted to articles via toArticle(). */
export interface MarketingDetailPageContent {
  slug: string;
  eyebrow: string;
  title: string;
  intro: string;
  metaTitle: string;
  metaDescription: string;
  sections: MarketingDetailSection[];
}

export type MarketingPageGroup = "product" | "solutions" | "resources";
