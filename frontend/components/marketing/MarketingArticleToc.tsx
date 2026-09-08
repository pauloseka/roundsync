"use client";

import { useEffect, useRef, useState } from "react";
import type { TocHeading } from "@/lib/marketing-pages/types";
import { cn } from "@/lib/design-system/cn";

interface MarketingArticleTocProps {
  headings: TocHeading[];
  scrollContainerSelector?: string;
}

export function MarketingArticleToc({
  headings,
  scrollContainerSelector = "[data-marketing-article-scroll]",
}: MarketingArticleTocProps) {
  const listRef = useRef<HTMLOListElement>(null);
  const [activeId, setActiveId] = useState(headings[0]?.id ?? "");
  const [marker, setMarker] = useState({ top: 0, height: 0 });
  const [scrollProgress, setScrollProgress] = useState(0);
  const [listHeight, setListHeight] = useState(0);

  useEffect(() => {
    if (headings.length === 0) return;

    const scrollContainer = document.querySelector(scrollContainerSelector);
    const elements = headings
      .map((heading) => document.getElementById(heading.id))
      .filter((element): element is HTMLElement => element !== null);

    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        if (visible[0]?.target.id) {
          setActiveId(visible[0].target.id);
          return;
        }

        const rootTop = scrollContainer?.getBoundingClientRect().top ?? 0;
        const aboveFold = entries
          .filter((entry) => entry.boundingClientRect.top < rootTop + 80)
          .sort((a, b) => b.boundingClientRect.top - a.boundingClientRect.top);

        if (aboveFold[0]?.target.id) {
          setActiveId(aboveFold[0].target.id);
        }
      },
      {
        root: scrollContainer,
        rootMargin: "-8% 0px -60% 0px",
        threshold: [0, 0.1, 0.25, 0.5, 1],
      },
    );

    for (const element of elements) {
      observer.observe(element);
    }

    return () => observer.disconnect();
  }, [headings, scrollContainerSelector]);

  useEffect(() => {
    function updateScrollProgress(container: Element) {
      const maxScroll = container.scrollHeight - container.clientHeight;
      setScrollProgress(maxScroll > 0 ? container.scrollTop / maxScroll : 0);
    }

    function updateMarker() {
      const list = listRef.current;
      if (!list) return;

      const activeLink = list.querySelector<HTMLElement>(`[data-toc-id="${activeId}"]`);
      if (!activeLink) return;

      setMarker({
        top: activeLink.offsetTop,
        height: activeLink.offsetHeight,
      });
      setListHeight(list.offsetHeight);
    }

    function handleUpdate() {
      const scrollContainer = document.querySelector(scrollContainerSelector);
      if (scrollContainer) {
        updateScrollProgress(scrollContainer);
      }
      updateMarker();
    }

    handleUpdate();

    const scrollContainer = document.querySelector(scrollContainerSelector);
    scrollContainer?.addEventListener("scroll", handleUpdate, { passive: true });
    window.addEventListener("resize", handleUpdate);

    return () => {
      scrollContainer?.removeEventListener("scroll", handleUpdate);
      window.removeEventListener("resize", handleUpdate);
    };
  }, [activeId, scrollContainerSelector, headings]);

  function scrollToHeading(id: string) {
    const scrollContainer = document.querySelector(scrollContainerSelector);
    const target = document.getElementById(id);
    if (!scrollContainer || !target) return;

    const offset =
      target.getBoundingClientRect().top -
      scrollContainer.getBoundingClientRect().top +
      scrollContainer.scrollTop;

    scrollContainer.scrollTo({
      top: Math.max(0, offset - 16),
      behavior: "smooth",
    });
    setActiveId(id);
  }

  if (headings.length === 0) return null;

  const progressHeight = listHeight > 0 ? scrollProgress * listHeight : 0;

  return (
    <nav aria-label="On this page">
      <p className="font-mono text-[11px] font-medium uppercase tracking-widest text-brand-core">
        On this page
      </p>

      <div className="relative mt-3 pl-1">
        <div
          className="pointer-events-none absolute bottom-0 left-0 top-0 w-0.5 rounded-full bg-line"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute left-0 top-0 w-0.5 rounded-full bg-brand-core transition-[height] duration-200 ease-out"
          style={{ height: `${progressHeight}px` }}
          aria-hidden="true"
        />
        {marker.height > 0 ? (
          <div
            className="pointer-events-none absolute left-[-1px] w-1 rounded-full bg-brand-core shadow-[0_0_0_1px_rgba(43,95,107,0.15)] transition-all duration-200 ease-out"
            style={{ top: marker.top, height: marker.height }}
            aria-hidden="true"
          />
        ) : null}

        <ol ref={listRef} className="relative space-y-0.5 pl-4">
          {headings.map((heading) => {
            const isActive = activeId === heading.id;

            return (
              <li key={heading.id}>
                <a
                  href={`#${heading.id}`}
                  data-toc-id={heading.id}
                  onClick={(event) => {
                    event.preventDefault();
                    scrollToHeading(heading.id);
                  }}
                  className={cn(
                    "block py-1.5 text-sm leading-snug transition-colors",
                    heading.level === 3 ? "pl-3" : "pl-0",
                    isActive
                      ? "font-semibold text-brand-core"
                      : "font-normal text-ink-secondary hover:text-ink-primary",
                  )}
                  aria-current={isActive ? "location" : undefined}
                >
                  {heading.title}
                </a>
              </li>
            );
          })}
        </ol>
      </div>
    </nav>
  );
}
