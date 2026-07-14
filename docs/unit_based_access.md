# Unit-Based Organization — Implementation Instructions

Repo: `DOST-X-Centralized-DBMS`
Stack: React 19 + Vite + TypeScript + Tailwind v4, React Router v7.

## 1. Goal

Restrict dataset visibility by organizational unit. `MIS`, `SCC`, `GAD` (and `Planning`) are sample departments. Each unit's records are already tagged with a `department` field — what's missing is enforcement: a logged-in user should only ever see their own unit's dataset across the Dashboard, Project Database, and File Repository. Admins keep full cross-unit visibility (this matches the existing admin-only CRUD gating already in the codebase — do not change that part).

## 2. Current state (confirmed in repo, do not re-derive — just act on this)

- `User` type (`src/types/auth.ts`) already has `department: string` and `role: "admin" | "user"`. No new role type is needed for this task.
- `ProjectRecord` (`src/config/constants.ts`) and file records both carry a `department` field already.
- Three independent, unrestricted `selectedDepartment` filter states exist with zero access enforcement:
  - `src/hooks/useProjectDatabase.ts`
  - `src/pages/FileRepository.tsx` (state is inline in the page — note `src/hooks/useFileRepository.ts` exists but is **currently unused dead code**, the page does not import it)
  - `src/pages/Dashboard.tsx`
- `src/components/common/DepartmentDropdown.tsx` is a plain unrestricted `<select>` used two places: inside `TableToolbar.tsx` (→ `ProjectDatabase.tsx` and `FileRepository.tsx`) and directly inside `Dashboard.tsx`.
- CRUD actions (create/edit/delete project records, upload files) are **already** gated to `userRole === "admin"` at the component level (`TableToolbar`, `ProjectTable`, `DatabaseView`, `FileUploadZone`). **Do not touch that gating** — this task is additive: it only scopes *read/view* access for the `"user"` role. Admins are the only ones who currently reach create/edit/delete/upload anyway, so admin behavior must not change.

## 3. Access rule

- `role === "admin"` → unrestricted, sees every department, dropdown stays fully interactive, default stays `"All department"`.
- `role === "user"` → locked to `user.department`. Must not be able to view, filter into, or export another unit's data — including via export buttons or crafted state, not just the dropdown UI.

## 4. New shared utility — create this file

**Create `src/utils/unitAccess.ts`:**

```ts
import type { User } from "../types/auth";

/**
 * Returns true if the user is unrestricted and can view/manage every unit's dataset.
 * Currently only the "admin" role has cross-unit access.
 */
export const hasFullUnitAccess = (user: User | null): boolean =>
  user?.role === "admin";

/**
 * Returns the single department a restricted user is locked to, or null if the
 * user has full access (admin) or there is no authenticated user.
 */
export const getUnitLock = (user: User | null): string | null => {
  if (!user || hasFullUnitAccess(user)) return null;
  return user.department;
};

/**
 * Scopes a department-tagged record list down to what the given user is allowed
 * to see. Admins get the list untouched; restricted users only get records that
 * belong to their assigned unit.
 */
export const scopeToUnit = <T extends { department: string }>(
  records: T[],
  user: User | null,
): T[] => {
  const lock = getUnitLock(user);
  return lock ? records.filter((r) => r.department === lock) : records;
};

/**
 * Resolves the department a "selected department" filter/state should start at:
 * the user's own unit if restricted, otherwise the provided default (usually
 * "All department").
 */
export const resolveInitialDepartment = (
  user: User | null,
  fallback: string,
): string => getUnitLock(user) ?? fallback;
```

## 5. `src/components/common/DepartmentDropdown.tsx` — replace entire file

Add an optional `lockedTo` prop. When set, render a static locked badge instead of the interactive `<select>` (a restricted user has exactly one option anyway, so an interactive dropdown is misleading UI).

