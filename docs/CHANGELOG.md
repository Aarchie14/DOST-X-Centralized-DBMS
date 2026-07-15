# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/), and this project adheres to [Semantic Versioning](https://semver.org/).

---

## [Unreleased]

### Added
- **Backend/Frontend Integration** — Connected the Vite + React frontend to the Node/Express + MySQL backend (`dost-backend`).
  - Created `src/utils/api.ts`: a central fetch utility covering auth, users, datasets, records, files, dashboard, and audit logs. JWT token is auto-attached from `localStorage`.
  - **Login now accepts username OR email** — `LoginPage.tsx` uses a single identifier field; backend `authController.js` performs `WHERE username = ? OR email = ?`.
  - **User management** — `AuthContext.tsx` calls `POST /users` and `PUT /users/:id` for create/update. `email`, `department`, and `system_access` fields are persisted to the database.
  - **Project Database (datasets)** — `useProjectDatabase.ts` fetches datasets from `GET /datasets` on mount and calls `POST / PUT / DELETE /datasets` for CRUD. `department`, `sector_category`, `budget`, and `status` are saved to the database.
  - **Dataset records** — `useDatabaseView.ts` fetches rows from `GET /datasets/:id/records` and persists add/edit/delete to `POST / PUT / DELETE /records`.
  - **File Repository** — `FileRepository.tsx` fetches file list from `GET /files`, uploads via `POST /files` (multipart with `department`), downloads via `GET /files/:id/download` (binary stream), and deletes via `DELETE /files/:id`.
  - `FileTable.tsx` `onDownload` prop updated to receive `(fileName, fileId)` to route downloads through the backend.
- **Extended database schema** — `migrate.js` updated; `alter_schema.js` added to safely migrate existing tables:
  - `users`: `email`, `department`, `system_access` (JSON)
  - `datasets`: `department`, `sector_category`, `budget`, `status`, `last_accessed`
  - `files`: `department`, `sector_category`
- **Improved Activity Logging** — Added logging support for viewing detailed project record databases, exporting project data (CSV/Excel), and downloading repository files. Now, activities of all users (both admins and standard staff users) are fully recorded in the Activity Logs.
- **File size tracking in File Repository** — Added file size field to `useFileRepository.ts` and `FileRepository.tsx`. Developed `src/utils/fileUtils.ts` formatting helper. Displays file size column in `FileTable.tsx` and dynamically computes file size upon file upload.
- **Google Sans Flex font** — integrated system-wide via Google Fonts API and Tailwind v4 `@theme` block.
- **Collapsible sidebar** — minimized by default, expands on hover, toggle arrow button to pin state; managed via `SidebarContext`.
- **Dark mode** — full theme toggle with deep dark blue palette (`docs/darkmode_design.md`); CSS custom property token system; flash prevention script; styled tables, forms, badges, modals, checkboxes, sidebar, and CTAs.
- **Unit-based access control** — `src/utils/unitAccess.ts` utility; restricted users see only their department's data on Dashboard, Project Database, and File Repository; department dropdown renders as locked badge for non-admin users; CSV/Excel exports scoped to user's unit.
- **Documentation framework** — `docs/architecture.md`, `docs/setup.md`, `docs/user-guide.md`, `docs/progress-log.md`, `docs/CHANGELOG.md`, `docs/turnover-checklist.md`.
- **README.md** — rewrote project landing page (replaced broken merge-conflict content) with quick start, demo credentials, and doc links.

### Changed
- **Default theme behavior** — Changed the theme initialization logic in `index.html` to default to light mode on the first visit (ignoring device system preferences for dark mode). Reset theme to light mode on logout so that next sessions always start in light mode.

### Fixed
- **User profile self-editing** — Allowed non-admin users to edit their names on `UserProfile.tsx` by updating `userRoutes.js` and `AuthContext.tsx` to handle self-updates using their session database ID.
- **Admin name update sync** — Added backend session synchronization on mount (`api.me()`), meaning modifications to usernames are immediately reflected upon refresh without requiring logouts.
- **User management refresh stabilization** — Fixed page refresh issues on User Management page by sequencing the initialization flow sequentially.
- **Hydration warning** — removed stray `{" "}` whitespace text node between `</thead>` and `</table>` in `UserTable.tsx`.
- **Merge conflict in README.md** — resolved lingering `<<<<<<<` / `>>>>>>>` markers from a prior git merge.

---

<!-- TEMPLATE FOR NEW RELEASES — copy this block above [Unreleased]:

## [X.Y.Z] — YYYY-MM-DD

### Added
- ...

### Changed
- ...

### Fixed
- ...

### Removed
- ...

-->
