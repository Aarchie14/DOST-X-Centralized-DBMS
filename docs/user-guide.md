# User Guide — DOST-X Centralized DBMS

> **Last updated:** 2026-07-14

This guide explains how to use the DOST-X Centralized Database Management System from both a **staff member** (standard user) and an **administrator** perspective.

---

## 1. Logging In

1. Navigate to the application URL (e.g., `http://localhost:5173`).
2. Enter your email address and password.
3. Click **Login**.

**Security features:**
- After **5 failed login attempts**, your account is temporarily locked for 30 seconds.
- The system automatically logs you out after **15 minutes of inactivity** (no mouse or keyboard input).

### Demo Accounts

| Role | Email | Password |
|------|-------|----------|
| Administrator | `admin@dost.gov.ph` | `admin123` |
| Staff Member | `user@dost.gov.ph` | `user123` |

---

## 2. Dashboard

The Dashboard is the landing page after login. It displays:

- **Hero banner** with the DOST-X branding
- **Statistics cards** showing total projects, total budget, active projects, and completion rate
- **Project distribution chart** broken down by sector/category
- **Quick-access buttons** to navigate to the Project Database and File Repository

### Department Filter

- **Admin users** see an interactive dropdown to switch between "All department", "GAD", "SCC", "MIS", and "Planning".
- **Staff users** see a locked badge showing their assigned department (e.g., "SCC"). They cannot switch departments — the dashboard automatically shows only their unit's stats.

---

## 3. Project Database

The Project Database page is where project records are managed.

### Viewing Records

- Records are displayed in a paginated table (10 records per page).
- Use the **search bar** to filter by project name or sector category.
- Use the **department dropdown** to filter by department (admin only — staff users are automatically filtered to their own department).

### Creating a Record (Admin Only)

1. Click the **New Record Entry** button.
2. Fill in the required fields: Project Name, Department, Sector/Category, Budget, and Status.
3. Click **Save** to create the record.

### Editing a Record (Admin Only)

1. Click the **pencil icon** in the Actions column of any row.
2. The form modal opens pre-filled with the record's current data.
3. Make your changes and click **Save**.

### Deleting a Record (Admin Only)

1. Click the **trash icon** in the Actions column.
2. A confirmation modal appears — click **Confirm** to delete.

### Exporting Data

1. Click the **Export As** button.
2. Choose **CSV** or **Excel** format.
3. If you have selected specific rows using the checkboxes, only those rows will be exported. Otherwise, all visible records are exported.

> **Note for staff users:** Exports only ever contain records from your own department, regardless of how the export is triggered.

### Viewing Record Details

- Click on any **project name** link (blue text) to open a detailed view of that project, including all metadata fields.

---

## 4. File Repository

The File Repository page allows managing uploaded data files.

### Uploading Files (Admin Only)

1. In the upload zone at the top of the page, select a department from the dropdown.
2. Drag and drop a file into the upload area, or click to browse.
3. The file appears in the table below.

### Viewing Files

- Files are displayed in a table with columns for file name, size, department, sector, and last accessed date.
- Use the search bar and department filter to find specific files.

### Downloading Files

- Click the **download icon** in the Actions column to download a file.

### Deleting Files (Admin Only)

- Click the **trash icon**, then confirm in the modal that appears.

---

## 5. User Profile

Accessible from the sidebar under your account name, the User Profile page shows:

- Your name, email, role, and department
- Your system access permissions
- Option to update your profile information

---

## 6. Admin-Only Pages

The following pages are only accessible to users with the `admin` role. Staff members will be automatically redirected to the Dashboard if they attempt to access these routes.

### User Management

- View all registered users in a table.
- **Create** new user accounts with email, name, role, department, and permissions.
- **Edit** existing user details.
- **Delete** user accounts (with confirmation).

### Activity Logs

- View a chronological audit trail of all system actions (logins, logouts, record CRUD, file operations).
- Each log entry shows: user name, email, action type, details, and timestamp.

### System Information

- Displays technical system metadata and configuration details.

---

## 7. Navigation

### Sidebar

- The sidebar is **minimized by default** (shows only icons).
- **Hover** over the sidebar to temporarily expand it and see labels.
- Click the **arrow toggle button** (at the top-right edge of the sidebar) to pin it in the expanded state.
- Sidebar items include: Dashboard, Project Database, File Repository, User Profile, and admin-only links (User Management, Activity Logs, System Info).

### Top Navigation Bar

- Shows the current page title and breadcrumb.
- Displays the **current date and time** (auto-updating).
- Includes a **dark mode toggle** button (sun/moon icon).
- On mobile, includes a hamburger menu for sidebar access.

---

## 8. Dark Mode

- Click the **moon icon** (☽) in the top navigation bar to switch to dark mode.
- Click the **sun icon** (☀) to switch back to light mode.
- By default, the application opens in **light mode** on the first visit. Your preference is saved automatically to `localStorage` and persists across sessions.
- Dark mode uses a deep dark blue palette designed for reduced eye strain while maintaining visual hierarchy and brand identity.

---

## 9. Tips

- **Keyboard shortcut:** There is no global keyboard shortcut for dark mode — use the toggle button.
- **Data persistence:** All data is stored in your browser's local storage. Clearing browser data will reset all records, users, and logs to their defaults.
- **Session:** Closing the browser tab ends your session. You will need to log in again.
- **Multiple tabs:** The app is designed for single-tab use. Opening multiple tabs may cause data synchronization issues.
