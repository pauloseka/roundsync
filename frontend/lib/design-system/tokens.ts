/**
 * RoundSync Design System — Token metadata for docs, tooling, and internal reference.
 */

export const designPrinciples = [
  {
    id: "scan-speed",
    title: "Scan speed over decoration",
    body: "Staff glance between patients. Hierarchy uses weight and spacing, not subtle gray steps.",
  },
  {
    id: "urgency-reserved",
    title: "Urgency colors are sacred",
    body: "Critical, urgent, and moderate tokens are for clinical status only — never CTAs or accents.",
  },
  {
    id: "one-primary-action",
    title: "One primary action per screen",
    body: "Emergency flows expose a single dominant action. Secondary paths stay visually subordinate.",
  },
  {
    id: "accountability",
    title: "Relative + absolute time",
    body: "Timestamps show “2 min ago (14:32)” — fast scan plus audit-grade precision.",
  },
  {
    id: "no-modal-critical",
    title: "No modals for critical alerts",
    body: "Life-critical signals use full-width banners or takeovers that require explicit action.",
  },
] as const;

export const colorTokens = {
  surface: [
    { name: "surface-base", role: "App background", light: "#F7F8FA" },
    { name: "surface-card", role: "Cards and panels", light: "#FFFFFF" },
    { name: "surface-raised", role: "Elevated panels", light: "#FFFFFF" },
    { name: "surface-inverted", role: "Marketing sidebar, inverted blocks", light: "#1A1D23" },
  ],
  ink: [
    { name: "ink-primary", role: "Primary text", light: "#1A1D23" },
    { name: "ink-secondary", role: "Labels, metadata", light: "#5C6470" },
    { name: "ink-tertiary", role: "Placeholder, disabled", light: "#8B939F" },
    { name: "ink-brand", role: "Brand links in body", light: "#2B5F6B" },
  ],
  brand: [
    { name: "brand-core", role: "Primary actions, active nav", light: "#2B5F6B" },
    { name: "brand-core-muted", role: "Selected nav, subtle highlights", light: "#E8F0F2" },
  ],
  clinical: [
    { name: "critical", role: "Life-threatening case state", light: "#D6432C" },
    { name: "urgent", role: "Needs attention soon", light: "#E08A2C" },
    { name: "moderate", role: "Routine escalation", light: "#2B6CB0" },
    { name: "resolved", role: "Closed / completed", light: "#2F855A" },
  ],
  semantic: [
    { name: "info", role: "System information (admin)", light: "#2B6CB0" },
    { name: "success", role: "Saved, connected, approved", light: "#2F855A" },
    { name: "warning", role: "Caution, pending review", light: "#B7791F" },
    { name: "danger", role: "Destructive actions, revoke", light: "#C53030" },
  ],
} as const;

export const typographyScale = [
  { token: "text-xs", size: "13px", use: "Eyebrows, badges, metadata" },
  { token: "text-sm", size: "15px", use: "Body default, form labels, list rows" },
  { token: "text-base", size: "18px", use: "Lead paragraphs, section intros" },
  { token: "text-lg", size: "20px", use: "Subsection titles" },
  { token: "text-xl", size: "24px", use: "Page section headers" },
  { token: "text-2xl", size: "32px", use: "Page titles" },
  { token: "text-3xl", size: "40px", use: "Marketing hero (external only)" },
] as const;

export const fontRoles = [
  { role: "Display", family: "General Sans", tailwind: "font-display", use: "Headings, page titles" },
  { role: "UI / body", family: "IBM Plex Sans", tailwind: "font-sans", use: "Body, buttons, forms" },
  { role: "Data", family: "IBM Plex Mono", tailwind: "font-mono", use: "Timestamps, IDs, audit rows" },
] as const;

export const spacingScale = [
  { token: "space-1", value: "4px" },
  { token: "space-2", value: "8px" },
  { token: "space-3", value: "12px" },
  { token: "space-4", value: "16px" },
  { token: "space-6", value: "24px" },
  { token: "space-8", value: "32px" },
  { token: "space-12", value: "48px" },
  { token: "page-margin", value: "24px → 40px → 64px", note: "Responsive horizontal page gutter" },
] as const;

export const radiusScale = [
  { token: "radius-sm", value: "6px", use: "Chips, small controls" },
  { token: "radius-md", value: "8px", use: "Buttons, inputs" },
  { token: "radius-lg", value: "12px", use: "Cards, panels" },
  { token: "radius-xl", value: "16px", use: "Large panels, modals" },
] as const;

export const layoutTokens = [
  { name: "shell-nav-width", value: "240px", use: "Ward and admin sidebar" },
  { name: "content-max-width", value: "1280px", use: "Marketing sections" },
  { name: "form-max-width", value: "480px", use: "Auth and checkout forms" },
  { name: "prose-max-width", value: "680px", use: "Help centre articles" },
] as const;

export const zIndexLayers = [
  { name: "z-dropdown", value: "40" },
  { name: "z-sticky", value: "50" },
  { name: "z-overlay", value: "80" },
  { name: "z-modal", value: "90" },
  { name: "z-toast", value: "100" },
  { name: "z-critical", value: "110", use: "Full-screen critical alert takeovers" },
] as const;

export const componentCatalog = [
  { name: "Button", variants: "primary, secondary, ghost, destructive, link", sizes: "sm, md, lg" },
  { name: "Input / Textarea / Select", variants: "default, error" },
  { name: "Card", variants: "default, raised, inset, interactive" },
  { name: "Badge", tones: "neutral, brand, critical, urgent, moderate, resolved, info, warning, danger" },
  { name: "UrgencyChip", levels: "critical, urgent, moderate" },
  { name: "AlertBanner", levels: "critical, urgent, info" },
  { name: "AuditRow", use: "Timestamp + actor + action for accountability logs" },
  { name: "FormField", use: "Label, hint, error wrapper" },
  { name: "SectionHeader", use: "Eyebrow + title + description block" },
  { name: "Switch", use: "Settings toggles" },
  { name: "ConfirmDialog", use: "Non-critical confirmations only" },
  { name: "LoadingScreen", variants: "full, embedded" },
] as const;

export const productSurfaces = [
  {
    id: "clinical",
    name: "Clinical app (ward shell)",
    rules: "Flat surfaces, no gradients, density earned, left-anchored scan pattern",
  },
  {
    id: "admin",
    name: "Organisation admin",
    rules: "Same tokens as clinical — admin is not a separate visual language",
  },
  {
    id: "marketing",
    name: "Marketing & auth bridge",
    rules: "Gradients and hero scale allowed; must still use token palette",
  },
  {
    id: "internal",
    name: "Internal tools & design system",
    rules: "This reference site — documents tokens and components for engineering",
  },
] as const;

export const antiPatterns = [
  "Using --critical for non-status UI (CTAs, icons, marketing)",
  "Gradients inside the working clinical app",
  "Inter, Poppins, or system-ui as display typeface",
  "Glassmorphism / frosted panels in operational UI",
  "Color-only status indicators",
  "Modal dialogs for life-critical alerts",
  "Bouncy or celebratory motion near emergency states",
  "Raw hex in component files instead of token class names",
] as const;
