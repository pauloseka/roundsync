export function getSectionHash(href: string): string | null {
  const hashIndex = href.indexOf("#");
  if (hashIndex === -1) return null;
  const hash = href.slice(hashIndex + 1);
  return hash || null;
}

export function getSectionPath(href: string): string | null {
  if (!href.includes("#")) return null;
  const path = href.slice(0, href.indexOf("#"));
  return path || "/";
}

export function isSectionLink(href: string): boolean {
  return getSectionHash(href) !== null;
}

export function resolveMarketingHref(href: string): string {
  const hash = getSectionHash(href);
  if (!hash) return href;

  const path = getSectionPath(href) ?? "/";
  return `${path}#${hash}`;
}
