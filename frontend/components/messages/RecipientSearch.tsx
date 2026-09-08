"use client";

import { useMemo, useState } from "react";
import { messageChannels } from "@/lib/messages-channels";
import { messageIndividuals } from "@/lib/messages-recipients";
import { messagesCopy } from "@/lib/content/copy";
import { matchesSearch, normalizeSearchQuery } from "@/lib/message-compose";

export type RecipientSelection =
  | { type: "channel"; id: string; name: string; description: string }
  | { type: "individual"; id: string; name: string; role: string };

interface RecipientSearchProps {
  value: RecipientSelection | null;
  onChange: (selection: RecipientSelection | null) => void;
  disabled?: boolean;
}

const inputClassName =
  "w-full rounded-md border border-line bg-surface-base px-3 py-2.5 text-sm text-ink-primary outline-none transition-colors placeholder:text-ink-secondary/60 focus:border-brand-core focus:ring-1 focus:ring-brand-core";

export function RecipientSearch({ value, onChange, disabled = false }: RecipientSearchProps) {
  const copy = messagesCopy.newMessage;
  const [query, setQuery] = useState("");

  const normalizedQuery = normalizeSearchQuery(query);

  const filteredChannels = useMemo(
    () =>
      messageChannels.filter((channel) =>
        matchesSearch(normalizedQuery, channel.name, channel.description),
      ),
    [normalizedQuery],
  );

  const filteredIndividuals = useMemo(
    () =>
      messageIndividuals.filter((individual) =>
        matchesSearch(normalizedQuery, individual.name, individual.role),
      ),
    [normalizedQuery],
  );

  const hasResults = filteredChannels.length > 0 || filteredIndividuals.length > 0;

  function selectChannel(channel: (typeof messageChannels)[number]) {
    onChange({
      type: "channel",
      id: channel.id,
      name: channel.name,
      description: channel.description,
    });
    setQuery("");
  }

  function selectIndividual(individual: (typeof messageIndividuals)[number]) {
    onChange({
      type: "individual",
      id: individual.id,
      name: individual.name,
      role: individual.role,
    });
    setQuery("");
  }

  if (value) {
    return (
      <div className="rounded-lg border border-line bg-surface-base px-3 py-3">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="font-mono text-[10px] font-medium uppercase tracking-widest text-ink-secondary">
              {value.type === "channel" ? copy.channelBadge : copy.colleagueBadge}
            </p>
            <p className="mt-1 font-display text-sm font-semibold text-ink-primary">{value.name}</p>
            <p className="mt-0.5 text-xs text-ink-secondary">
              {value.type === "channel" ? value.description : value.role}
            </p>
          </div>
          <button
            type="button"
            onClick={() => onChange(null)}
            disabled={disabled}
            className="shrink-0 text-sm font-medium text-brand-core hover:underline disabled:opacity-60"
          >
            {copy.changeRecipientLabel}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <label htmlFor="recipient-search" className="block text-sm font-medium text-ink-primary">
        {copy.searchLabel}
      </label>
      <input
        id="recipient-search"
        type="search"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder={copy.searchPlaceholder}
        className={inputClassName}
        disabled={disabled}
        autoComplete="off"
      />

      <div className="max-h-64 overflow-y-auto rounded-lg border border-line bg-surface-base">
        {!hasResults ? (
          <p className="px-3 py-4 text-sm text-ink-secondary">{copy.searchEmpty}</p>
        ) : (
          <>
            {filteredChannels.length > 0 ? (
              <section>
                <p className="sticky top-0 border-b border-line bg-surface-card px-3 py-2 font-mono text-[10px] font-medium uppercase tracking-widest text-ink-secondary">
                  {copy.channelsGroupLabel}
                </p>
                <ul>
                  {filteredChannels.map((channel) => (
                    <li key={channel.id}>
                      <button
                        type="button"
                        onClick={() => selectChannel(channel)}
                        disabled={disabled}
                        className="flex w-full flex-col px-3 py-2.5 text-left transition-colors hover:bg-brand-core-muted/30 disabled:opacity-60"
                      >
                        <span className="text-sm font-medium text-ink-primary">{channel.name}</span>
                        <span className="mt-0.5 text-xs text-ink-secondary">{channel.description}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}

            {filteredIndividuals.length > 0 ? (
              <section>
                <p className="sticky top-0 border-b border-line bg-surface-card px-3 py-2 font-mono text-[10px] font-medium uppercase tracking-widest text-ink-secondary">
                  {copy.colleaguesGroupLabel}
                </p>
                <ul>
                  {filteredIndividuals.map((individual) => (
                    <li key={individual.id}>
                      <button
                        type="button"
                        onClick={() => selectIndividual(individual)}
                        disabled={disabled}
                        className="flex w-full flex-col px-3 py-2.5 text-left transition-colors hover:bg-brand-core-muted/30 disabled:opacity-60"
                      >
                        <span className="text-sm font-medium text-ink-primary">{individual.name}</span>
                        <span className="mt-0.5 text-xs text-ink-secondary">{individual.role}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}
          </>
        )}
      </div>
    </div>
  );
}

export function recipientFromSearchParams(
  channelParam: string | null,
  toParam: string | null,
): RecipientSelection | null {
  if (toParam) {
    const individual = messageIndividuals.find((item) => item.id === toParam);
    if (individual) {
      return {
        type: "individual",
        id: individual.id,
        name: individual.name,
        role: individual.role,
      };
    }
  }

  if (channelParam) {
    const channel = messageChannels.find((item) => item.id === channelParam);
    if (channel) {
      return {
        type: "channel",
        id: channel.id,
        name: channel.name,
        description: channel.description,
      };
    }
  }

  return null;
}
