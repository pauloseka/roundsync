import type { ArticleSection, TocHeading } from "@/lib/marketing-pages/types";

export function slugifyHeading(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function collectTocHeadings(sections: ArticleSection[]): TocHeading[] {
  const headings: TocHeading[] = [];

  for (const section of sections) {
    headings.push({ id: section.id, title: section.title, level: 2 });
    for (const subsection of section.subsections ?? []) {
      headings.push({ id: subsection.id, title: subsection.title, level: 3 });
    }
  }

  return headings;
}

export function estimateReadingTime(sections: ArticleSection[], lede: string[]) {
  const words = [...lede, ...sections.flatMap((s) => [
    s.title,
    ...s.paragraphs,
    ...(s.subsections?.flatMap((sub) => [sub.title, ...sub.paragraphs, ...(sub.bullets ?? [])]) ?? []),
  ])]
    .join(" ")
    .split(/\s+/).length;

  return Math.max(3, Math.round(words / 220));
}
