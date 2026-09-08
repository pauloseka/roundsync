export function insertTextAtCursor(
  textarea: HTMLTextAreaElement,
  currentValue: string,
  insertText: string,
): { nextValue: string; cursorPosition: number } {
  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;
  const nextValue = currentValue.slice(0, start) + insertText + currentValue.slice(end);
  const cursorPosition = start + insertText.length;

  return { nextValue, cursorPosition };
}

export function normalizeSearchQuery(query: string): string {
  return query.trim().toLowerCase();
}

export function matchesSearch(query: string, ...fields: string[]): boolean {
  if (!query) return true;

  return fields.some((field) => field.toLowerCase().includes(query));
}
