import { DEPARTMENTS, SECTORS, STATUSES } from "./constants";
import type { ProjectRecord } from "./constants";

export const INITIAL_RECORDS: ProjectRecord[] = [
  {
    id: 1,
    name: "SETUP Exhibit at Camiguin",
    department: DEPARTMENTS.MIS,
    sectorCategory: SECTORS.SETUP,
    budget: 100000,
    status: STATUSES.ON_GOING,
    lastAccessed: "07-07-2026",
  },
  {
    id: 2,
    name: "JLSS Examination",
    department: DEPARTMENTS.SCC,
    sectorCategory: SECTORS.SCHOLARSHIPS,
    budget: 50000,
    status: STATUSES.UNDER_REVIEW,
    lastAccessed: "07-05-2026",
  },
  {
    id: 3,
    name: "2026 RSTW Northern Mindanao Venue at Camiguin",
    department: DEPARTMENTS.PLANNING,
    sectorCategory: SECTORS.SERVICES,
    budget: 300000,
    status: STATUSES.ON_GOING,
    lastAccessed: "07-04-2026",
  },
  {
    id: 4,
    name: "AI Robot Study Budy",
    department: DEPARTMENTS.MIS,
    sectorCategory: SECTORS.PROJECTS,
    budget: 60000,
    status: STATUSES.ON_GOING,
    lastAccessed: "07-02-2026",
  },
  {
    id: 5,
    name: "Community Water Purifier Deployment",
    department: DEPARTMENTS.PLANNING,
    sectorCategory: SECTORS.SERVICES,
    budget: 300000,
    status: STATUSES.ON_GOING,
    lastAccessed: "07-06-2026",
  },
];