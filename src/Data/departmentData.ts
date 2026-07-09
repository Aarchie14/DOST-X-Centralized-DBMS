// src/data/departmentData.ts

export interface Sector {
  name: string;
  percentage: string;
  count: number;
  color: string;
}

export interface DepartmentStats {
  totalFiles: number;
  projectRecords: number;
  sectors: number;
  distribution: Sector[];
}

export const departmentStats: Record<string, DepartmentStats> = {
  "All department": {
    totalFiles: 2,
    projectRecords: 5,
    sectors: 4,
    distribution: [
      { name: "SETUP (MSMEs)", percentage: "10%", count: 1, color: "from-orange-400 to-orange-500" },
      { name: "Scholarships", percentage: "10%", count: 1, color: "from-amber-400 to-amber-500" },
      { name: "S&T Services", percentage: "20%", count: 2, color: "from-cyan-400 to-cyan-500" },
      { name: "R&D Projects", percentage: "10%", count: 1, color: "from-emerald-400 to-emerald-500" }
    ]
  },
  "GAD": {
    totalFiles: 0,
    projectRecords: 0,
    sectors: 4,
    distribution: [
      { name: "SETUP (MSMEs)", percentage: "0%", count: 0, color: "from-orange-400 to-orange-500" },
      { name: "Scholarships", percentage: "0%", count: 0, color: "from-amber-400 to-amber-500" },
      { name: "S&T Services", percentage: "0%", count: 0, color: "from-cyan-400 to-cyan-500" },
      { name: "R&D Projects", percentage: "0%", count: 0, color: "from-emerald-400 to-emerald-500" }
    ]

      },
   "SCC": {
      totalFiles: 1,
      projectRecords: 2,
      sectors: 4,
      distribution: [
        { name: "SETUP (MSMEs)", percentage: "0%", count: 0, color: "from-orange-400 to-orange-500" },
        { name: "Scholarships", percentage: "10%", count: 1, color: "from-amber-400 to-amber-500" },
        { name: "S&T Services", percentage: "0%", count: 0, color: "from-cyan-400 to-cyan-500" },
        { name: "R&D Projects", percentage: "0%", count: 0, color: "from-emerald-400 to-emerald-500" }
      ]

  },
   "MIS": {
      totalFiles: 1,
      projectRecords: 2,
      sectors: 4,
      distribution: [
        { name: "SETUP (MSMEs)", percentage: "10%", count: 1, color: "from-orange-400 to-orange-500" },
        { name: "Scholarships", percentage: "0%", count: 0, color: "from-amber-400 to-amber-500" },
        { name: "S&T Services", percentage: "0%", count: 0, color: "from-cyan-400 to-cyan-500" },
        { name: "R&D Projects", percentage: "0%", count: 0, color: "from-emerald-400 to-emerald-500" }
      ]
        },
    "Planning": {
      totalFiles: 0,
      projectRecords: 2,
      sectors: 4,
      distribution: [
        { name: "SETUP (MSMEs)", percentage: "10%", count: 0, color: "from-orange-400 to-orange-500" },
        { name: "Scholarships", percentage: "0%", count: 0, color: "from-amber-400 to-amber-500" },
        { name: "S&T Services", percentage: "20%", count: 2, color: "from-cyan-400 to-cyan-500" },
        { name: "R&D Projects", percentage: "10%", count: 0, color: "from-emerald-400 to-emerald-500" }
      ]
    }
};