```tsx
/**
 * Interface for DepartmentDropdown component props.
 */
interface Props {
  value?: string;
  onChange?: (value: string) => void;
  /**
   * When provided, the dropdown is replaced with a static, non-interactive
   * badge showing this unit name. Used for unit-restricted (non-admin) users
   * who can only ever view their own department's dataset.
   */
  lockedTo?: string;
}

// Available options for the department filter
const departments = ["All department", "GAD", "SCC", "MIS", "Planning"];


/**
 * DepartmentDropdown Component
 * A styled select input for filtering records by organizational department.
 * Renders as a locked badge instead when `lockedTo` is provided.
 */
export function DepartmentDropdown({
  value = "All department",
  onChange,
  lockedTo,
}: Props) {
  if (lockedTo) {
    return (
      <div
        className="relative flex items-center gap-2 bg-slate-50 border border-slate-200 text-slate-600 font-bold text-xs pl-3 pr-3 py-2.5 rounded-xl cursor-not-allowed select-none"
        title="Your account is restricted to this unit's dataset"
      >
        <svg
          className="w-3.5 h-3.5 text-slate-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v2h8z"
          />
        </svg>
        <span>{lockedTo}</span>
      </div>
    );
  }

  return (
    <div className="relative flex items-center group">
      <label className="sr-only">Department</label>

      {/* Left Icon: Department Building */}
      <span className="absolute left-3 pointer-events-none text-slate-400 group-hover:text-[#00aeef] transition-colors z-10">
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
          />
        </svg>
      </span>

      {/* Styled Select Dropdown */}
      <select
        className="appearance-none bg-white hover:bg-slate-50 border-slate-200 border-1 text-slate-600 hover:text-slate-800 font-bold text-xs pl-9 pr-8 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-100 focus:border-[#00aeef] transition-all cursor-pointer shadow-2xs"
        value={value}
        onChange={(e) => onChange && onChange(e.target.value)}
        aria-label="Select department"
      >
        {departments.map((d) => (
          <option key={d} value={d}>
            {d}
          </option>
        ))}
      </select>

      {/* Right Icon: Custom Dropdown Indicator Chevron */}
      <span className="absolute right-3 pointer-events-none text-slate-400 text-[9px] group-hover:text-slate-600 transition-colors">
        ▼
      </span>
    </div>
  );
}

export default DepartmentDropdown;
```

## 6. `src/components/common/TableToolbar.tsx` — replace entire file

Add a `lockedDepartment?: string` prop and forward it to `DepartmentDropdown` as `lockedTo`.

```tsx
import { DepartmentDropdown } from "./DepartmentDropdown";
import { ExportDropdown } from "./ExportDropdown";

/**
 * Interface for TableToolbar component props.
 */
interface TableToolbarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  selectedDepartment: string;
  onDepartmentChange: (value: string) => void;
  // Add '?' to make these optional
  onNewRecordClick?: () => void;
  onExportCSV?: () => void;
  onExportExcel?: () => void;
  userRole?: "admin" | "user";
  /** When set, the department dropdown renders as a locked badge for this unit. */
  lockedDepartment?: string;
}

/**
 * TableToolbar Component
 * Provides search functionality, filtering, administrative creation actions, and data export options.
 */
export function TableToolbar({
  searchQuery,
  onSearchChange,
  selectedDepartment,
  onDepartmentChange,
  onNewRecordClick,
  onExportCSV,
  onExportExcel,
  userRole,
  lockedDepartment,
}: TableToolbarProps) {
  return (
    <div className="flex flex-wrap items-center gap-3 mb-6">
      {/* SECTION: Search Functionality */}
      <div className="flex-1 min-w-[280px] relative group">
        <svg
          className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search..."
          className="w-full bg-white border border-slate-200 text-sm text-slate-700 placeholder-slate-400 pl-11 pr-4 py-2.5 rounded-xl outline-none focus:border-[#00aeef] transition-all shadow-xs"
        />
      </div>

      {/* SECTION: Department Filter */}
      <DepartmentDropdown
        value={selectedDepartment}
        onChange={onDepartmentChange}
        lockedTo={lockedDepartment}
      />
      {/* SECTION: Administrative Actions */}
      {/* Render "New Record" button only for admins when action is provided */}
      {userRole === "admin" && onNewRecordClick && (
        <button
          onClick={onNewRecordClick}
          className="h-[42px] inline-flex items-center gap-2 bg-[#00aeef] text-white font-bold text-xs px-5 rounded-xl hover:bg-sky-600 transition-all active:scale-[0.98] cursor-pointer shadow-2xs"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.5}
              d="M12 4v16m8-8H4"
            />
          </svg>
          <span>New Record Entry</span>
        </button>
      )}

      {/* SECTION: Export Options */}
      {/* Only show export dropdown if at least one export method is defined */}
      {(onExportCSV || onExportExcel) && (
        <div className="h-[42px]">
          <ExportDropdown
            onExportCSV={onExportCSV ?? (() => {})}
            onExportExcel={onExportExcel ?? (() => {})}
          />
        </div>
      )}
    </div>
  );
}
```

