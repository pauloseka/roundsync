"use client";

import { MarketingArticleToc } from "@/components/marketing/MarketingArticleToc";
import { MarketingHeader } from "@/components/marketing/MarketingHeader";
import { PageContent } from "@/components/marketing/PageContent";
import type { TocHeading } from "@/lib/marketing-pages/types";

interface MarketingArticleShellProps {
  eyebrow: string;
  title: string;
  readingTimeMinutes?: number;
  tocHeadings: TocHeading[];
  children: React.ReactNode;
}

interface ArticleHeaderProps {
  eyebrow: string;
  title: string;
  readingTimeMinutes?: number;
  className?: string;
}

function ArticleHeader({ eyebrow, title, readingTimeMinutes, className = "" }: ArticleHeaderProps) {
  return (
    <div className={className}>
      <p className="font-mono text-xs font-medium uppercase tracking-widest text-ink-secondary">
        {eyebrow}
      </p>
      <h1 className="mt-3 font-display text-3xl font-semibold leading-tight text-ink-primary sm:text-4xl md:text-5xl">
        {title}
      </h1>
      {readingTimeMinutes ? (
        <p className="mt-4 font-mono text-xs text-ink-secondary">
          {readingTimeMinutes} min read
        </p>
      ) : null}
    </div>
  );
}

export function MarketingArticleShell({
  eyebrow,
  title,
  readingTimeMinutes,
  tocHeadings,
  children,
}: MarketingArticleShellProps) {
  const headerProps = { eyebrow, title, readingTimeMinutes };

  return (
    <div className="flex h-[100dvh] flex-col overflow-hidden bg-surface-base">
      <MarketingHeader />

      <div className="flex min-h-0 flex-1 flex-col overflow-hidden px-page">
        <PageContent wide className="flex h-full min-h-0 flex-1 flex-col">
          <div className="grid h-full min-h-0 flex-1 grid-cols-1 grid-rows-[auto_minmax(0,1fr)] lg:grid-cols-[minmax(0,760px)_16.25rem]">
            <header className="shrink-0 border-b border-line bg-surface-base pb-6 pt-8 md:pb-8 md:pt-10 lg:col-start-1 lg:row-start-1 lg:pr-12 xl:pr-16">
              <ArticleHeader
                {...headerProps}
                className="mx-auto max-w-3xl text-center lg:mx-0 lg:max-w-none lg:text-left"
              />
            </header>

            <div
              className="min-h-0 overflow-y-auto overscroll-contain scroll-smooth py-8 md:py-10 lg:col-start-1 lg:row-start-2 lg:pr-12 lg:[scrollbar-color:var(--color-brand-core)_transparent] lg:[scrollbar-width:thin] lg:[&::-webkit-scrollbar]:w-1.5 lg:[&::-webkit-scrollbar-thumb]:rounded-full lg:[&::-webkit-scrollbar-thumb]:bg-brand-core lg:[&::-webkit-scrollbar-track]:bg-transparent xl:pr-16"
              data-marketing-article-scroll
            >
              <div data-marketing-article-body>
                <div className="mb-8 border-b border-line pb-8 lg:hidden">
                  <MarketingArticleToc headings={tocHeadings} />
                </div>

                {children}

                <div className="mt-16 border-t border-line" role="presentation" />
              </div>
            </div>

            <aside className="hidden min-h-0 self-stretch border-l border-line bg-surface-base pl-8 lg:col-start-2 lg:row-start-1 lg:row-span-2 lg:block xl:pl-10">
              <div className="pt-8 md:pt-10">
                <MarketingArticleToc headings={tocHeadings} />
              </div>
            </aside>
          </div>
        </PageContent>
      </div>
    </div>
  );
}
