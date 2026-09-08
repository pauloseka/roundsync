import Link from "next/link";
import { MarketingArticleShell } from "@/components/marketing/MarketingArticleShell";
import { collectTocHeadings } from "@/lib/marketing-pages/headings";
import type { MarketingArticleContent } from "@/lib/marketing-pages/types";
import { BOOK_DEMO_HREF, TALK_TO_SALES_HREF } from "@/lib/marketing-nav";

interface MarketingArticlePageProps {
  content: MarketingArticleContent;
}

export function MarketingArticlePage({ content }: MarketingArticlePageProps) {
  const tocHeadings = collectTocHeadings(content.sections);

  return (
    <MarketingArticleShell
      eyebrow={content.eyebrow}
      title={content.title}
      readingTimeMinutes={content.readingTimeMinutes}
      tocHeadings={tocHeadings}
    >
      <div className="space-y-5 border-b border-line pb-10">
        {content.lede.map((paragraph) => (
          <p
            key={paragraph.slice(0, 48)}
            className="text-base leading-relaxed text-ink-secondary md:text-lg md:leading-relaxed"
          >
            {paragraph}
          </p>
        ))}
      </div>

      <div className="space-y-14 pt-10">
        {content.sections.map((section) => (
          <section key={section.id} aria-labelledby={section.id}>
            <h2
              id={section.id}
              className="scroll-mt-4 font-display text-2xl font-semibold text-ink-primary md:text-3xl"
            >
              {section.title}
            </h2>

            <div className="mt-5 space-y-4">
              {section.paragraphs.map((paragraph) => (
                <p
                  key={paragraph.slice(0, 48)}
                  className="text-base leading-relaxed text-ink-secondary"
                >
                  {paragraph}
                </p>
              ))}
            </div>

            {section.callout ? (
              <aside className="mt-6 rounded-xl border border-brand-core/25 bg-brand-core-muted/40 px-5 py-4">
                <p className="font-mono text-[11px] font-medium uppercase tracking-widest text-brand-core">
                  {section.callout.label}
                </p>
                <p className="mt-2 text-sm leading-relaxed text-ink-primary md:text-base">
                  {section.callout.body}
                </p>
              </aside>
            ) : null}

            {section.subsections?.map((subsection) => (
              <div key={subsection.id} className="mt-8">
                <h3
                  id={subsection.id}
                  className="scroll-mt-4 font-display text-xl font-semibold text-ink-primary"
                >
                  {subsection.title}
                </h3>
                <div className="mt-4 space-y-4">
                  {subsection.paragraphs.map((paragraph) => (
                    <p
                      key={paragraph.slice(0, 48)}
                      className="text-base leading-relaxed text-ink-secondary"
                    >
                      {paragraph}
                    </p>
                  ))}
                </div>
                {subsection.bullets?.length ? (
                  <ul className="mt-4 space-y-2 rounded-lg border border-line bg-surface-base px-4 py-3">
                    {subsection.bullets.map((bullet) => (
                      <li
                        key={bullet}
                        className="flex gap-2 text-sm leading-relaxed text-ink-secondary"
                      >
                        <span className="text-brand-core" aria-hidden="true">
                          ·
                        </span>
                        {bullet}
                      </li>
                    ))}
                  </ul>
                ) : null}
              </div>
            ))}
          </section>
        ))}
      </div>

      <div className="mt-14 rounded-2xl border border-line bg-surface-card p-6 md:p-8">
        <h2 className="font-display text-xl font-semibold text-ink-primary md:text-2xl">
          Ready to see it on your ward?
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-ink-secondary md:text-base">
          Walk through role-scoped views, escalation routing, and the audit trail with our team —
          tailored to your structure and workflows.
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Link
            href={BOOK_DEMO_HREF}
            className="inline-flex h-11 items-center justify-center rounded-md bg-brand-core px-6 text-sm font-semibold text-white transition-colors hover:bg-brand-core/90"
          >
            Book a demo
          </Link>
          <Link
            href={TALK_TO_SALES_HREF}
            className="inline-flex h-11 items-center justify-center rounded-md border border-line bg-surface-base px-6 text-sm font-medium text-ink-primary transition-colors hover:bg-surface-card"
          >
            Talk to sales
          </Link>
        </div>
      </div>
    </MarketingArticleShell>
  );
}