## 7. `src/hooks/useProjectDatabase.ts` — targeted edits

**Edit 1 — imports and hoist `user` to the top of the hook.**

Find:
```ts
import { useState, useContext } from "react";
import { INITIAL_RECORDS } from "../config/mockData";
import type { ProjectRecord } from "../config/constants";
import { AuthContext } from "../context/AuthContext";

const ITEMS_PER_PAGE = 10;

/**
 * useProjectRecords Hook
 * Manages project data state, filtering, CRUD operations, 
 * pagination, and report export functionality.
 */
export function useProjectDatabase() {

  // --- UI STATE ---
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedDepartment, setSelectedDepartment] = useState<string>("All department");
```

Replace with:
```ts
import { useState, useContext } from "react";
import { INITIAL_RECORDS } from "../config/mockData";
import type { ProjectRecord } from "../config/constants";
import { AuthContext } from "../context/AuthContext";
import { scopeToUnit, resolveInitialDepartment } from "../utils/unitAccess";

const ITEMS_PER_PAGE = 10;

/**
 * useProjectRecords Hook
 * Manages project data state, filtering, CRUD operations, 
 * pagination, and report export functionality.
 */
export function useProjectDatabase() {
  const { addLog, user } = useContext(AuthContext)!;

  // --- UI STATE ---
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedDepartment, setSelectedDepartment] = useState<string>(() =>
    resolveInitialDepartment(user, "All department"),
  );
```

**Edit 2 — remove the now-duplicate `AuthContext` destructure and add a unit-scoped records derivation.**

Find:
```ts
  const [records, setRecords] = useState<ProjectRecord[]>(INITIAL_RECORDS);
  const { addLog } = useContext(AuthContext)!;
  
// --- NOTIFICATION STATE ---
```

Replace with:
```ts
  const [records, setRecords] = useState<ProjectRecord[]>(INITIAL_RECORDS);

  /** Records the current user is allowed to see (unit-scoped for non-admins). */
  const visibleRecords = scopeToUnit(records, user);

// --- NOTIFICATION STATE ---
```

**Edit 3 — export logic must read from `visibleRecords`, not raw `records`.**

Find:
```ts
  const getExportRecords = () => {
    if (selectedIds.size > 0) {
      return records.filter((rec) => selectedIds.has(rec.id));
    }
    return records;
  };
```

Replace with:
```ts
  const getExportRecords = () => {
    if (selectedIds.size > 0) {
      return visibleRecords.filter((rec) => selectedIds.has(rec.id));
    }
    return visibleRecords;
  };
```

**Edit 4 — pagination recompute after create must also be unit-scoped.**

Find:
```ts
      const totalFilteredCount = updatedRecords.filter((rec) => {
        const matchesDept = selectedDepartment === "All department" || rec.department === selectedDepartment;
        const matchesSearch = rec.name.toLowerCase().includes(searchQuery.toLowerCase()) || rec.sectorCategory.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesDept && matchesSearch;
      }).length;
```

Replace with:
```ts
      const totalFilteredCount = scopeToUnit(updatedRecords, user).filter((rec) => {
        const matchesDept = selectedDepartment === "All department" || rec.department === selectedDepartment;
        const matchesSearch = rec.name.toLowerCase().includes(searchQuery.toLowerCase()) || rec.sectorCategory.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesDept && matchesSearch;
      }).length;
```

**Edit 5 — the main table derivation must start from `visibleRecords`.**

Find:
```ts
  // --- DERIVED DATA ---
  const sortedAndFilteredRecords = records
    .filter((rec) => {
```

Replace with:
```ts
  // --- DERIVED DATA ---
  const sortedAndFilteredRecords = visibleRecords
    .filter((rec) => {
```

## 8. `src/pages/ProjectDatabase.tsx` — targeted edits

**Edit 1 — import the utility.**

Find:
```tsx
import type { ProjectRecord } from "../config/constants";
import { useLocation, useNavigate } from "react-router-dom"; // Added useLocation and kept useNavigate
```

Replace with:
```tsx
import type { ProjectRecord } from "../config/constants";
import { getUnitLock } from "../utils/unitAccess";
import { useLocation, useNavigate } from "react-router-dom"; // Added useLocation and kept useNavigate
```

**Edit 2 — compute the lock and pass it to `TableToolbar`.**

Find:
```tsx
  const { user } = useContext(AuthContext)!;

  // State to track the currently opened project database
  const [selectedProject, setSelectedProject] = useState<ProjectRecord | null>(null);
```

