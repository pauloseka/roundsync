export type MessageThreadKind = "patient" | "channel" | "direct";

export interface MessageAttachment {
  id: string;
  name: string;
  sizeBytes: number;
  mimeType: string;
}

export interface Message {
  id: string;
  authorName: string;
  authorRole: string;
  body: string;
  sentMinutesAgo: number;
  isYou?: boolean;
  attachments?: MessageAttachment[];
}

export interface MessageThread {
  id: string;
  title: string;
  kind: MessageThreadKind;
  channelId?: string;
  individualId?: string;
  patientId?: string;
  patientName?: string;
  ward?: string;
  bed?: string;
  unread: boolean;
  lastMessagePreview: string;
  lastMessageMinutesAgo: number;
  messages: Message[];
}

export interface MessageThreadPreview {
  id: string;
  from: string;
  preview: string;
  patientId?: string;
  patientName?: string;
  receivedMinutesAgo: number;
}

export interface ReplyInput {
  body: string;
  attachments?: MessageAttachment[];
}

export interface MessageChannel {
  id: string;
  name: string;
  description: string;
  /** Ward-wide channels — no patient linking; use @mentions instead. */
  allowsPatientLink?: boolean;
  allowsMentions?: boolean;
}

export interface MessageIndividual {
  id: string;
  name: string;
  role: string;
}

export interface DepartmentChannelView {
  channel: MessageChannel;
  thread?: MessageThread;
}

export interface StartConversationInput {
  recipientType: "channel" | "individual";
  channelId?: string;
  individualId?: string;
  patientId?: string;
  body: string;
  attachments?: MessageAttachment[];
}
