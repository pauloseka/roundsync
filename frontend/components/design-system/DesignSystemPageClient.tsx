"use client";

import { useState } from "react";
import Link from "next/link";
import { RoundSyncLogo } from "@/components/brand/RoundSyncLogo";
import { AlertBanner } from "@/components/ui/alert-banner";
import { AuditRow } from "@/components/ui/audit-row";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FormField } from "@/components/ui/form-field";
import { Input, Select, Textarea } from "@/components/ui/input";
import { Eyebrow, PageHeader, SectionHeader } from "@/components/ui/section-header";
import { Divider, Stack, Switch } from "@/components/ui/switch";
import { UrgencyChip } from "@/components/ui/UrgencyChip";
import {
  antiPatterns,
  colorTokens,
  componentCatalog,
  designPrinciples,
  fontRoles,
  layoutTokens,
  productSurfaces,
  radiusScale,
  spacingScale,
  typographyScale,
} from "@/lib/design-system/tokens";
import { cn } from "@/lib/design-system/cn";
import { badgeClassName } from "@/lib/design-system/variants";

function Swatch({ name, hex }: { name: string; hex: string }) {
  return (
    <div className="overflow-hidden rounded-lg border border-line bg-surface-card">
      <div className="h-14" style={{ backgroundColor: hex }} />
      <div className="px-3 py-2">
        <p className="font-mono text-xs font-medium text-ink-primary">{name}</p>
        <p className="font-mono text-[11px] text-ink-secondary">{hex}</p>
      </div>
    </div>
  );
}

function DocSection({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="scroll-mt-24 border-t border-line pt-12 first:border-t-0 first:pt-0">
      <h2 className="font-display text-2xl font-semibold text-ink-primary">{title}</h2>
      <div className="mt-6">{children}</div>
    </section>
  );
}

function catalogDetail(row: (typeof componentCatalog)[number]): string {
  const record = row as Record<string, string | undefined>;
  return record.variants ?? record.tones ?? record.levels ?? record.use ?? record.sizes ?? "";
}

function NavLink({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      className="block rounded-md px-3 py-2 text-sm text-ink-secondary transition-colors hover:bg-surface-base hover:text-ink-primary"
    >
      {label}
    </a>
  );
}

