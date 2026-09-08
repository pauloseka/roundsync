import type { MessageChannel } from "@/lib/messages-types";

export const messageChannels: MessageChannel[] = [
  {
    id: "ward-4b",
    name: "Ward 4B team",
    description: "Shift handoffs and ward-wide updates for your unit.",
    allowsPatientLink: false,
    allowsMentions: true,
  },
  {
    id: "pharmacy",
    name: "Pharmacy",
    description: "Medication queries, batch status, and stock.",
    allowsPatientLink: true,
    allowsMentions: true,
  },
  {
    id: "lab",
    name: "Lab",
    description: "Results, specimens, and routine panels.",
    allowsPatientLink: true,
    allowsMentions: true,
  },
  {
    id: "front-desk",
    name: "Front desk",
    description: "Visitors, equipment, and operational requests.",
    allowsPatientLink: true,
    allowsMentions: false,
  },
  {
    id: "on-call",
    name: "On-call",
    description: "After-hours clinical coverage for the ward.",
    allowsPatientLink: true,
    allowsMentions: true,
  },
];

export function getMessageChannel(channelId: string): MessageChannel | undefined {
  return messageChannels.find((channel) => channel.id === channelId);
}

export function channelAllowsPatientLink(channel: MessageChannel): boolean {
  return channel.allowsPatientLink !== false;
}

export function channelAllowsMentions(channel: MessageChannel): boolean {
  return channel.allowsMentions !== false;
}
