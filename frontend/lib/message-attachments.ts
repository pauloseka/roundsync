import type { MessageAttachment } from "@/lib/messages-types";

export const MAX_MESSAGE_ATTACHMENTS = 3;
export const MAX_ATTACHMENT_BYTES = 10 * 1024 * 1024;

const allowedMimePrefixes = ["image/", "application/pdf"];
const allowedMimeTypes = new Set([
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/webp",
  "text/plain",
]);

export function createAttachmentId(): string {
  return `att-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

export function isAllowedAttachment(file: File): boolean {
  if (allowedMimeTypes.has(file.type)) return true;
  return allowedMimePrefixes.some((prefix) => file.type.startsWith(prefix));
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function fileToAttachment(file: File): MessageAttachment {
  return {
    id: createAttachmentId(),
    name: file.name,
    sizeBytes: file.size,
    mimeType: file.type || "application/octet-stream",
  };
}

export function attachmentLabel(mimeType: string): string {
  if (mimeType.startsWith("image/")) return "Image";
  if (mimeType === "application/pdf") return "PDF";
  if (mimeType === "text/plain") return "Text";
  return "File";
}

export function isImageAttachment(mimeType: string): boolean {
  return mimeType.startsWith("image/");
}
