import type {
  Message,
  MessageAttachment,
  MessageThread,
  MessageThreadPreview,
  ReplyInput,
  StartConversationInput,
  DepartmentChannelView,
} from "@/lib/messages-types";
import { getMessageChannel, messageChannels } from "@/lib/messages-channels";
import { getMessageIndividual } from "@/lib/messages-recipients";
import { shiftContext, shiftPatients } from "@/lib/mock-data";

export function isThreadVisibleForCases(
  thread: MessageThread,
  activeCasePatientIds: Set<string>,
): boolean {
  return !thread.patientId || !activeCasePatientIds.has(thread.patientId);
}

export function getVisibleThreads(
  threads: MessageThread[],
  activeCasePatientIds: Set<string>,
): MessageThread[] {
  return threads.filter((thread) => isThreadVisibleForCases(thread, activeCasePatientIds));
}

export function getPausedThreads(
  threads: MessageThread[],
  activeCasePatientIds: Set<string>,
): MessageThread[] {
  return threads.filter(
    (thread) => thread.patientId && activeCasePatientIds.has(thread.patientId),
  );
}

export function getPatientCaseThreads(
  threads: MessageThread[],
  patientId: string,
): MessageThread[] {
  return sortThreadsByRecency(threads.filter((thread) => thread.patientId === patientId));
}

export function sortThreadsByRecency(threads: MessageThread[]): MessageThread[] {
  return [...threads].sort((a, b) => {
    if (a.unread !== b.unread) return a.unread ? -1 : 1;
    return a.lastMessageMinutesAgo - b.lastMessageMinutesAgo;
  });
}

export function getUnreadThreads(
  threads: MessageThread[],
  activeCasePatientIds: Set<string>,
): MessageThread[] {
  return sortThreadsByRecency(
    getVisibleThreads(threads, activeCasePatientIds).filter((thread) => thread.unread),
  );
}

export function getReadThreads(
  threads: MessageThread[],
  activeCasePatientIds: Set<string>,
): MessageThread[] {
  return sortThreadsByRecency(
    getVisibleThreads(threads, activeCasePatientIds).filter((thread) => !thread.unread),
  );
}

export function getUnreadThreadCount(
  threads: MessageThread[],
  activeCasePatientIds: Set<string>,
): number {
  return getUnreadThreads(threads, activeCasePatientIds).length;
}

export function getThreadById(
  threads: MessageThread[],
  threadId: string,
): MessageThread | undefined {
  return threads.find((thread) => thread.id === threadId);
}

export function getDashboardMessagePreviews(
  threads: MessageThread[],
  activeCasePatientIds: Set<string>,
  limit = 2,
): { items: MessageThreadPreview[]; total: number } {
  const visible = getUnreadThreads(threads, activeCasePatientIds);
  const items = visible.slice(0, limit).map(toThreadPreview);

  return { items, total: visible.length };
}

export function toThreadPreview(thread: MessageThread): MessageThreadPreview {
  return {
    id: thread.id,
    from: thread.title,
    preview: thread.lastMessagePreview,
    patientId: thread.patientId,
    patientName: thread.patientName,
    receivedMinutesAgo: thread.lastMessageMinutesAgo,
  };
}

export function createMessageId(): string {
  return `m-${Date.now()}`;
}

export function createThreadId(): string {
  return `msg-${Date.now()}`;
}

function buildLastMessagePreview(body: string, attachments: MessageAttachment[] = []): string {
  const trimmed = body.trim();

  if (trimmed && attachments.length > 0) {
    return `${trimmed.slice(0, 56)} · ${attachments.length} file${attachments.length === 1 ? "" : "s"}`;
  }

  if (trimmed) return trimmed.slice(0, 80);

  if (attachments.length === 1) {
    return `Sent ${attachments[0].name}`;
  }

  return `Sent ${attachments.length} attachments`;
}

export function buildReplyMessage(input: ReplyInput): Message {
  const body = input.body.trim();
  const attachments = input.attachments?.length ? input.attachments : undefined;

  return {
    id: createMessageId(),
    authorName: shiftContext.nurseName,
    authorRole: "RN",
    body: body || (attachments ? "" : ""),
    sentMinutesAgo: 0,
    isYou: true,
    attachments,
  };
}

export function appendReply(thread: MessageThread, input: ReplyInput): MessageThread {
  const attachments = input.attachments ?? [];
  const body = input.body.trim();

  if (!body && attachments.length === 0) {
    return thread;
  }

  const message = buildReplyMessage({ body, attachments });

  return {
    ...thread,
    unread: false,
    lastMessagePreview: buildLastMessagePreview(body, attachments),
    lastMessageMinutesAgo: 0,
    messages: [...thread.messages, message],
  };
}