Replace with:
```tsx
  const { user } = useContext(AuthContext)!;
  const lockedDepartment = getUnitLock(user) ?? undefined;

  // State to track the currently opened project database
  const [selectedProject, setSelectedProject] = useState<ProjectRecord | null>(null);
```

Find:
```tsx
              <TableToolbar
                searchQuery={searchQuery}
                userRole={user?.role} 
                onSearchChange={(val) => {
                  setSearchQuery(val);
                  setCurrentPage(1);
                }}
                selectedDepartment={selectedDepartment}
                onDepartmentChange={(val) => {
                  setSelectedDepartment(val);
                  setCurrentPage(1);
                }}
                onNewRecordClick={handleOpenCreateModal}
                onExportCSV={handleExportCSV}
                onExportExcel={handleExportExcel}
              />
```

Replace with:
```tsx
              <TableToolbar
                searchQuery={searchQuery}
                userRole={user?.role} 
                onSearchChange={(val) => {
                  setSearchQuery(val);
                  setCurrentPage(1);
                }}
                selectedDepartment={selectedDepartment}
                onDepartmentChange={(val) => {
                  setSelectedDepartment(val);
                  setCurrentPage(1);
                }}
                onNewRecordClick={handleOpenCreateModal}
                onExportCSV={handleExportCSV}
                onExportExcel={handleExportExcel}
                lockedDepartment={lockedDepartment}
              />
```

## 9. `src/pages/FileRepository.tsx` — targeted edits

