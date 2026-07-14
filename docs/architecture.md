# Architecture Overview

> **Last updated:** 2026-07-14

This document describes the system architecture of the DOST-X Centralized DBMS — its technology stack, folder structure, data model, authentication flow, routing strategy, and key design decisions. It is written for whoever inherits or maintains the project.

---

## 1. Technology Stack

| Layer | Technology | Version | Notes |
|-------|-----------|---------|-------|
| UI Framework | React | 19 | Function components + hooks only, no class components |
| Language | TypeScript | ~6.0 | Strict mode via `tsconfig.app.json` |
| Build Tool | Vite | 8 | Dev server + production bundler |
| Styling | Tailwind CSS | v4 | Configured via `@tailwindcss/vite` plugin; theme tokens live in `src/index.css` `@theme` block, not a `tailwind.config.js` |
| Routing | React Router | v7 | `BrowserRouter` with nested `<Route>` elements |
| Font | Google Sans Flex | Variable | Loaded via Google Fonts API in `index.html` |

### Notable: No Backend

The current version is a **frontend-only SPA**. All data (users, project records, files, activity logs) is persisted in `localStorage` / `sessionStorage`. There is no REST API or database server. This was a deliberate decision for the internship prototype phase — backend integration is a future milestone.

---

## 2. Folder Structure

```
DOST-X-Centralized-DBMS/
├── docs/                       # All project documentation
│   ├── architecture.md         # ← You are here
│   ├── setup.md                # Environment & build guide
│   ├── user-guide.md           # End-user manual
│   ├── progress-log.md         # Supervisor-facing progress tracker
│   ├── CHANGELOG.md            # Dev-facing change log
│   ├── turnover-checklist.md   # Handover checklist
│   ├── darkmode_design.md      # Dark mode design spec
│   └── unit_based_access.md    # Unit-based access implementation spec
├── public/                     # Static assets served as-is
├── src/
│   ├── assets/                 # Images (logos, hero banners)
│   ├── components/
│   │   ├── common/             # Reusable UI components
│   │   │   ├── DatabaseView.tsx        # Detailed project record viewer
│   │   │   ├── DeleteConfirmModal.tsx   # Confirmation dialog for deletions
│   │   │   ├── DepartmentDropdown.tsx   # Department filter (supports locked badge)
│   │   │   ├── ExportDropdown.tsx       # CSV/Excel export button menu
│   │   │   ├── FileTable.tsx            # File repository table
│   │   │   ├── FileUploadZone.tsx       # Drag-and-drop file upload area
│   │   │   ├── ProjectFormModal.tsx     # Create/edit project record modal
│   │   │   ├── ProjectTable.tsx         # Project records data table
│   │   │   ├── TableToolbar.tsx         # Search + filter + action bar
│   │   │   ├── Toast.tsx                # Notification toast component
│   │   │   ├── UserFormModal.tsx        # Create/edit user modal
│   │   │   ├── UserTable.tsx            # User management table
│   │   │   └── UserToolbar.tsx          # User management action bar
│   │   └── layout/
│   │       ├── Navbar.tsx               # Top navigation bar (clock, theme toggle)
│   │       └── Sidebar.tsx              # Collapsible left navigation sidebar
│   ├── config/
│   │   ├── constants.ts         # Enums: departments, sectors, statuses, interfaces
│   │   └── mockData.ts          # Seed data for project records
│   ├── context/
│   │   ├── AuthContext.tsx       # Global auth state provider (login, logout, user CRUD)
│   │   └── SidebarContext.tsx    # Global sidebar collapsed/hovered state
│   ├── Data/
│   │   └── departmentData.ts    # Dashboard statistics by department
│   ├── hooks/
│   │   ├── useDatabaseView.ts       # Logic for the detailed record view
│   │   ├── useFileRepository.ts     # File repository state (currently unused)
│   │   ├── useInactivityLogout.ts   # Auto-logout after 15 min inactivity
│   │   ├── useProjectDatabase.ts    # Project CRUD, pagination, filtering, export
│   │   └── useUserManagement.ts     # User CRUD operations
│   ├── pages/
│   │   ├── LoginPage.tsx        # Authentication screen
│   │   ├── Dashboard.tsx        # Main dashboard with stats and charts
│   │   ├── ProjectDatabase.tsx  # Project records management page
│   │   ├── FileRepository.tsx   # File upload and browsing page
│   │   ├── UserManagement.tsx   # Admin-only user accounts page
│   │   ├── ActivityLogs.tsx     # Admin-only audit trail viewer
│   │   ├── SystemInfo.tsx       # Admin-only system information page
│   │   ├── UserProfile.tsx      # Self-service profile page
│   │   └── NakedContent.tsx     # Minimal layout wrapper
│   ├── types/
│   │   └── auth.ts              # User, ActivityLog, Permission types + seed data
│   ├── utils/
│   │   ├── storage.ts           # localStorage/sessionStorage JSON helpers
│   │   ├── unitAccess.ts        # Unit-based access scoping utilities
│   │   └── userSanitizer.ts     # User record normalization
│   ├── App.tsx                  # Root component with routing
│   ├── main.tsx                 # React DOM entry point
│   └── index.css                # Global styles, Tailwind theme, dark mode overrides
├── index.html                   # HTML shell (Google Fonts, theme init script)
├── vite.config.ts               # Vite configuration (React + Tailwind plugins)
├── tsconfig.json                # TypeScript project references
├── tsconfig.app.json            # App-level TS config
├── tsconfig.node.json           # Node-level TS config (for vite.config.ts)
├── eslint.config.js             # ESLint configuration
├── package.json                 # Dependencies and scripts
└── README.md                    # Project landing page
```