export function threadKindLabel(kind: MessageThread["kind"]): string {
  switch (kind) {
    case "patient":
      return "Patient";
    case "channel":
      return "Channel";
    case "direct":
      return "Direct";
  }
}

export function threadKindHeaderLabel(kind: MessageThread["kind"]): string {
  switch (kind) {
    case "patient":
      return "Patient thread";
    case "channel":
      return "Department channel";
    case "direct":
      return "Direct message";
  }
}

export function markThreadReadRecord(thread: MessageThread): MessageThread {
  return { ...thread, unread: false };
}

export function getDepartmentChannelViews(threads: MessageThread[]): DepartmentChannelView[] {
  return messageChannels.map((channel) => ({
    channel,
    thread: threads.find(
      (item) =>
        item.kind === "channel" &&
        item.channelId === channel.id &&
        !item.patientId,
    ),
  }));
}

function findChannelThread(
  threads: MessageThread[],
  channelId: string,
  patientId?: string,
): MessageThread | undefined {
  return threads.find(
    (thread) =>
      thread.kind === "channel" &&
      thread.channelId === channelId &&
      (thread.patientId ?? undefined) === (patientId || undefined),
  );
}

function findDirectThread(
  threads: MessageThread[],
  individualId: string,
  patientId?: string,
): MessageThread | undefined {
  return threads.find(
    (thread) =>
      thread.kind === "direct" &&
      thread.individualId === individualId &&
      (thread.patientId ?? undefined) === (patientId || undefined),
  );
}

function enrichPatientContext(patientId?: string) {
  if (!patientId) return {};

  const patient = shiftPatients.find((item) => item.id === patientId);
  if (!patient) return {};

  return {
    patientId: patient.id,
    patientName: patient.name,
    ward: patient.ward,
    bed: patient.bed,
  };
}

export function buildNewThread(input: StartConversationInput): MessageThread {
  const body = input.body.trim();
  const attachments = input.attachments?.length ? input.attachments : undefined;
  const message = buildReplyMessage({ body, attachments });
  const patientContext = enrichPatientContext(input.patientId);

  if (input.recipientType === "channel") {
    const channel = getMessageChannel(input.channelId ?? "");
    if (!channel) {
      throw new Error("Unknown channel");
    }

    return {
      id: createThreadId(),
      title: channel.name,
      kind: "channel",
      channelId: channel.id,
      ...patientContext,
      unread: false,
      lastMessagePreview: buildLastMessagePreview(body, attachments ?? []),
      lastMessageMinutesAgo: 0,
      messages: [message],
    };
  }

  const individual = getMessageIndividual(input.individualId ?? "");
  if (!individual) {
    throw new Error("Unknown recipient");
  }

  return {
    id: createThreadId(),
    title: individual.name,
    kind: "direct",
    individualId: individual.id,
    ...patientContext,
    unread: false,
    lastMessagePreview: buildLastMessagePreview(body, attachments ?? []),
    lastMessageMinutesAgo: 0,
    messages: [message],
  };
}

export function startConversationRecord(
  threads: MessageThread[],
  input: StartConversationInput,
): { threads: MessageThread[]; threadId: string } {
  const body = input.body.trim();
  const attachments = input.attachments ?? [];

  if (!body && attachments.length === 0) {
    throw new Error("Message required");
  }

  if (input.recipientType === "channel") {
    const existing = findChannelThread(threads, input.channelId ?? "", input.patientId);
    if (existing) {
      const updated = appendReply(existing, { body, attachments });
      return {
        threads: threads.map((thread) => (thread.id === existing.id ? updated : thread)),
        threadId: existing.id,
      };
    }

    const created = buildNewThread(input);
    return { threads: [created, ...threads], threadId: created.id };
  }

  const existing = findDirectThread(threads, input.individualId ?? "", input.patientId);
  if (existing) {
    const updated = appendReply(existing, { body, attachments });
    return {
      threads: threads.map((thread) => (thread.id === existing.id ? updated : thread)),
      threadId: existing.id,
    };
  }

  const created = buildNewThread(input);
  return { threads: [created, ...threads], threadId: created.id };
}

export type {
  DepartmentChannelView,
  Message,
  MessageAttachment,
  MessageChannel,
  MessageIndividual,
  MessageThread,
  MessageThreadKind,
  MessageThreadPreview,
  ReplyInput,
  StartConversationInput,
} from "@/lib/messages-types";