This page keeps its own inline state instead of using `useFileRepository.ts`. Apply scoping directly here (do not migrate it to the hook as part of this task — that's a separate cleanup, out of scope).

**Edit 1 — import and scope the state init.**

Find:
```tsx
import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function FileRepository({
}) {
  // 1. AuthContext Hook to access user role, logging, and authentication functions
  const { user, addLog } = useContext(AuthContext)!;

  // STATE HOOKS
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDepartment, setSelectedDepartment] =
    useState("All department");
```

Replace with:
```tsx
import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { scopeToUnit, getUnitLock, resolveInitialDepartment } from "../utils/unitAccess";

export default function FileRepository({
}) {
  // 1. AuthContext Hook to access user role, logging, and authentication functions
  const { user, addLog } = useContext(AuthContext)!;
  const lockedDepartment = getUnitLock(user) ?? undefined;

  // STATE HOOKS
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState(() =>
    resolveInitialDepartment(user, "All department"),
  );
```

**Edit 2 — scope the file list before filtering.**

Find:
```tsx
  // 2. DERIVED DATA
  const filteredFiles = files.filter((file) => {
    const matchesSearch = file.fileName
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesDept =
      selectedDepartment === "All department" ||
      file.department === selectedDepartment;
    return matchesSearch && matchesDept;
  });
```

Replace with:
```tsx
  // 2. DERIVED DATA
  const visibleFiles = scopeToUnit(files, user);

  const filteredFiles = visibleFiles.filter((file) => {
    const matchesSearch = file.fileName
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesDept =
      selectedDepartment === "All department" ||
      file.department === selectedDepartment;
    return matchesSearch && matchesDept;
  });
```

**Edit 3 — pass the lock to `TableToolbar`.**

Find:
```tsx
          <TableToolbar
            searchQuery={searchQuery}
            onSearchChange={handleSearchChange}
            selectedDepartment={selectedDepartment}
            onDepartmentChange={handleDeptChange}
          />
```

Replace with:
```tsx
          <TableToolbar
            searchQuery={searchQuery}
            onSearchChange={handleSearchChange}
            selectedDepartment={selectedDepartment}
            onDepartmentChange={handleDeptChange}
            lockedDepartment={lockedDepartment}
          />
```

## 10. `src/hooks/useFileRepository.ts` — replace entire file

This hook is currently unused (dead code — `FileRepository.tsx` duplicates its own state instead of importing it). Bring it in line with the same scoping pattern anyway, so it isn't a latent gap if someone wires it in later:

```ts
import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { scopeToUnit, resolveInitialDepartment } from "../utils/unitAccess";

/**
 * Interface representing a file entry within the repository.
 */
interface FileRecord {
  id: number;
  fileName: string;
  department: string;
  sectorCategory: string;
  lastAccessed: string;
}

/**
 * useFileRepository Hook
 * Manages the state and filtering logic for the departmental file repository.
 */
export function useFileRepository() {
  const { user } = useContext(AuthContext)!;

  // --- DATA STATE ---
  const [files, setFiles] = useState<FileRecord[]>([
    { id: 1, fileName: "SETUP Food Processing.csv", department: "MIS", sectorCategory: "SETUP (MSMEs)", lastAccessed: "07-07-2026" },
  ]);

  // --- UI STATE ---
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState(() =>
    resolveInitialDepartment(user, "All department"),
  );

  /**
   * Removes a file record from the repository by its unique ID.
   * @param id - The unique identifier of the file to delete.
   */
  const handleDeleteFile = (id: number) => {
    setFiles(files.filter(f => f.id !== id));
  };

  // --- DERIVED DATA ---
  /**
   * Computed list of files based on active search criteria and department filters.
   */
  const visibleFiles = scopeToUnit(files, user);

  const filteredFiles = visibleFiles.filter(f => {
    const matchesDept = selectedDepartment === "All department" || f.department === selectedDepartment;
    const matchesSearch = f.fileName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesDept && matchesSearch;
  });

  return { files: filteredFiles, searchQuery, setSearchQuery, selectedDepartment, setSelectedDepartment, handleDeleteFile };
}
```

## 11. `src/pages/Dashboard.tsx` — targeted edits

This page uses `DepartmentDropdown` directly (not via `TableToolbar`).

**Edit 1 — import and scope the state init.**

Find:
```tsx
import { departmentStats } from "../Data/departmentData";
import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  // 1. AuthContext Hook to access user role and authentication functions
  const { user } = useContext(AuthContext)!;
  const navigate = useNavigate();

  if (!user) return null;

  // 2. STATE INTERFACES LOGIC HOOKS
  const [selectedDepartment, setSelectedDepartment] =
    useState<string>("All department");
```

Replace with:
```tsx
import { departmentStats } from "../Data/departmentData";
import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { getUnitLock, resolveInitialDepartment } from "../utils/unitAccess";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  // 1. AuthContext Hook to access user role and authentication functions
  const { user } = useContext(AuthContext)!;
  const navigate = useNavigate();

  if (!user) return null;

  // 2. STATE INTERFACES LOGIC HOOKS
  const lockedDepartment = getUnitLock(user) ?? undefined;
  const [selectedDepartment, setSelectedDepartment] = useState<string>(() =>
    resolveInitialDepartment(user, "All department"),
  );
```

**Edit 2 — pass the lock to `DepartmentDropdown`.**

Find:
```tsx
                {/* Dropdown Component Wrapper */}
                <DepartmentDropdown
                  value={selectedDepartment}
                  onChange={(val) => setSelectedDepartment(val)}
                />
```

Replace with:
```tsx
                {/* Dropdown Component Wrapper */}
                <DepartmentDropdown
                  value={selectedDepartment}
                  onChange={(val) => setSelectedDepartment(val)}
                  lockedTo={lockedDepartment}
                />
```

`currentStats` already derives from `departmentStats[selectedDepartment]`, so once `selectedDepartment` initializes locked to the user's unit, the stats cards and sector chart scope correctly with no further change needed.

## 12. Non-goals — do not do these as part of this task

- Do not change the existing admin-only CRUD/upload gating in `TableToolbar`, `ProjectTable`, `DatabaseView`, or `FileUploadZone`.
- Do not introduce a new "manager" role. This task only distinguishes `admin` (full access) vs `user` (single-unit lock), matching the `User` type that already exists.
- Do not modify `ProjectFormModal.tsx` or `UserFormModal.tsx` — only admins can currently open them, and admins must keep unrestricted department choice.
- Do not migrate `FileRepository.tsx` to use the `useFileRepository.ts` hook — flagged as dead code above, but consolidating it is a separate cleanup task.

## 13. Acceptance checklist

- [ ] Log in as `user@dost.gov.ph` (department: `SCC`). Dashboard shows only SCC stats; the department control is a locked badge reading "SCC", not a dropdown.
- [ ] Same account on Project Database: table only ever shows `SCC`-department rows; department control is locked.
- [ ] Same account on File Repository: table only ever shows `SCC` files; department control is locked.
- [ ] Log in as `admin@dost.gov.ph`. All three pages behave exactly as before — full interactive dropdown, "All department" default, every unit visible.
- [ ] CSV/Excel export as the restricted user never contains rows outside their unit, even if `selectedIds` or state were manipulated.
- [ ] `tsc -b` and `npm run build` succeed with no type errors.
