# RoundSync Design System

**Version 1.0 · Internal · Live-product ready**

Evolved from `.references/roundsync-style-guide.md` into a codified system for the ward app, organisation admin, marketing, and internal tools.

**Living reference (browser):** [/design-system](http://localhost:3000/design-system)  
**Code entry points:**
- `styles/tokens.css` — CSS custom properties
- `lib/design-system/` — TypeScript tokens, variants, `cn()`
- `components/ui/` — Shared primitives

---

## 1. Design thesis

RoundSync is used mid-shift under fluorescent lighting — not from a comfortable desk. Every decision optimizes **scan speed and unambiguous urgency**. Calm by default; loud only when clinically necessary.

This is airport signage and cockpit UI, not a generic SaaS dashboard.

---

## 2. Product surfaces

| Surface | Route prefix | Visual rules |
|---------|--------------|--------------|
| **Clinical app** | `/dashboard`, `/cases`, … | Flat `surface-base`, no gradients, earned density, left-anchored scan |
| **Org admin** | `/admin/*` | Same tokens as clinical — admin is not a separate brand |
| **Marketing & auth** | `/`, `/sign-in`, `/sign-up` | Hero scale and gradients allowed; palette unchanged |
| **Internal tools** | `/design-system` | Documents tokens and components |

---

## 3. Color

### Rules

1. **Clinical urgency** (`critical`, `urgent`, `moderate`, `resolved`) — case status only.
2. **Semantic** (`info`, `success`, `warning`, `danger`) — admin, forms, system messages.
3. **Brand** (`brand-core`) — primary actions, active nav, links.
4. Never use `--critical` for decorative CTAs.

### Token groups

See `styles/tokens.css` and the `/design-system` color swatches.

| Group | Example classes |
|-------|-----------------|
| Surfaces | `bg-surface-base`, `bg-surface-card` |
| Ink | `text-ink-primary`, `text-ink-secondary` |
| Brand | `bg-brand-core`, `bg-brand-core-muted` |
| Clinical | `text-critical`, `bg-urgent-muted` |
| Semantic | `text-danger`, `bg-info-muted` |

---

## 4. Typography

| Role | Font | Tailwind |
|------|------|----------|
| Display / headings | General Sans | `font-display` |
| Body / UI | IBM Plex Sans | default / `font-sans` |
| Data / audit | IBM Plex Mono | `font-mono` |

### Scale (decisive jumps)

| Token | Size | Use |
|-------|------|-----|
| `text-xs` | 13px | Eyebrows, badges, metadata |
| `text-sm` | 15px | Body default, forms, lists |
| `text-base` | 18px | Lead copy |
| `text-xl` | 24px | Section headers |
| `text-2xl` | 32px | Page titles |
| `text-3xl` | 40px | Marketing hero only |

**Hierarchy:** Prefer weight over subtle gray steps under stress.

---

## 5. Spacing & layout

| Token | Value |
|-------|-------|
| `space-1` … `space-16` | 4px → 64px |
| `page-margin` / `px-page` | 24 → 40 → 64px responsive |
| `shell-nav-width` | 240px |
| `form-max-width` | 480px |
| `content-max-width` | 1280px |

### Radius

`radius-sm` (6px) → chips · `radius-md` (8px) → inputs · `radius-lg` (12px) → cards · `radius-xl` (16px) → large panels

### Z-index

`z-dropdown` 40 · `z-sticky` 50 · `z-overlay` 80 · `z-modal` 90 · `z-toast` 100 · `z-critical` 110

---

## 6. Components

Import from `@/components/ui`:

| Component | Purpose |
|-----------|---------|
| `Button` | primary, secondary, ghost, destructive, link · sm/md/lg |
| `Input`, `Textarea`, `Select` | Form controls with shared focus ring |
| `FormField` | Label + hint + error wrapper |
| `Card` | default, raised, inset, interactive |
| `Badge` | neutral, brand, clinical tones, semantic tones |
| `UrgencyChip` | critical / urgent / moderate (icon + label + color) |
| `AlertBanner` | Full-width; non-dismissible critical path |
| `AuditRow` | Relative + absolute time, actor, action |
| `SectionHeader`, `PageHeader`, `Eyebrow` | Page structure |
| `Switch`, `Divider`, `Stack` | Settings and layout helpers |
| `LoadingScreen` | full / embedded |
| `ConfirmDialog` | Non-critical confirmations only |

### Variant helpers

```ts
import { buttonClassName, inputClassName, cardClassName, badgeClassName } from "@/lib/design-system";
```

Legacy signup exports remain at `@/components/signup/signup-form-styles` (re-exports design system).

---

## 7. Layout patterns

### Clinical scan pattern

Top-left anchor on every screen: **patient / urgency / elapsed time**. Same position across roles so new hires scan unfamiliar screens instantly.

### Timestamps

Always **relative + absolute**: `2 min ago (14:32)`.

### One primary action

Emergency flows: one dominant button (e.g. Acknowledge). Secondary actions visually subordinate.

### Critical alerts

- **No modals** for life-critical signals.
- Use `AlertBanner` or full-screen takeover (`z-critical`).
- No auto-dismiss toasts for clinical urgency.

### Status display

Color + icon + word — never color alone.

---

## 8. Motion

Functional only (`styles/motion.css`):

| Use | Motion |
|-----|--------|
| New critical alert | Single pulse on chip (`rs-urgency-pulse`) — not looping |
| Route / loading | Spinner, no bounce |
| Resolved state | Quiet settle — no celebration |
| Marketing splash | Allowed on landing only |

Max delay before content: **~150ms**. Respect `prefers-reduced-motion`.

---

## 9. Accessibility

- Focus: `rs-focus-ring` / `focus-visible` with brand ring
- Status: icon + text always paired
- Loading: `role="status"`, `aria-busy`, `aria-live="polite"`
- Alerts: `role="alert"` on `AlertBanner`
- Switch: `role="switch"`, `aria-checked`

---

## 10. Governance

### Adding a component

1. Check if a variant on an existing primitive suffices.
2. Add to `components/ui/` with props for variant/size only — no one-off colors.
3. Register in `lib/design-system/tokens.ts` → `componentCatalog`.
4. Add a live example to `/design-system`.
5. Do not add npm UI libraries without design review.

### Anti-patterns

- Hex in TSX instead of token classes
- Gradients in clinical app
- Inter / Poppins as display type
- Glassmorphism in operational UI
- Modal for critical clinical alert
- `--critical` on non-status UI

---

## 11. Migration checklist

When touching legacy code:

- [ ] Replace inline button/input classes with `@/lib/design-system` or `@/components/ui`
- [ ] Replace hardcoded shadows with `--shadow-*` tokens where needed
- [ ] Use `PageHeader` / `SectionHeader` for new admin pages
- [ ] Use `AuditRow` for new audit list items (or align `AuditEntryItem` over time)

---

## File map

```
frontend/
├── styles/
│   ├── tokens.css          # All CSS custom properties + @theme
│   └── motion.css          # Keyframes and animation utilities
├── lib/design-system/
│   ├── cn.ts
│   ├── variants.ts         # buttonClassName, inputClassName, …
│   ├── tokens.ts           # Metadata for docs / tooling
│   └── index.ts
├── components/ui/            # Primitives (barrel: index.ts)
├── components/design-system/ # Internal reference page
├── app/design-system/        # /design-system route
└── docs/design-system/       # This documentation
```
