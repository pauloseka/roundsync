import type { MessageIndividual } from "@/lib/messages-types";

export const messageIndividuals: MessageIndividual[] = [
  { id: "david-chen", name: "David Chen", role: "RN" },
  { id: "sarah-mitchell", name: "Sarah Mitchell", role: "HCA" },
  { id: "dr-patel", name: "Dr. Patel", role: "On-call" },
];

export function getMessageIndividual(individualId: string): MessageIndividual | undefined {
  return messageIndividuals.find((individual) => individual.id === individualId);
}
