export function messageThreadHref(threadId: string, caseId?: string): string {
  const base = `/messages/${threadId}`;
  if (!caseId) return base;
  return `${base}?case=${encodeURIComponent(caseId)}`;
}

export function caseDetailHref(caseId: string): string {
  return `/cases/${caseId}`;
}

export function parseReturnCaseId(
  caseParam: string | null | undefined,
  fallbackCaseId?: string,
): string | undefined {
  const trimmed = caseParam?.trim();
  if (trimmed) return trimmed;
  return fallbackCaseId;
}
