# Progress Log

> Supervisor-facing progress tracker. Each entry records what was accomplished, what's blocked, and what's planned next. Entries are appended chronologically — never overwritten.

---

## 2026-07-15 — Default Light Mode + File Size Tracking

### What Shipped

1. **Default Light Mode**
   - Configured theme initialization logic in `index.html` to default the application to Light Mode on first-time visits, overriding browser or system preferences.
   - Synchronized toggle state in `Navbar.tsx` seamlessly.

2. **File Size Tracking in File Repository**
   - Developed a general-purpose byte formatting utility `formatFileSize` in `src/utils/fileUtils.ts`.
   - Updated the `FileRecord` types in the hooks `useFileRepository.ts` and UI component `FileTable.tsx` to support the new `fileSize` field.
   - Introduced a new **Size** column in `FileTable.tsx` and adjusted layout column widths.
   - Modified `handleFileUpload` in `FileRepository.tsx` to automatically compute and format file sizes on client-side uploads.
   - Updated project documentation (`docs/user-guide.md`, `docs/CHANGELOG.md`) to reflect the new column and theme behavior.

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
