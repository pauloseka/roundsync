"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  SettingsRadioGroup,
  SettingsSection,
  SettingsSegmentedControl,
  SettingsSelect,
  SettingsToggle,
} from "@/components/settings/SettingsControls";
import { useSettings } from "@/components/settings/SettingsStore";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { settingsCopy } from "@/lib/content/copy";
import { CHANGE_PASSWORD_HREF } from "@/lib/settings-routes";
import { SIGN_IN_HREF } from "@/lib/marketing-nav";
import { getUserProfile } from "@/lib/settings-profile";
import type { AlertTone, DisplayMode, NotificationScope } from "@/lib/settings-types";

export function SettingsPageClient() {
  const copy = settingsCopy;
  const router = useRouter();
  const { settings, setSoundEnabled, setUrgencyTone, setNotificationScope, setDisplayMode } =
    useSettings();
  const [signOutOpen, setSignOutOpen] = useState(false);
  const profile = getUserProfile();

  const toneOptions = (Object.entries(copy.alerts.tones) as [AlertTone, string][]).map(
    ([value, label]) => ({ value, label }),
  );

  function handleSignOutConfirm() {
    setSignOutOpen(false);
    router.push(SIGN_IN_HREF);
  }

  return (
    <>
      <div className="flex min-h-full w-full flex-col gap-6 px-4 py-4 sm:px-6 sm:py-6 xl:px-8 xl:py-7">
        <header className="max-w-3xl">
          <p className="font-mono text-xs font-medium uppercase tracking-widest text-ink-secondary">
            Settings
          </p>
          <h1 className="mt-1 font-display text-2xl font-semibold text-ink-primary">
            Preferences & profile
          </h1>
          <p className="mt-1.5 text-sm leading-relaxed text-ink-secondary">{copy.pageSubtitle}</p>
        </header>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
          <div className="flex flex-col gap-6 xl:col-span-7">
            <SettingsSection title={copy.alerts.title} description={copy.alerts.description}>
              <SettingsToggle
                id="alert-sounds"
                label={copy.alerts.soundLabel}
                hint={copy.alerts.soundHint}
                checked={settings.alerts.soundEnabled}
                onChange={setSoundEnabled}
              />

              <div className="mt-5 border-t border-line pt-5">
                <p className="font-mono text-[11px] font-medium uppercase tracking-widest text-ink-secondary">
                  {copy.alerts.toneHeading}
                </p>
                <div className="mt-3 grid gap-4 sm:grid-cols-3">
                  <SettingsSelect
                    id="tone-critical"
                    label={copy.alerts.urgency.critical}
                    value={settings.alerts.criticalTone}
                    onChange={(value) => setUrgencyTone("critical", value as AlertTone)}
                    options={toneOptions}
                    disabled={!settings.alerts.soundEnabled}
                  />
                  <SettingsSelect
                    id="tone-urgent"
                    label={copy.alerts.urgency.urgent}
                    value={settings.alerts.urgentTone}
                    onChange={(value) => setUrgencyTone("urgent", value as AlertTone)}
                    options={toneOptions}
                    disabled={!settings.alerts.soundEnabled}
                  />
                  <SettingsSelect
                    id="tone-moderate"
                    label={copy.alerts.urgency.moderate}
                    value={settings.alerts.moderateTone}
                    onChange={(value) => setUrgencyTone("moderate", value as AlertTone)}
                    options={toneOptions}
                    disabled={!settings.alerts.soundEnabled}
                  />
                </div>
              </div>
            </SettingsSection>

            <SettingsSection
              title={copy.notifications.title}
              description={copy.notifications.description}
            >
              <SettingsRadioGroup
                name="notification-scope"
                value={settings.notificationScope}
                onChange={(value) => setNotificationScope(value as NotificationScope)}
                options={[
                  {
                    value: "ward_only",
                    label: copy.notifications.wardOnly.label,
                    description: copy.notifications.wardOnly.description,
                  },
                  {
                    value: "extended",
                    label: copy.notifications.extended.label,
                    description: copy.notifications.extended.description,
                  },
                ]}
              />
            </SettingsSection>

            <SettingsSection title={copy.display.title} description={copy.display.description}>
              <SettingsSegmentedControl
                name="display-mode"
                value={settings.displayMode}
                onChange={(value) => setDisplayMode(value as DisplayMode)}
                options={[
                  { value: "light", label: copy.display.light },
                  { value: "dark", label: copy.display.dark },
                  { value: "system", label: copy.display.system },
                ]}
              />
            </SettingsSection>

            <SettingsSection title={copy.profile.title} description={copy.profile.description}>
              <dl className="grid gap-4 sm:grid-cols-2">
                <div>
                  <dt className="font-mono text-[11px] font-medium uppercase tracking-wide text-ink-secondary">
                    {copy.profile.nameLabel}
                  </dt>
                  <dd className="mt-1 text-sm font-medium text-ink-primary">{profile.name}</dd>
                </div>
                <div>
                  <dt className="font-mono text-[11px] font-medium uppercase tracking-wide text-ink-secondary">
                    {copy.profile.roleLabel}
                  </dt>
                  <dd className="mt-1 text-sm font-medium text-ink-primary">
                    {profile.role} · {profile.roleAbbrev}
                  </dd>
                </div>
                <div>
                  <dt className="font-mono text-[11px] font-medium uppercase tracking-wide text-ink-secondary">
                    {copy.profile.wardLabel}
                  </dt>
                  <dd className="mt-1 text-sm font-medium text-ink-primary">{profile.ward}</dd>
                </div>
                <div>
                  <dt className="font-mono text-[11px] font-medium uppercase tracking-wide text-ink-secondary">
                    {copy.profile.emailLabel}
                  </dt>
                  <dd className="mt-1 text-sm font-medium text-ink-primary">{profile.email}</dd>
                </div>
                <div>
                  <dt className="font-mono text-[11px] font-medium uppercase tracking-wide text-ink-secondary">
                    {copy.profile.employeeIdLabel}
                  </dt>
                  <dd className="mt-1 font-mono text-sm text-ink-primary">{profile.employeeId}</dd>
                </div>
              </dl>
              <p className="mt-4 text-xs leading-relaxed text-ink-secondary">
                {copy.profile.managedNote}
              </p>
            </SettingsSection>

            <SettingsSection title={copy.account.title} description={copy.account.description}>
              <dl className="space-y-4">
                <div>
                  <dt className="font-mono text-[11px] font-medium uppercase tracking-wide text-ink-secondary">
                    {copy.account.authMethodLabel}
                  </dt>
                  <dd className="mt-1 text-sm font-medium text-ink-primary">
                    {profile.authMethod}
                  </dd>
                </div>
              </dl>

              <div className="mt-5 flex flex-col gap-4 border-t border-line pt-5">
                <div>
                  <Link
                    href={CHANGE_PASSWORD_HREF}
                    className="text-sm font-medium text-brand-core hover:underline"
                  >
                    {copy.account.changePasswordLabel} →
                  </Link>
                  <p className="mt-1 text-xs leading-relaxed text-ink-secondary">
                    {copy.account.changePasswordHint}
                  </p>
                </div>

                <div>
                  <button
                    type="button"
                    onClick={() => setSignOutOpen(true)}
                    className="inline-flex h-10 items-center justify-center rounded-md border border-line bg-surface-base px-4 text-sm font-medium text-ink-primary transition-colors hover:bg-surface-card"
                  >
                    {copy.account.signOutLabel}
                  </button>
                  <p className="mt-1 text-xs leading-relaxed text-ink-secondary">
                    {copy.account.signOutHint}
                  </p>
                </div>
              </div>
            </SettingsSection>
          </div>

          <div className="xl:col-span-5">
            <SettingsSidebarNote />
          </div>
        </div>
      </div>

      <ConfirmDialog
        open={signOutOpen}
        title="Log out?"
        description="You'll return to the sign-in screen. Any unsaved work in this session will be lost."
        confirmLabel="Log out"
        cancelLabel="Stay signed in"
        onConfirm={handleSignOutConfirm}
        onCancel={() => setSignOutOpen(false)}
      />
    </>
  );
}

function SettingsSidebarNote() {
  const copy = settingsCopy;

  return (
    <aside className="flex flex-col gap-6">
      <section className="rounded-xl border border-line bg-surface-card p-5">
        <h2 className="font-display text-base font-semibold text-ink-primary">
          {copy.sidebar.title}
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-ink-secondary">
          {copy.sidebar.description}
        </p>
        <p className="mt-3 font-mono text-xs text-ink-secondary">{copy.sidebar.savedLabel}</p>
      </section>

      <div className="rounded-lg border border-line bg-surface-base px-4 py-3">
        <p className="font-mono text-[11px] font-medium uppercase tracking-widest text-ink-secondary">
          {copy.boundary.title}
        </p>
        <ul className="mt-2 space-y-1.5 text-sm text-ink-secondary">
          {copy.boundary.items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
