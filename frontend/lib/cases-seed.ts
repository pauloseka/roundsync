import type { EmergencyCase } from "@/lib/cases-types";
import { patientCanTriggerNewCase } from "@/lib/case-relapse";
import { shiftPatients } from "@/lib/mock-data";

type EmergencyCaseSeed = Omit<EmergencyCase, "patientName" | "ward" | "bed">;

const patientLookup = new Map(shiftPatients.map((patient) => [patient.id, patient]));

function enrichCase(seed: EmergencyCaseSeed): EmergencyCase {
  const patient = patientLookup.get(seed.patientId);
  if (!patient) {
    throw new Error(`Unknown patient for case: ${seed.patientId}`);
  }

  return {
    ...seed,
    patientName: patient.name,
    ward: patient.ward,
    bed: patient.bed,
  };
}

const caseSeeds: EmergencyCaseSeed[] = [
  {
    id: "case-001",
    patientId: "PT-2841",
    urgencyLevel: "critical",
    status: "escalated",
    summary: "Respiratory distress — awaiting doctor ack",
    triggerNote:
      "SpO₂ dropped to 88%, patient visibly distressed. Started supplemental O₂ and rechecked vitals.",
    triggeredByName: "Amaka Okafor",
    bedsideOwnerName: "Amaka Okafor",
    handoff: {
      status: "pending",
      outgoingOwnerName: "Amaka Okafor",
      offeredMinutesAgo: 12,
    },
    elapsedMinutes: 6,
    alerts: [
      {
        id: "alert-001",
        recipientName: "Dr. Patel",
        role: "On-call",
        status: "timed_out",
        sentMinutesAgo: 6,
      },
      {
        id: "alert-002",
        recipientName: "Dr. Adeyemi",
        role: "Backup on-call",
        status: "pending",
        sentMinutesAgo: 2,
      },
    ],
    notes: [
      {
        id: "note-001",
        authorName: "Amaka Okafor",
        authorRole: "RN",
        note: "Family at bedside — kept briefed. Awaiting backup doctor response.",
        createdMinutesAgo: 3,
      },
    ],
    escalationTrail: [
      {
        id: "esc-001",
        fromRecipientName: "Dr. Patel",
        fromRole: "On-call",
        toRecipientName: "Dr. Adeyemi",
        toRole: "Backup on-call",
        reason: "no_response_timeout",
        escalatedMinutesAgo: 2,
      },
    ],
  },
  {
    id: "case-002",
    patientId: "PT-2903",
    urgencyLevel: "moderate",
    status: "open",
    summary: "Medication query — pharmacy coordinating",
    triggerNote:
      "Patient reported dizziness after morning meds. Need pharmacy review before next Metformin dose.",
    triggeredByName: "Amaka Okafor",
    bedsideOwnerName: "Amaka Okafor",
    handoff: {
      status: "pending",
      outgoingOwnerName: "Amaka Okafor",
      offeredMinutesAgo: 12,
    },
    elapsedMinutes: 22,
    alerts: [
      {
        id: "alert-003",
        recipientName: "Pharmacy",
        role: "Pharmacy",
        status: "acknowledged",
        sentMinutesAgo: 20,
        acknowledgedMinutesAgo: 11,
      },
    ],
    notes: [],
    escalationTrail: [],
  },
  {
    id: "case-003",
    patientId: "PT-2756",
    urgencyLevel: "urgent",
    status: "reopened",
    summary: "BP spike returned — doctor reviewing orders",
    triggerNote:
      "BP 168/102 on recheck after brief improvement. Patient symptomatic with headache.",
    triggeredByName: "Amaka Okafor",
    bedsideOwnerName: "Amaka Okafor",
    reopenedFromCaseId: "case-003",
    reopenedAfterResolvedMinutesAgo: 120,
    priorResolutionSummary: "BP normalized after antihypertensive review",
    elapsedMinutes: 3,
    alerts: [
      {
        id: "alert-004",
        recipientName: "Dr. Patel",
        role: "On-call",
        status: "acknowledged",
        sentMinutesAgo: 3,
        acknowledgedMinutesAgo: 1,
      },
    ],
    notes: [
      {
        id: "note-002",
        authorName: "Amaka Okafor",
        authorRole: "RN",
        note: "Vitals stabilizing after earlier spike — still monitoring closely.",
        createdMinutesAgo: 1,
      },
    ],
    escalationTrail: [],
  },
  {
    id: "case-004",
    patientId: "PT-2944",
    urgencyLevel: "moderate",
    status: "resolved",
    summary: "Temperature elevation — resolved after review",
    triggerNote: "Temp 38.2°C with rigors. Blood cultures drawn, fluids started.",
    triggeredByName: "Amaka Okafor",
    elapsedMinutes: 240,
    resolvedMinutesAgo: 45,
    alerts: [
      {
        id: "alert-005",
        recipientName: "Dr. Patel",
        role: "On-call",
        status: "acknowledged",
        sentMinutesAgo: 238,
        acknowledgedMinutesAgo: 230,
      },
    ],
    notes: [
      {
        id: "note-003",
        authorName: "Dr. Patel",
        authorRole: "On-call",
        note: "Reviewed cultures — continue monitoring. Case can close from clinical side.",
        createdMinutesAgo: 50,
      },
    ],
    escalationTrail: [],
  },
];

export const initialCases: EmergencyCase[] = caseSeeds.map(enrichCase);

export function getPatientsAvailableForNewCase(cases: EmergencyCase[]) {
  return shiftPatients.filter((patient) => patientCanTriggerNewCase(cases, patient.id));
}
