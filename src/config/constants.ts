// src/config/constants.ts

export const DEPARTMENTS = {
  ALL: "All department",
  MIS: "MIS",
  SCC: "SCC",
  PLANNING: "Planning",
  GAD: "GAD",
} as const;

export const SECTORS = {
  SETUP: "SETUP (MSMEs)",
  SCHOLARSHIPS: "Scholarships", 
  SERVICES: "S&T Services",
  PROJECTS: "R&D Projects",
} as const;

export const STATUSES = {
  ON_GOING: "On going",
  UNDER_REVIEW: "Under Review",
  COMPLETED: "Completed",
} as const;

// TypeScript strict helper types extracted from the configurations
export type Department = typeof DEPARTMENTS[keyof typeof DEPARTMENTS];
export type Sector = typeof SECTORS[keyof typeof SECTORS];
export type ProjectStatus = typeof STATUSES[keyof typeof STATUSES];

export interface ProjectRecord {
  id: number;
  name: string;
  department: Exclude<Department, "All department">; 
  sectorCategory: Sector;
  budget: number;
  status: ProjectStatus;
  lastAccessed: string;
}

export interface FileRecord {
  id: number;
  fileName: string;
  department: string;
  sectorCategory: string;
  lastAccessed: string;
}