/** Merge class names — lightweight alternative to clsx/cva without extra deps. */
export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}
