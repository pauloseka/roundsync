interface MarketingPageHeroProps {
  eyebrow: string;
  title: string;
  children?: React.ReactNode;
}

export function MarketingPageHero({ eyebrow, title, children }: MarketingPageHeroProps) {
  return (
    <div className="mx-auto max-w-3xl text-center">
      <p className="font-mono text-xs font-medium uppercase tracking-widest text-ink-secondary">
        {eyebrow}
      </p>
      <h1 className="mt-3 font-display text-3xl font-semibold leading-tight text-ink-primary sm:text-4xl md:text-5xl">
        {title}
      </h1>
      {children ? (
        <div className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-ink-secondary sm:mt-4 sm:text-base md:text-lg">
          {children}
        </div>
      ) : null}
    </div>
  );
}

interface MarketingTopic {
  title: string;
  body: string;
}

interface MarketingTopicsPanelProps {
  title: string;
  subtitle: string;
  topics: MarketingTopic[];
  mobileSummary?: string;
  children?: React.ReactNode;
}

export function MarketingTopicsPanel({
  title,
  subtitle,
  topics,
  mobileSummary,
  children,
}: MarketingTopicsPanelProps) {
  return (
    <>
      <div className="lg:hidden">
        <details className="group rounded-xl border border-line bg-surface-card/80 backdrop-blur-sm">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-3 p-4 [&::-webkit-details-marker]:hidden">
            <span>
              <span className="font-display text-base font-semibold text-ink-primary">{title}</span>
              <span className="mt-1 block text-sm leading-relaxed text-ink-secondary">
                {mobileSummary ?? subtitle}
              </span>
            </span>
            <span
              className="shrink-0 text-ink-secondary transition-transform group-open:rotate-180"
              aria-hidden="true"
            >
              ↓
            </span>
          </summary>
          <div className="border-t border-line px-4 pb-4 pt-3">
            <ul className="space-y-3">
              {topics.map((topic) => (
                <li
                  key={topic.title}
                  className="rounded-lg border border-line/80 bg-surface-base/80 p-4"
                >
                  <h3 className="font-display text-sm font-semibold text-ink-primary">
                    {topic.title}
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-ink-secondary">{topic.body}</p>
                </li>
              ))}
            </ul>
            {children ? <div className="mt-4 space-y-4">{children}</div> : null}
          </div>
        </details>
      </div>

      <div className="hidden lg:block">
        <h2 className="font-display text-xl font-semibold text-ink-primary md:text-2xl">{title}</h2>
        <p className="mt-3 text-sm leading-relaxed text-ink-secondary md:text-base">{subtitle}</p>

        <ul className="mt-8 space-y-5">
          {topics.map((topic) => (
            <li
              key={topic.title}
              className="rounded-xl border border-line bg-surface-card/80 p-5 backdrop-blur-sm"
            >
              <h3 className="font-display text-base font-semibold text-ink-primary">
                {topic.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-secondary">{topic.body}</p>
            </li>
          ))}
        </ul>

        {children ? <div className="mt-8 space-y-8">{children}</div> : null}
      </div>
    </>
  );
}

/** Shared spacing for marketing split layouts (form + sidebar). */
export const marketingSplitSectionClassName =
  "mt-8 grid items-start gap-8 lg:mt-14 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.35fr)] lg:gap-14";

export const marketingSectionClassName =
  "relative overflow-hidden px-page pb-12 pt-8 md:pb-20 md:pt-16";
