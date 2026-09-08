"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  filterHelpGuides,
  helpCentreAudiences,
  type HelpGuide,
} from "@/lib/help-centre-data";
import { CONTACT_SUPPORT_HREF, FAQS_HREF } from "@/lib/marketing-nav";

const inputClassName =
  "w-full rounded-md border border-line bg-surface-base px-3 py-2.5 text-sm text-ink-primary outline-none transition-colors placeholder:text-ink-secondary/60 focus:border-brand-core focus:ring-1 focus:ring-brand-core";

function GuideAccordionItem({
  guide,
  open,
  onToggle,
}: {
  guide: HelpGuide;
  open: boolean;
  onToggle: () => void;
}) {
  return (
    <li className="border-b border-line last:border-b-0">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-start justify-between gap-4 py-5 text-left"
        aria-expanded={open}
      >
        <span>
          <span className="flex flex-wrap items-center gap-2">
            <span className="font-mono text-[11px] font-medium uppercase tracking-widest text-brand-core">
              {guide.audience}
            </span>
            <span className="font-mono text-[11px] text-ink-secondary">
              {guide.readTime}
            </span>
          </span>
          <span className="mt-1 block font-display text-base font-semibold text-ink-primary md:text-lg">
            {guide.title}
          </span>
          <span className="mt-1 block text-sm text-ink-secondary">
            {guide.summary}
          </span>
        </span>
        <svg
          aria-hidden="true"
          viewBox="0 0 16 16"
          className={`mt-1 size-4 shrink-0 text-ink-secondary transition-transform ${open ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <path d="M4 6l4 4 4-4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      {open ? (
        <div className="space-y-5 pb-6">
          {guide.sections.map((section) => (
            <div key={section.heading}>
              <h3 className="font-display text-sm font-semibold text-ink-primary md:text-base">
                {section.heading}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-secondary md:text-base">
                {section.body}
              </p>
            </div>
          ))}
        </div>
      ) : null}
    </li>
  );
}

export function HelpCentreContent() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeAudience, setActiveAudience] = useState<string | null>(null);
  const [openGuideId, setOpenGuideId] = useState<string | null>(null);

  const filteredGuides = useMemo(
    () => filterHelpGuides(searchQuery, activeAudience ?? undefined),
    [searchQuery, activeAudience],
  );

  const noResults = filteredGuides.length === 0;

  function handleSearchChange(value: string) {
    setSearchQuery(value);
    setOpenGuideId(null);
  }

  return (
    <div className="mt-12 space-y-10">
      <div className="rounded-xl border border-line bg-surface-card p-4 md:p-6">
        <label htmlFor="help-search" className="sr-only">
          Search help guides
        </label>
        <div className="relative">
          <svg
            aria-hidden="true"
            viewBox="0 0 20 20"
            className="pointer-events-none absolute left-3 top-1/2 size-5 -translate-y-1/2 text-ink-secondary"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <circle cx="9" cy="9" r="6" />
            <path d="M14 14l4 4" strokeLinecap="round" />
          </svg>
          <input
            id="help-search"
            type="search"
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder="Search guides..."
            className={`pl-10 ${inputClassName}`}
          />
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setActiveAudience(null)}
            className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
              activeAudience === null
                ? "bg-brand-core text-white"
                : "border border-line bg-surface-base text-ink-secondary hover:text-ink-primary"
            }`}
          >
            All audiences
          </button>
          {helpCentreAudiences.map((audience) => (
            <button
              key={audience}
              type="button"
              onClick={() =>
                setActiveAudience(activeAudience === audience ? null : audience)
              }
              className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                activeAudience === audience
                  ? "bg-brand-core text-white"
                  : "border border-line bg-surface-base text-ink-secondary hover:text-ink-primary"
              }`}
            >
              {audience}
            </button>
          ))}
        </div>
      </div>

      {noResults ? (
        <div className="rounded-xl border border-dashed border-line bg-surface-base px-6 py-12 text-center">
          <p className="font-display text-lg font-semibold text-ink-primary">
            No matching guides found
          </p>
          <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-ink-secondary">
            Try a different search term, browse{" "}
            <Link href={FAQS_HREF} className="text-brand-core hover:underline">
              FAQs
            </Link>
            , or contact support for direct help.
          </p>
          <Link
            href={CONTACT_SUPPORT_HREF}
            className="mt-6 inline-flex h-11 items-center justify-center rounded-md bg-brand-core px-6 text-sm font-semibold text-white transition-colors hover:bg-brand-core/90"
          >
            Contact support
          </Link>
        </div>
      ) : (
        <ul className="rounded-xl border border-line bg-surface-card px-4 md:px-6">
          {filteredGuides.map((guide) => (
            <GuideAccordionItem
              key={guide.id}
              guide={guide}
              open={openGuideId === guide.id}
              onToggle={() =>
                setOpenGuideId(openGuideId === guide.id ? null : guide.id)
              }
            />
          ))}
        </ul>
      )}

      <p className="text-center text-sm text-ink-secondary">
        {filteredGuides.length} guide{filteredGuides.length === 1 ? "" : "s"}
        {searchQuery ? ` matching "${searchQuery}"` : ""}
        {activeAudience ? ` for ${activeAudience}` : ""}
      </p>

      <div className="grid gap-4 rounded-xl border border-line bg-surface-card p-6 sm:grid-cols-2 md:p-8">
        <div>
          <h2 className="font-display text-lg font-semibold text-ink-primary">
            Quick answers
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-ink-secondary">
            Short questions on routing, roles, and licensing — browse the FAQ
            library.
          </p>
          <Link
            href={FAQS_HREF}
            className="mt-4 inline-flex text-sm font-semibold text-brand-core hover:underline"
          >
            Browse FAQs →
          </Link>
        </div>
        <div>
          <h2 className="font-display text-lg font-semibold text-ink-primary">
            Need direct help?
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-ink-secondary">
            Account issues, configuration blockers, or something not covered in
            these guides — reach our support team.
          </p>
          <Link
            href={CONTACT_SUPPORT_HREF}
            className="mt-4 inline-flex text-sm font-semibold text-brand-core hover:underline"
          >
            Contact support →
          </Link>
        </div>
      </div>
    </div>
  );
}
