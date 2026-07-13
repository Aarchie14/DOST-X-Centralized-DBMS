export type Permission = "read" | "write" | "delete" | "manage_users" | "edit_records";

export type User = {
  email: string;
  role: "admin" | "user";
  name: string;
  department: string;
  systemAccess: Permission[];
  password?: string;
};

export interface ActivityLog {
  id: string;
  userName: string;
  userEmail: string;
  action: string;
  details: string;
  timestamp: string; // ISO string
}

export const STORAGE_KEYS = {
  sessionUser: "session_user",
  usersList: "users_list",
  activityLogs: "activity_logs",
  loginAttempts: "login_attempts",
  loginLockoutUntil: "login_lockout_until",
} as const;

export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const MIN_PASSWORD_LENGTH = 6;
export const FAILURE_LIMIT = 5;
export const LOCKOUT_MS = 30_000;

export const INITIAL_USERS: User[] = [
  {
    email: "admin@dost.gov.ph",
    role: "admin",
    name: "Administrator",
    department: "MIS",
    systemAccess: ["read", "write", "delete", "manage_users", "edit_records"],
    password: "admin123",
  },
  {
    email: "user@dost.gov.ph",
    role: "user",
    name: "Staff Member",
    department: "SCC",
    systemAccess: ["read", "write"],
    password: "user123",
  },
];

export const INITIAL_LOGS: ActivityLog[] = [
  {
    id: "log-1",
    userName: "Administrator",
    userEmail: "admin@dost.gov.ph",
    action: "System Initialization",
    details: "System successfully initialized with 5 core projects.",
    timestamp: "2026-07-13T00:30:00Z",
  },
  {
    id: "log-2",
    userName: "Staff Member",
    userEmail: "user@dost.gov.ph",
    action: "File Uploaded",
    details: "Uploaded 'SETUP Food Processing Facility Upgrade.csv' to MIS department",
    timestamp: "2026-07-13T00:45:24Z",
  },
];