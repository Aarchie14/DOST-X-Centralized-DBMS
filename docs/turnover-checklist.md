# Turnover Checklist

> **Last updated:** 2026-07-14
>
> This document is for whoever inherits or takes over the DOST-X Centralized DBMS project. It covers known issues, pending work, key contacts, and access information.

---

## 1. Project Status Summary

| Area | Status | Notes |
|------|--------|-------|
| Core UI (Dashboard, Database, Files, Users) | ✅ Complete | All CRUD operations functional |
| Authentication & Authorization | ✅ Complete | Login, logout, role-based access, unit-based scoping |
| Dark Mode | ✅ Complete | Full design system implementation |
| Collapsible Sidebar | ✅ Complete | Hover + toggle, state persisted |
| Backend Integration | ❌ Not Started | Currently using `localStorage` — no API server |
| Automated Testing | ❌ Not Started | No test framework configured |
| Deployment | ❌ Not Started | Currently local dev only |

---

## 2. Known Issues

| # | Issue | Severity | Notes |
|---|-------|----------|-------|
| 1 | All data lives in `localStorage` — clearing browser data resets everything | High | By design for prototype phase; backend integration will resolve this |
| 2 | `useFileRepository.ts` hook is dead code — `FileRepository.tsx` manages its own inline state | Low | Functional but inconsistent pattern; consolidation is a cleanup task |
| 3 | Multi-tab usage can cause data desynchronization | Medium | `localStorage` events are not listened to; single-tab use recommended |
| 4 | Passwords stored in plaintext in `localStorage` | High | Acceptable for prototype; must use hashed passwords with a real backend |
| 5 | No input validation on budget field beyond "not empty" | Low | Accepts any number, including negatives |

---

## 3. Pending Work / Backlog

### High Priority
- [ ] **Backend API integration** — Replace `localStorage` persistence with a proper database and REST/GraphQL API. This is the most critical next step.
- [ ] **Real authentication** — Implement JWT or session-based auth with hashed passwords on the server side.
- [ ] **Deployment pipeline** — Set up CI/CD and deploy to a staging/production environment.

### Medium Priority
- [ ] **Automated testing** — Add a test framework (Vitest recommended for Vite projects) with unit tests for hooks and utility functions.
- [ ] **File storage** — Integrate actual file upload to a storage service (S3, MinIO, or server filesystem) instead of browser-only state.
- [ ] **Mobile responsiveness** — Improve layouts for tablet and phone screen sizes.
- [ ] **Consolidate `useFileRepository.ts`** — Migrate `FileRepository.tsx` inline state into the existing hook for consistency.

### Low Priority
- [ ] **Accessibility audit** — Ensure WCAG 2.1 AA compliance (keyboard navigation, screen reader support, color contrast).
- [ ] **Performance optimization** — Add React.memo, useMemo, and virtual scrolling for large datasets.
- [ ] **Internationalization** — If the system needs to support languages beyond English.

---

## 4. Repository & Access

| Item | Details |
|------|---------|
| **Repository** | `https://github.com/punyeeta/DOST-X-Centralized-DBMS` |
| **Branch strategy** | `main` — primary development branch |
| **Hosting** | Not yet deployed (local dev only) |
| **Domain** | Not yet assigned |

---

## 5. Key Contacts

| Role | Name | Contact | Notes |
|------|------|---------|-------|
| Intern Developer | *(fill in your name)* | *(fill in email/contact)* | Primary developer during internship |
| Supervisor | *(fill in supervisor name)* | *(fill in email/contact)* | DOST-X project supervisor |
| Repository Owner | `punyeeta` | GitHub account | Has admin access to the repository |

> ⚠️ **Do not paste passwords, API keys, or secrets in this file.** Use a secure credential manager or internal DOST-X documentation for sensitive access information.

---

## 6. How to Get Up and Running

1. See [docs/setup.md](setup.md) for full clone → install → run instructions.
2. See [docs/architecture.md](architecture.md) for understanding the codebase structure.
3. See [docs/user-guide.md](user-guide.md) for understanding the application from an end-user perspective.

---

## 7. Documentation Index

| Document | Purpose | Update Frequency |
|----------|---------|-----------------|
| [README.md](../README.md) | Project overview + quick start | When project scope changes |
| [docs/architecture.md](architecture.md) | System architecture reference | When structural changes are made |
| [docs/setup.md](setup.md) | Environment setup guide | When dependencies or build process change |
| [docs/user-guide.md](user-guide.md) | End-user instructions | When UI features change |
| [docs/progress-log.md](progress-log.md) | Supervisor progress tracker | After each work session (append only) |
| [docs/CHANGELOG.md](CHANGELOG.md) | Developer change log | Before each commit/release |
| [docs/darkmode_design.md](darkmode_design.md) | Dark mode design spec | When dark mode palette changes |
| [docs/unit_based_access.md](unit_based_access.md) | Access control implementation spec | When access rules change |
| This file | Handover checklist | Before project transfer |
