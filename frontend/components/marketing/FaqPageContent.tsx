"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  faqCategories,
  filterFaqItems,
  type FaqItem,
} from "@/lib/faq-data";
import { CONTACT_SUPPORT_HREF } from "@/lib/marketing-nav";

const inputClassName =
  "w-full rounded-md border border-line bg-surface-base px-3 py-2.5 text-base text-ink-primary outline-none transition-colors placeholder:text-ink-secondary/60 focus:border-brand-core focus:ring-1 focus:ring-brand-core sm:text-sm";

function FaqAccordionItem({
  faq,
  open,
  onToggle,
}: {
  faq: FaqItem;
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
          <span className="font-mono text-[11px] font-medium uppercase tracking-widest text-brand-core">
            {faq.category}
          </span>
          <span className="mt-1 block font-display text-base font-semibold text-ink-primary md:text-lg">
            {faq.question}
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
        <p className="pb-5 text-sm leading-relaxed text-ink-secondary md:text-base">
          {faq.answer}
        </p>
      ) : null}
    </li>
  );
}

function AskQuestionForm({ defaultQuestion = "" }: { defaultQuestion?: string }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [question, setQuestion] = useState(defaultQuestion);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);

    // UI-only — simulate request; wire to API or form service later.
    await new Promise((resolve) => setTimeout(resolve, 700));

    setSubmitting(false);
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="rounded-xl border border-line bg-surface-card p-6 text-center md:p-8">
        <div className="mx-auto flex size-10 items-center justify-center rounded-full bg-brand-core-muted">
          <span className="text-brand-core" aria-hidden="true">
            ✓
          </span>
        </div>
        <p className="mt-4 font-display text-lg font-semibold text-ink-primary">
          Question submitted
        </p>
        <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-ink-secondary">
          We&apos;ll get back to you within two business days. For urgent access
          issues,{" "}
          <Link href={CONTACT_SUPPORT_HREF} className="text-brand-core hover:underline">
            contact support
          </Link>{" "}
          directly.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-xl border border-line bg-surface-card p-6 md:p-8"
    >
      <h2 className="font-display text-xl font-semibold text-ink-primary">
        Ask a question
      </h2>
      <p className="mt-2 text-sm leading-relaxed text-ink-secondary">
        Can&apos;t find what you&apos;re looking for? Send us your question and
        we&apos;ll add it to our knowledge base where helpful.
      </p>

      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="faq-ask-name" className="block text-sm font-medium text-ink-primary">
            Full name
          </label>
          <input
            id="faq-ask-name"
            name="name"
            type="text"
            required
            autoComplete="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={`mt-1.5 ${inputClassName}`}
            placeholder="Amaka Okafor"
          />
        </div>
        <div>
          <label htmlFor="faq-ask-email" className="block text-sm font-medium text-ink-primary">
            Work email
          </label>
          <input
            id="faq-ask-email"
            name="email"
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={`mt-1.5 ${inputClassName}`}
            placeholder="you@hospital.org"
          />
        </div>
        <div className="sm:col-span-2">
          <label
            htmlFor="faq-ask-question"
            className="block text-sm font-medium text-ink-primary"
          >
            Your question
          </label>
          <textarea
            id="faq-ask-question"
            name="question"
            rows={4}
            required
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            className={`mt-1.5 resize-none ${inputClassName}`}
            placeholder="Describe what you're trying to find out..."
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="mt-6 flex h-11 w-full items-center justify-center rounded-md bg-brand-core text-sm font-semibold text-white transition-colors hover:bg-brand-core/90 disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto sm:px-8"
      >
        {submitting ? "Sending..." : "Submit question"}
      </button>
    </form>
  );
}

export function FaqPageContent() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [openFaqId, setOpenFaqId] = useState<string | null>(null);
  const [askPrefill, setAskPrefill] = useState("");

  const filteredFaqs = useMemo(
    () => filterFaqItems(searchQuery, activeCategory ?? undefined),
    [searchQuery, activeCategory],
  );

  const noResults = filteredFaqs.length === 0;

  function handleSearchChange(value: string) {
    setSearchQuery(value);
    setOpenFaqId(null);
  }

  function scrollToAskForm(prefill?: string) {
    if (prefill) setAskPrefill(prefill);
    document.getElementById("ask-question")?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <div className="mt-12 space-y-10">
      <div className="rounded-xl border border-line bg-surface-card p-4 md:p-6">
        <label htmlFor="faq-search" className="sr-only">
          Search FAQs
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
            id="faq-search"
            type="search"
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder="Search questions and answers..."
            className={`pl-10 ${inputClassName}`}
          />
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setActiveCategory(null)}
            className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
              activeCategory === null
                ? "bg-brand-core text-white"
                : "border border-line bg-surface-base text-ink-secondary hover:text-ink-primary"
            }`}
          >
            All topics
          </button>
          {faqCategories.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() =>
                setActiveCategory(activeCategory === category ? null : category)
              }
              className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                activeCategory === category
                  ? "bg-brand-core text-white"
                  : "border border-line bg-surface-base text-ink-secondary hover:text-ink-primary"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {noResults ? (
        <div className="rounded-xl border border-dashed border-line bg-surface-base px-6 py-12 text-center">
          <p className="font-display text-lg font-semibold text-ink-primary">
            No matching questions found
          </p>
          <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-ink-secondary">
            We couldn&apos;t find an FAQ for &ldquo;{searchQuery}&rdquo;. Ask us
            directly and we&apos;ll get back to you.
          </p>
          <button
            type="button"
            onClick={() => scrollToAskForm(searchQuery)}
            className="mt-6 inline-flex h-11 items-center justify-center rounded-md bg-brand-core px-6 text-sm font-semibold text-white transition-colors hover:bg-brand-core/90"
          >
            Ask this question
          </button>
        </div>
      ) : (
        <ul className="rounded-xl border border-line bg-surface-card px-4 md:px-6">
          {filteredFaqs.map((faq) => (
            <FaqAccordionItem
              key={faq.id}
              faq={faq}
              open={openFaqId === faq.id}
              onToggle={() =>
                setOpenFaqId(openFaqId === faq.id ? null : faq.id)
              }
            />
          ))}
        </ul>
      )}

      <p className="text-center text-sm text-ink-secondary">
        {filteredFaqs.length} question{filteredFaqs.length === 1 ? "" : "s"}
        {searchQuery ? ` matching "${searchQuery}"` : ""}
        {activeCategory ? ` in ${activeCategory}` : ""}
      </p>

      <div id="ask-question">
        <AskQuestionForm
          key={askPrefill}
          defaultQuestion={askPrefill ? `Regarding: ${askPrefill}` : ""}
        />
      </div>
    </div>
  );
}
