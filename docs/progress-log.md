# Progress Log

> Supervisor-facing progress tracker. Each entry records what was accomplished, what's blocked, and what's planned next. Entries are appended chronologically — never overwritten.

---

## 2026-07-15 — Backend/Frontend API Integration

### What Shipped

1. **Backend Schema Extended**
   - `alter_schema.js` added to the `dost-backend` project to safely add new columns to existing tables without dropping data.
   - `users` table: added `email` (VARCHAR UNIQUE), `department` (VARCHAR), `system_access` (JSON).
   - `datasets` table: added `department`, `sector_category`, `budget`, `status`, `last_accessed`.
   - `files` table: added `department`, `sector_category`.
   - `migrate.js` updated with the extended schema for fresh installations.

2. **Backend Controllers Updated**
   - `authController.js`: login now queries `WHERE username = ? OR email = ?` and returns `department` and `system_access` in the JWT payload and response.
   - `userController.js`: `listUsers`, `createUser`, `updateUser` now handle `email`, `department`, and `system_access`.
   - `datasetController.js`: `listDatasets`, `createDataset`, `updateDataset` now handle `department`, `sector_category`, `budget`, `status`, `last_accessed`.
   - `fileController.js`: `listFiles` and `uploadFile` now handle `department` and `sector_category`.

3. **Frontend API Layer Created**
   - `src/utils/api.ts`: central fetch wrapper auto-attaching JWT from `localStorage`. Covers all endpoints: auth, users, roles, datasets, records, files, dashboard, audit logs.

4. **Frontend Contexts and Hooks Wired to Backend**
   - `AuthContext.tsx` rewired: login calls `POST /auth/login`, user CRUD calls `/users` endpoints, JWT saved in `localStorage`.
   - `LoginPage.tsx`: single identifier field accepts username OR email.
   - `useProjectDatabase.ts`: loads from `GET /datasets`; CRUD via `POST / PUT / DELETE /datasets`.
   - `useDatabaseView.ts`: loads from `GET /datasets/:id/records`; CRUD via records endpoints.
   - `FileRepository.tsx`: fetches `GET /files`, uploads to `POST /files` (multipart + department), downloads via `GET /files/:id/download`, deletes via `DELETE /files/:id`.
   - `FileTable.tsx`: `onDownload` prop updated to pass `(fileName, fileId)`.

5. **TypeScript Validation**
   - `npx tsc --noEmit` passes with zero errors after all integration changes.

6. **Session & Profile Synchronization Fixes**
   - Refactored `AuthContext.tsx` mount effect to sequentially synchronize session state with the backend database (`api.me()`). This fixes page refresh inconsistencies in the User Management tab and retrieves the latest user profile updates dynamically.
   - Allowed standard users to update their own profiles (e.g., editing their display name) on `PUT /users/:id` by adding self-update permissions check on the backend router and updating `userController.js` to secure administrative fields.
   - Added database `id` mapping to the frontend `User` model to allow standard users to perform self-profile updates seamlessly.

### What's Blocked
- None.

### Planned Next
- Seed additional test users with `email`, `department`, and `system_access` in the backend database.
- Wire `Dashboard.tsx` statistics cards to `GET /dashboard`.
- Wire Activity Logs page to `GET /audit-logs` for backend-persisted log entries.

---

## 2026-07-15 — Default Light Mode + File Size Tracking


### What Shipped

1. **Default Light Mode**
   - Configured theme initialization logic in `index.html` to default the application to Light Mode on first-time visits, overriding browser or system preferences.
   - Synchronized toggle state in `Navbar.tsx` seamlessly.
   - Updated the `logout` function in `AuthContext.tsx` to reset the theme to `"light"` in `localStorage` and remove the `"dark"` class from `document.documentElement` immediately. This ensures any subsequent login session starts in Light Mode by default regardless of the previous user's session theme choice.

2. **File Size Tracking in File Repository**
   - Developed a general-purpose byte formatting utility `formatFileSize` in `src/utils/fileUtils.ts`.
   - Updated the `FileRecord` types in the hooks `useFileRepository.ts` and UI component `FileTable.tsx` to support the new `fileSize` field.
   - Introduced a new **Size** column in `FileTable.tsx` and adjusted layout column widths.
   - Modified `handleFileUpload` in `FileRepository.tsx` to automatically compute and format file sizes on client-side uploads.
   - Updated project documentation (`docs/user-guide.md`, `docs/CHANGELOG.md`) to reflect the new column and theme behavior.

3. **Improved Activity Logging**
   - Added logging support for viewing a detailed project database (`onProjectClick` in `ProjectDatabase.tsx`).
   - Added logging support for exporting project database records to CSV/Excel (`handleExportCSV` and `handleExportExcel` in `useProjectDatabase.ts`).
   - Added logging support for downloading files from the file repository (`handleDownload` in `FileRepository.tsx`).
   - This ensures all actions by both administrators and standard staff users within these tables are fully recorded in the Activity Logs.

### What's Blocked

- Nothing currently blocked.

### What's Next

- Backend API integration (authentication, database, file storage).
- Responsive mobile layout improvements.
- Automated testing setup (unit tests, integration tests).
- Deployment to staging environment.

---

## 2026-07-14 — UI Overhaul + Unit-Based Access Control

### What Shipped

1. **System-Wide Font Integration**
   - Integrated Google Sans Flex variable font from Google Fonts API.
   - Configured Tailwind v4 `@theme` block to use it as the default sans-serif font.

2. **Collapsible Sidebar**
   - Created `SidebarContext` for global sidebar state management.
   - Sidebar is minimized by default (icon-only, 64px wide).
   - Expands on hover with smooth CSS transitions.
   - Toggle arrow button to pin the sidebar open/closed (persisted in `localStorage`).
   - Content area padding adjusts dynamically when sidebar state changes.

3. **Dark Mode System**
   - Added a theme toggle button (sun/moon icon) to the top navigation bar.
   - Implemented a deep dark blue palette following the design specification in `docs/darkmode_design.md`.
   - Defined CSS custom property tokens for surfaces, borders, text, accent, and status colors.
   - Styled all components: tables, forms, buttons, badges, modals, checkboxes, sidebar, and export CTAs.
   - Flash prevention via inline `<script>` in `index.html` that reads theme from `localStorage` before first paint.

4. **Unit-Based Access Control**
   - Created `src/utils/unitAccess.ts` with reusable scoping functions.
   - Department dropdown renders as a locked badge for restricted (`user` role) accounts.
   - Project Database: table data, pagination, and CSV/Excel exports scoped to user's department.
   - File Repository: file listing scoped to user's department.
   - Dashboard: stats and charts default to user's department.
   - Admin users retain full cross-unit access — no behavioral change for admins.

5. **Documentation Framework**
   - Created `docs/architecture.md`, `docs/setup.md`, `docs/user-guide.md`, `docs/progress-log.md`, `docs/CHANGELOG.md`, `docs/turnover-checklist.md`.
   - Rewrote `README.md` (previously had unresolved git merge conflicts) as a proper project landing page.

### What's Blocked

- Nothing currently blocked.

### What's Next

- Backend API integration (authentication, database, file storage).
- Responsive mobile layout improvements.
- Automated testing setup (unit tests, integration tests).
- Deployment to staging environment.

---

<!-- TEMPLATE FOR NEW ENTRIES — copy this block, fill it in, paste it above the previous entry:

## YYYY-MM-DD — [Short Title]

### What Shipped
- Item 1
- Item 2

### What's Blocked
- Item 1 (or "Nothing currently blocked.")

### What's Next
- Item 1
- Item 2

-->
