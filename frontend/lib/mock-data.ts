export type CaseUrgency = "critical" | "urgent" | "moderate";
export type VitalsStatus = "stable" | "watch" | "abnormal";

export interface ClinicalWarning {
  signal: string;
  trend: string;
  flaggedMinutesAgo: number;
}

export interface ShiftPatient {
  id: string;
  name: string;
  ward: string;
  bed: string;
  vitalsStatus: VitalsStatus;
  lastUpdatedMinutes: number;
  clinicalWarning?: ClinicalWarning;
}

export interface ShiftContext {
  nurseName: string;
  ward: string;
  shiftStart: string;
  shiftEnd: string;
  loggedInAt: Date;
  /** Demo flag — shift handoff window is active (see lib/handoff.ts). */
  handoffWindowActive?: boolean;
}

export interface NavBadges {
  myTasks: number;
  activeCases: number;
  messages: number;
}

const loggedInAt = new Date();
loggedInAt.setMinutes(loggedInAt.getMinutes() - 18);

export const shiftContext: ShiftContext = {
  nurseName: "Amaka Okafor",
  ward: "Ward 4B — Medical",
  shiftStart: "07:00",
  shiftEnd: "15:00",
  loggedInAt,
  handoffWindowActive: true,
};

export const shiftPatients: ShiftPatient[] = [
  {
    id: "PT-2841",
    name: "James Okonkwo",
    ward: "4B",
    bed: "12",
    vitalsStatus: "abnormal",
    lastUpdatedMinutes: 4,
  },
  {
    id: "PT-2903",
    name: "Fatima Bello",
    ward: "4B",
    bed: "08",
    vitalsStatus: "watch",
    lastUpdatedMinutes: 12,
  },
  {
    id: "PT-2756",
    name: "Emmanuel Adeyemi",
    ward: "4B",
    bed: "03",
    vitalsStatus: "stable",
    lastUpdatedMinutes: 18,
  },
  {
    id: "PT-3012",
    name: "Grace Eze",
    ward: "4B",
    bed: "15",
    vitalsStatus: "watch",
    lastUpdatedMinutes: 25,
    clinicalWarning: {
      signal: "SpO₂ softening",
      trend: "97% → 94% across last 2 checks",
      flaggedMinutesAgo: 25,
    },
  },
  {
    id: "PT-2688",
    name: "Chidi Nwosu",
    ward: "4B",
    bed: "06",
    vitalsStatus: "watch",
    lastUpdatedMinutes: 9,
    clinicalWarning: {
      signal: "Heart rate rising",
      trend: "92 → 98 bpm over 40 min",
      flaggedMinutesAgo: 9,
    },
  },
  {
    id: "PT-2944",
    name: "Amina Yusuf",
    ward: "4B",
    bed: "11",
    vitalsStatus: "watch",
    lastUpdatedMinutes: 31,
    clinicalWarning: {
      signal: "Temperature trending up",
      trend: "37.1°C → 37.8°C since morning",
      flaggedMinutesAgo: 31,
    },
  },
];
