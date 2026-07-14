# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/), and this project adheres to [Semantic Versioning](https://semver.org/).

---

## [Unreleased]

### Added
- **Google Sans Flex font** — integrated system-wide via Google Fonts API and Tailwind v4 `@theme` block.
- **Collapsible sidebar** — minimized by default, expands on hover, toggle arrow button to pin state; managed via `SidebarContext`.
- **Dark mode** — full theme toggle with deep dark blue palette (`docs/darkmode_design.md`); CSS custom property token system; flash prevention script; styled tables, forms, badges, modals, checkboxes, sidebar, and CTAs.
- **Unit-based access control** — `src/utils/unitAccess.ts` utility; restricted users see only their department's data on Dashboard, Project Database, and File Repository; department dropdown renders as locked badge for non-admin users; CSV/Excel exports scoped to user's unit.
- **Documentation framework** — `docs/architecture.md`, `docs/setup.md`, `docs/user-guide.md`, `docs/progress-log.md`, `docs/CHANGELOG.md`, `docs/turnover-checklist.md`.
- **README.md** — rewrote project landing page (replaced broken merge-conflict content) with quick start, demo credentials, and doc links.

### Fixed
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
