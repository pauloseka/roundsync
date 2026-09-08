"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useCases } from "@/components/cases/CasesStore";
import {
  appendReply,
  getDashboardMessagePreviews,
  getPausedThreads,
  getReadThreads,
  getThreadById,
  getUnreadThreadCount,
  getUnreadThreads,
  getDepartmentChannelViews,
  markThreadReadRecord,
  startConversationRecord,
  type MessageThread,
  type ReplyInput,
  type StartConversationInput,
} from "@/lib/messages";
import { initialThreads } from "@/lib/messages-seed";

interface MessagesContextValue {
  threads: MessageThread[];
  unreadThreads: MessageThread[];
  readThreads: MessageThread[];
  pausedThreads: MessageThread[];
  unreadCount: number;
  dashboardPreview: ReturnType<typeof getDashboardMessagePreviews>;
  departmentChannels: ReturnType<typeof getDepartmentChannelViews>;
  getThread: (threadId: string) => MessageThread | undefined;
  markThreadRead: (threadId: string) => void;
  sendReply: (threadId: string, input: ReplyInput) => void;
  startConversation: (input: StartConversationInput) => string;
}

const MessagesContext = createContext<MessagesContextValue | null>(null);

export function MessagesProvider({ children }: { children: ReactNode }) {
  const { activeCasePatientIds } = useCases();
  const [threads, setThreads] = useState<MessageThread[]>(initialThreads);

  const unreadThreads = useMemo(
    () => getUnreadThreads(threads, activeCasePatientIds),
    [threads, activeCasePatientIds],
  );
  const readThreads = useMemo(
    () => getReadThreads(threads, activeCasePatientIds),
    [threads, activeCasePatientIds],
  );
  const pausedThreads = useMemo(
    () => getPausedThreads(threads, activeCasePatientIds),
    [threads, activeCasePatientIds],
  );
  const dashboardPreview = useMemo(
    () => getDashboardMessagePreviews(threads, activeCasePatientIds),
    [threads, activeCasePatientIds],
  );
  const departmentChannels = useMemo(
    () => getDepartmentChannelViews(threads),
    [threads],
  );

  const markThreadRead = useCallback((threadId: string) => {
    setThreads((current) =>
      current.map((thread) =>
        thread.id === threadId ? markThreadReadRecord(thread) : thread,
      ),
    );
  }, []);

  const sendReply = useCallback((threadId: string, input: ReplyInput) => {
    const body = input.body.trim();
    const attachments = input.attachments ?? [];

    if (!body && attachments.length === 0) return;

    setThreads((current) =>
      current.map((thread) =>
        thread.id === threadId ? appendReply(thread, input) : thread,
      ),
    );
  }, []);

  const startConversation = useCallback((input: StartConversationInput) => {
    let threadId = "";

    setThreads((current) => {
      const result = startConversationRecord(current, input);
      threadId = result.threadId;
      return result.threads;
    });

    return threadId;
  }, []);

  const value = useMemo(
    (): MessagesContextValue => ({
      threads,
      unreadThreads,
      readThreads,
      pausedThreads,
      unreadCount: getUnreadThreadCount(threads, activeCasePatientIds),
      dashboardPreview,
      departmentChannels,
      getThread: (threadId) => getThreadById(threads, threadId),
      markThreadRead,
      sendReply,
      startConversation,
    }),
    [
      threads,
      unreadThreads,
      readThreads,
      pausedThreads,
      activeCasePatientIds,
      dashboardPreview,
      departmentChannels,
      markThreadRead,
      sendReply,
      startConversation,
    ],
  );

  return <MessagesContext.Provider value={value}>{children}</MessagesContext.Provider>;
}

export function useMessages() {
  const context = useContext(MessagesContext);
  if (!context) {
    throw new Error("useMessages must be used within MessagesProvider");
  }
  return context;
}