---

## 3. Authentication & Authorization Model

### Authentication

- **Provider:** `AuthContext` (`src/context/AuthContext.tsx`) wraps the entire app in `main.tsx`.
- **Storage:** The current session user is stored in `sessionStorage` (survives refreshes, clears on tab close). The user list is persisted in `localStorage`.
- **Login Flow:** Email + password → matched against the in-memory `users[]` array → on success, strips the password field and stores the session user. Brute-force protection via a 5-attempt lockout (30-second cooldown).
- **Auto-Logout:** `useInactivityLogout` hook (in `App.tsx`) triggers `logout()` after 15 minutes (900,000 ms) of no mouse/keyboard activity.

### Authorization (Two Roles)

| Capability | `admin` | `user` |
|------------|---------|--------|
| View own department's data | ✅ | ✅ |
| View all departments' data | ✅ | ❌ (locked to `user.department`) |
| Create / Edit / Delete project records | ✅ | ❌ |
| Upload / Delete files | ✅ | ❌ |
| Manage users (CRUD) | ✅ | ❌ |
| View activity logs | ✅ | ❌ |
| View system info | ✅ | ❌ |
| Export CSV/Excel (own visible data) | ✅ | ✅ |

### Unit-Based Access Control

Implemented in `src/utils/unitAccess.ts`. Key functions:

- `hasFullUnitAccess(user)` → `true` for admins
- `getUnitLock(user)` → returns `user.department` for restricted users, `null` for admins
- `scopeToUnit(records, user)` → filters any `{ department: string }[]` to the user's unit
- `resolveInitialDepartment(user, fallback)` → sets the initial dropdown value

This scoping is applied in:
- `useProjectDatabase.ts` — project table, pagination, and CSV/Excel exports
- `FileRepository.tsx` — file listing
- `Dashboard.tsx` — department statistics and chart data

---

## 4. Routing Architecture

Defined in `App.tsx` using React Router v7's nested route pattern:

```
/login                          → LoginPage (public)
/dashboard                      → Dashboard (protected)
/dashboard/database             → ProjectDatabase (protected)
/dashboard/repository           → FileRepository (protected)
/dashboard/profile              → UserProfile (protected)
/dashboard/management           → UserManagement (admin-only)
/dashboard/logs                 → ActivityLogs (admin-only)
/dashboard/info                 → SystemInfo (admin-only)
*                               → Redirect to /dashboard or /login
```

**Route Guards:**
- `ProtectedLayout` — redirects to `/login` if no session user exists
- `AdminRoute` — redirects to `/dashboard` if `user.role !== "admin"`

---

## 5. Styling Architecture

### Tailwind CSS v4 (CSS-First Configuration)

There is **no `tailwind.config.js`**. Tailwind v4 uses the `@theme` block inside `src/index.css`:

```css
@theme {
  --font-sans: "Google Sans Flex", sans-serif;
}
```

### Dark Mode

- Toggled via `html.dark` class (set in `Navbar.tsx`, persisted in `localStorage`).
- An inline `<script>` in `index.html` reads the theme from `localStorage` on page load to prevent flash of wrong theme.
- All dark mode overrides live in `src/index.css` under the comment `/* --- Global Dark Mode Design System Override --- */`.
- Design tokens follow the spec in `docs/darkmode_design.md`: deep dark blue surface elevation scale (`#0A0E1A` → `#253262`), accent blue (`#4C7DFF`), and semantic status colors.

### Sidebar

- State managed via `SidebarContext` (`collapsed` + `hovered`).
- Minimized by default (64px wide), expands on hover or via a toggle arrow button.
- Content area padding adjusts via CSS overrides in `src/index.css` targeting `sm:pl-64` utility classes.

---

## 6. Data Model

### Project Record (`ProjectRecord`)

```ts
interface ProjectRecord {
  id: number;
  name: string;
  department: "MIS" | "SCC" | "GAD" | "Planning";
  sectorCategory: "SETUP (MSMEs)" | "Scholarships" | "S&T Services" | "R&D Projects";
  budget: number;
  status: "On going" | "Under Review" | "Completed";
  lastAccessed: string;  // formatted as "MM-DD-YYYY"
}
```

### User

```ts
type User = {
  email: string;
  role: "admin" | "user";
  name: string;
  department: string;
  systemAccess: Permission[];
  password?: string;       // stripped from session storage
};
```

### Activity Log

```ts
interface ActivityLog {
  id: string;              // "log-{timestamp}"
  userName: string;
  userEmail: string;
  action: string;
  details: string;
  timestamp: string;       // ISO 8601
}
```

---

## 7. Key Design Decisions

| Decision | Rationale |
|----------|-----------|
| No backend / localStorage persistence | Internship prototype scope — backend is a future milestone |
| Tailwind v4 CSS-first config | No `tailwind.config.js` needed; theme tokens in CSS are simpler to maintain |
| Unit-based access via utility functions | Centralized scoping logic in one file (`unitAccess.ts`) rather than scattered role checks |
| Dark mode via CSS `html.dark` overrides | Avoids component-level conditional styling; one stylesheet controls the entire theme |
| Sidebar state via React Context | Shared across Navbar, Sidebar, and content area padding without prop drilling |
| Google Sans Flex variable font | Single font file covers all weights, reducing HTTP requests |
