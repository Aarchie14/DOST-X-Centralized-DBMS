# Environment Setup & Development Guide

> **Last updated:** 2026-07-14

Step-by-step instructions to clone, install, run, build, and deploy the DOST-X Centralized DBMS.

---

## Prerequisites

| Tool | Minimum Version | Check |
|------|----------------|-------|
| Node.js | 18.x or later | `node -v` |
| npm | 9.x or later | `npm -v` |
| Git | 2.x | `git --version` |

> **Recommended:** Use the LTS version of Node.js from [nodejs.org](https://nodejs.org/).

---

## 1. Clone the Repository

```bash
git clone https://github.com/punyeeta/DOST-X-Centralized-DBMS.git
cd DOST-X-Centralized-DBMS
```

---

## 2. Install Dependencies

```bash
npm install
```

This installs all packages listed in `package.json`, including React 19, Vite 8, Tailwind CSS v4, and React Router v7.

> **If you encounter errors after a `git pull`:** Run `npm install` again to sync any new or changed dependencies from `package-lock.json`.

---

## 3. Run the Development Server

```bash
npm run dev
```

The app will be available at: **http://localhost:5173**

Vite provides:
- ⚡ Instant hot module replacement (HMR)
- 🔄 Auto-reloading on file changes
- 📝 TypeScript type checking during build (not during dev — use your IDE for real-time feedback)

---

## 4. Available Scripts

| Script | Command | Description |
|--------|---------|-------------|
| Dev server | `npm run dev` | Start Vite dev server with HMR |
| Build | `npm run build` | Type-check with `tsc -b`, then produce a production bundle in `dist/` |
| Preview | `npm run preview` | Serve the built `dist/` folder locally (post-build verification) |
| Lint | `npm run lint` | Run ESLint across the codebase |

---

## 5. Build for Production

```bash
npm run build
```

This performs two steps:
1. **Type-checking** via `tsc -b` — fails the build if there are TypeScript errors.
2. **Bundling** via Vite — outputs optimized static files to the `dist/` directory.

To preview the production build locally:

```bash
npm run preview
```

---

## 6. Project Structure Summary

```
DOST-X-Centralized-DBMS/
├── src/              # Application source code
│   ├── components/   # UI components (common/ and layout/)
│   ├── pages/        # Route-level page components
│   ├── hooks/        # Custom React hooks (business logic)
│   ├── context/      # React Context providers (Auth, Sidebar)
│   ├── config/       # Constants, enums, mock data
│   ├── types/        # TypeScript type definitions
│   ├── utils/        # Utility functions
│   ├── assets/       # Images and static assets
│   └── index.css     # Global styles + Tailwind theme + dark mode
├── docs/             # Project documentation
├── public/           # Static files served as-is
└── index.html        # HTML entry point
```

> See [docs/architecture.md](architecture.md) for detailed file-by-file descriptions.

---

## 7. Environment Variables

The project currently does **not** use any `.env` files or environment variables. All configuration is hardcoded in source files:

- **API endpoints:** None (no backend — all data is in `localStorage`)
- **Seed data:** `src/types/auth.ts` (users), `src/config/mockData.ts` (projects)
- **Theme persistence:** `localStorage` key `"theme"`
- **Auth persistence:** `sessionStorage` key `"session_user"`

When a backend is introduced, create a `.env` file at the project root:

```env
VITE_API_BASE_URL=https://api.example.dost.gov.ph
```

Access in code via `import.meta.env.VITE_API_BASE_URL`.

---

## 8. Deployment

### Static Hosting (Current Approach)

Since the app is a pure SPA with no backend, it can be deployed to any static hosting service:

1. **Build:** `npm run build`
2. **Upload** the contents of the `dist/` folder to your hosting provider.

**Important:** Configure your hosting to serve `index.html` for all routes (SPA fallback), since React Router uses client-side routing.

### Common Hosting Options

| Platform | SPA Config |
|----------|-----------|
| Vercel | Automatic (detects Vite) |
| Netlify | Add `_redirects` file: `/* /index.html 200` |
| Apache | Add `.htaccess` with `FallbackResource /index.html` |
| Nginx | Add `try_files $uri $uri/ /index.html;` to location block |

---

## 9. Troubleshooting

| Problem | Solution |
|---------|----------|
| `Module not found` after `git pull` | Run `npm install` to sync dependencies |
| Port 5173 already in use | Kill the process on that port, or run `npx vite --port 3000` |
| Blank page after build | Ensure your hosting serves `index.html` for all routes (SPA fallback) |
| Dark mode flash on load | The inline `<script>` in `index.html` should handle this — check it hasn't been removed |
| TypeScript errors on build | Run `npx tsc --noEmit` to see all errors, then fix them before building |