export function DesignSystemPageClient() {
  const [switchOn, setSwitchOn] = useState(true);

  return (
    <div className="min-h-screen bg-surface-base">
      <header className="sticky top-0 z-50 border-b border-line bg-surface-card/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-page py-4">
          <div className="flex items-center gap-4">
            <RoundSyncLogo markClassName="size-8" textClassName="font-display text-lg font-semibold text-brand-core" />
            <span className="hidden font-mono text-[11px] uppercase tracking-widest text-ink-secondary sm:inline">
              Design system · v1.0
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/" className="text-sm font-medium text-brand-core hover:underline">
              ← Product
            </Link>
            <Badge tone="brand">Internal</Badge>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-page py-10 lg:grid-cols-[220px_minmax(0,1fr)]">
        <nav
          aria-label="Design system sections"
          className="sticky top-24 hidden shrink-0 self-start overflow-hidden lg:block"
        >
          <p className="px-3 font-mono text-[11px] font-medium uppercase tracking-widest text-ink-secondary">
            On this page
          </p>
          <div className="mt-3 space-y-0.5">
            <NavLink href="#principles" label="Principles" />
            <NavLink href="#surfaces" label="Product surfaces" />
            <NavLink href="#color" label="Color" />
            <NavLink href="#typography" label="Typography" />
            <NavLink href="#spacing" label="Spacing & layout" />
            <NavLink href="#components" label="Components" />
            <NavLink href="#patterns" label="Patterns" />
            <NavLink href="#anti-patterns" label="Anti-patterns" />
          </div>
        </nav>

        <main className="min-w-0 space-y-12">
          <PageHeader
            eyebrow="RoundSync design system"
            brandEyebrow
            title="Tokens, components, and patterns for a live clinical product"
            subtitle="Single source of truth for engineering, design, and internal tools. Evolved from the RoundSync style guide — optimized for scan speed, clinical urgency, and admin parity with the ward app."
          />

          <DocSection id="principles" title="Design principles">
            <div className="grid gap-4 md:grid-cols-2">
              {designPrinciples.map((item) => (
                <Card key={item.id} variant="inset" padding={false} className="p-5">
                  <CardTitle className="text-base">{item.title}</CardTitle>
                  <CardDescription>{item.body}</CardDescription>
                </Card>
              ))}
            </div>
          </DocSection>

          <DocSection id="surfaces" title="Product surfaces">
            <Stack gap="sm">
              {productSurfaces.map((surface) => (
                <div key={surface.id} className="rounded-lg border border-line bg-surface-card p-4">
                  <p className="font-display text-sm font-semibold text-ink-primary">{surface.name}</p>
                  <p className="mt-1 text-sm text-ink-secondary">{surface.rules}</p>
                </div>
              ))}
            </Stack>
          </DocSection>

          <DocSection id="color" title="Color tokens">
            {Object.entries(colorTokens).map(([group, tokens]) => (
              <div key={group} className="mb-8 last:mb-0">
                <Eyebrow className="mb-3 capitalize">{group}</Eyebrow>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                  {tokens.map((token) => (
                    <Swatch key={token.name} name={token.name} hex={token.light} />
                  ))}
                </div>
              </div>
            ))}
            <p className="mt-4 text-sm text-ink-secondary">
              Use Tailwind classes: <code className="font-mono text-xs">bg-brand-core</code>,{" "}
              <code className="font-mono text-xs">text-critical</code>. Never hardcode hex in components.
            </p>
          </DocSection>

          <DocSection id="typography" title="Typography">
            <div className="overflow-hidden rounded-xl border border-line bg-surface-card">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-line bg-surface-base">
                  <tr>
                    <th className="px-4 py-3 font-mono text-xs uppercase tracking-wide text-ink-secondary">Role</th>
                    <th className="px-4 py-3 font-mono text-xs uppercase tracking-wide text-ink-secondary">Family</th>
                    <th className="px-4 py-3 font-mono text-xs uppercase tracking-wide text-ink-secondary">Class</th>
                  </tr>
                </thead>
                <tbody>
                  {fontRoles.map((row) => (
                    <tr key={row.role} className="border-b border-line last:border-0">
                      <td className="px-4 py-3 text-ink-primary">{row.role}</td>
                      <td className="px-4 py-3 text-ink-secondary">{row.family}</td>
                      <td className="px-4 py-3 font-mono text-xs text-brand-core">{row.tailwind}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-6 space-y-4">
              {typographyScale.map((row) => (
                <div key={row.token} className="flex flex-wrap items-baseline justify-between gap-2 border-b border-line pb-3">
                  <p className={cn(row.token === "text-2xl" && "text-2xl font-display font-semibold", row.token === "text-xl" && "text-xl font-display font-semibold", row.token === "text-base" && "text-base", row.token === "text-sm" && "text-sm", row.token === "text-xs" && "text-xs font-mono uppercase tracking-widest")}>
                    {row.use}
                  </p>
                  <span className="font-mono text-xs text-ink-secondary">
                    {row.token} · {row.size}
                  </span>
                </div>
              ))}
            </div>
          </DocSection>

          <DocSection id="spacing" title="Spacing & layout">
            <div className="grid gap-4 md:grid-cols-2">
              <Card padding={false} className="p-5">
                <CardTitle className="text-base">Spacing scale</CardTitle>
                <ul className="mt-3 space-y-2 text-sm text-ink-secondary">
                  {spacingScale.map((s) => (
                    <li key={s.token} className="flex justify-between gap-4">
                      <span className="font-mono text-ink-primary">{s.token}</span>
                      <span>{s.value}</span>
                    </li>
                  ))}
                </ul>
              </Card>
              <Card padding={false} className="p-5">
                <CardTitle className="text-base">Radius & z-index</CardTitle>
                <ul className="mt-3 space-y-2 text-sm text-ink-secondary">
                  {radiusScale.map((r) => (
                    <li key={r.token} className="flex justify-between gap-4">
                      <span className="font-mono text-ink-primary">{r.token}</span>
                      <span>{r.value}</span>
                    </li>
                  ))}
                </ul>
                <Divider className="my-4" />
                <ul className="space-y-2 text-sm text-ink-secondary">
                  {layoutTokens.map((l) => (
                    <li key={l.name} className="flex justify-between gap-4">
                      <span className="font-mono text-ink-primary">{l.name}</span>
                      <span>{l.value}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            </div>
          </DocSection>

          <DocSection id="components" title="Components">
            <SectionHeader
              title="Actions"
              description="One primary action per screen. Destructive variant for revoke/delete — not clinical urgency."
            />
            <div className="mt-4 flex flex-wrap gap-3">
              <Button variant="primary">Primary</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="destructive">Destructive</Button>
              <Button variant="link">Link</Button>
            </div>
            <div className="mt-3 flex flex-wrap gap-3">
              <Button size="sm" variant="primary">Small</Button>
              <Button size="md" variant="primary">Medium</Button>
              <Button size="lg" variant="primary">Large</Button>
            </div>

            <Divider className="my-8" label="Forms" />

            <div className="max-w-md">
              <Stack gap="sm">
                <FormField id="ds-name" label="Full name" hint="As shown on the ward roster.">
                  <Input id="ds-name" placeholder="Amaka Okafor" />
                </FormField>
                <FormField id="ds-ward" label="Ward">
                  <Select id="ds-ward" defaultValue="4b">
                    <option value="4b">Surgical 4B</option>
                    <option value="med">Ward 4B — Medical</option>
                  </Select>
                </FormField>
                <FormField id="ds-notes" label="Notes">
                  <Textarea id="ds-notes" placeholder="Handoff context…" />
                </FormField>
                <Switch id="ds-switch" label="Shift alerts" hint="Play sound for critical cases." checked={switchOn} onChange={setSwitchOn} />
              </Stack>
            </div>

            <Divider className="my-8" label="Status" />

            <div className="flex flex-wrap gap-2">
              <UrgencyChip level="critical" />
              <UrgencyChip level="urgent" />
              <UrgencyChip level="moderate" />
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {(["neutral", "brand", "critical", "urgent", "moderate", "resolved", "info", "warning", "danger"] as const).map(
                (tone) => (
                  <span key={tone} className={badgeClassName(tone)}>
                    {tone}
                  </span>
                ),
              )}
            </div>

            <Divider className="my-8" label="Alerts & audit" />

            <Stack gap="sm">
              <AlertBanner
                level="critical"
                title="RR 32 · SpO₂ 86% — Ward 4B Bed 12"
                body="Acknowledgement required. Escalates to on-call in 3 minutes if unacknowledged."
                primaryAction={{ label: "Acknowledge", onClick: () => {} }}
                secondaryAction={{ label: "View case", onClick: () => {} }}
              />
              <AuditRow
                relativeTime="2 min ago"
                absoluteTime="14:32"
                actorName="Amaka Okafor"
                actorRole="RN"
                category="Case"
                action="Vitals recorded — RR elevated, SpO₂ below threshold"
                metadata={[
                  { label: "Patient", value: "PT-2841" },
                  { label: "Ward", value: "4B · Bed 12" },
                ]}
              />
            </Stack>

            <Divider className="my-8" label="Catalog" />

            <div className="overflow-hidden rounded-xl border border-line bg-surface-card">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-line bg-surface-base">
                  <tr>
                    <th className="px-4 py-3 font-mono text-xs uppercase text-ink-secondary">Component</th>
                    <th className="px-4 py-3 font-mono text-xs uppercase text-ink-secondary">Variants</th>
                  </tr>
                </thead>
                <tbody>
                  {componentCatalog.map((row) => (
                    <tr key={row.name} className="border-b border-line last:border-0">
                      <td className="px-4 py-3 font-medium text-ink-primary">{row.name}</td>
                      <td className="px-4 py-3 text-ink-secondary">{catalogDetail(row)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </DocSection>

          <DocSection id="patterns" title="Implementation patterns">
            <Card>
              <CardHeader>
                <CardTitle>Import paths</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 font-mono text-xs text-ink-secondary">
                <p>
                  <span className="text-ink-primary">Components:</span>{" "}
                  <code>@/components/ui</code> or <code>@/components/ui/button</code>
                </p>
                <p>
                  <span className="text-ink-primary">Tokens & variants:</span>{" "}
                  <code>@/lib/design-system</code>
                </p>
                <p>
                  <span className="text-ink-primary">CSS tokens:</span>{" "}
                  <code>styles/tokens.css</code> (imported via globals.css)
                </p>
                <p>
                  <span className="text-ink-primary">Legacy signup styles:</span>{" "}
                  <code>@/components/signup/signup-form-styles</code> re-exports design system
                </p>
              </CardContent>
            </Card>
          </DocSection>

          <DocSection id="anti-patterns" title="Anti-patterns">
            <ul className="space-y-2">
              {antiPatterns.map((item) => (
                <li key={item} className="flex gap-3 text-sm text-ink-secondary">
                  <span className="text-critical" aria-hidden="true">
                    ✕
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </DocSection>

          <footer className="border-t border-line pt-8 text-sm text-ink-secondary">
            <p>
              Full documentation: <code className="font-mono text-xs">frontend/docs/design-system/</code>
            </p>
            <p className="mt-2">
              Narrative spec: <code className="font-mono text-xs">.references/roundsync-style-guide.md</code>
            </p>
          </footer>
        </main>
      </div>
    </div>
  );
}
