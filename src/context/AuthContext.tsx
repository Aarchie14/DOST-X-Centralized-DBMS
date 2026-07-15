/**
 * AuthContext.tsx
 *
 * Provides application-wide authentication state and user management.
 *
 * v2 – Backend Integration
 * ────────────────────────
 * - Login now calls POST /auth/login with an "identifier" field that accepts
 *   EITHER a username OR an email address.
 * - A JWT token is persisted in localStorage under "api_token" and is
 *   automatically attached to every subsequent API request by src/utils/api.ts.
 * - User CRUD (addUser / updateUser / deleteUser) calls the /users endpoints.
 * - Activity logs are appended to a local state list (frontend-only for now);
 *   the backend's audit_log table is written to directly from each controller.
 *   A future iteration can read logs from GET /audit-logs instead.
 *
 * Theme reset on logout:
 *   On logout, the theme in localStorage is reset to "light" and the "dark"
 *   class is removed from <html> so the next session always starts in light mode.
 */

import { createContext, useState, useEffect, useCallback, type ReactNode } from "react";
import { type User, type ActivityLog, STORAGE_KEYS, INITIAL_LOGS } from "../types/auth";
import { readStorageJson, writeStorageJson } from "../utils/storage";
import { sanitizeUserRecord } from "../utils/userSanitizer";
import {
  api,
  saveToken,
  clearToken,
  type ApiUser,
  type ApiUserRecord,
} from "../utils/api";

// ---------------------------------------------------------------------------
// Helper: map a backend ApiUser / ApiUserRecord to the frontend User shape
// ---------------------------------------------------------------------------
function mapApiUserToFrontend(u: ApiUser | ApiUserRecord): User {
  return sanitizeUserRecord({
    id:           u.id,
    // Prefer email as the stable identifier; fall back to username
    email:        u.email ?? `${u.username}@dost.local`,
    name:         u.full_name || u.username,
    role:         api.mapRole(u.role_name),
    department:   u.department ?? "",
    systemAccess: (u.system_access ?? []) as User["systemAccess"],
  });
}

// ---------------------------------------------------------------------------
// Context shape
// ---------------------------------------------------------------------------
export const AuthContext = createContext<{
  user: User | null;
  /** Accepts username OR email as the first argument */
  login: (identifier: string, password: string) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
  users: User[];
  addUser: (newUser: User & { password?: string }) => Promise<void>;
  updateUser: (email: string, updatedFields: Partial<User> & { password?: string }) => Promise<void>;
  deleteUser: (email: string) => void;
  activityLogs: ActivityLog[];
  addLog: (action: string, details: string) => void;
} | null>(null);

// ---------------------------------------------------------------------------
// Provider
// ---------------------------------------------------------------------------
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  // --- SESSION STATE ---
  const [user, setUser] = useState<User | null>(() => {
    const saved = readStorageJson<User | null>(sessionStorage, STORAGE_KEYS.sessionUser, null);
    return saved ? sanitizeUserRecord(saved) : null;
  });
  const [loading, setLoading] = useState(true);

  // --- USERS STATE (populated from backend on mount if logged-in) ---
  const [users, setUsers] = useState<User[]>([]);

  // --- ACTIVITY LOGS (local; bootstrapped from localStorage) ---
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>(() =>
    readStorageJson(localStorage, STORAGE_KEYS.activityLogs, INITIAL_LOGS),
  );

  // Persist activity logs locally
  useEffect(() => {
    writeStorageJson(localStorage, STORAGE_KEYS.activityLogs, activityLogs);
  }, [activityLogs]);

  // Persist session user
  useEffect(() => {
    if (user) {
      writeStorageJson(sessionStorage, STORAGE_KEYS.sessionUser, user);
    } else {
      sessionStorage.removeItem(STORAGE_KEYS.sessionUser);
    }
  }, [user]);

  // ---------------------------------------------------------------------------
  // Fetch user list from backend (called after login or on mount when logged-in)
  // ---------------------------------------------------------------------------
  const fetchUsers = useCallback(async () => {
    try {
      const { users: apiUsers } = await api.getUsers();
      setUsers(apiUsers.map(mapApiUserToFrontend));
    } catch {
      // Not admin or network error — keep empty; non-admins don't need the list
    }
  }, []);

  // On mount: restore session and sync with backend database
  useEffect(() => {
    const syncSession = async () => {
      const saved = readStorageJson<User | null>(sessionStorage, STORAGE_KEYS.sessionUser, null);
      if (saved) {
        setUser(sanitizeUserRecord(saved));
        try {
          const { user: apiUser } = await api.me();
          const freshUser = mapApiUserToFrontend(apiUser);
          setUser(freshUser);
          if (freshUser.role === "admin") {
            try {
              const { users: apiUsers } = await api.getUsers();
              setUsers(apiUsers.map(mapApiUserToFrontend));
            } catch (err) {
              console.error("fetchUsers failed on mount:", err);
            }
          }
        } catch (err) {
          console.error("Token invalid or expired. Logging out.", err);
          logout();
        }
      }
      setLoading(false);
    };
    syncSession();
  }, [fetchUsers]);

  // ---------------------------------------------------------------------------
  // ACTIONS
  // ---------------------------------------------------------------------------

  /** Appends a timestamped log entry to the local activity log list. */
  const addLog = (action: string, details: string) => {
    const newLog: ActivityLog = {
      id:        `log-${Date.now()}`,
      userName:  user ? user.name  : "System",
      userEmail: user ? user.email : "system@dost.gov.ph",
      action,
      details,
      timestamp: new Date().toISOString(),
    };
    setActivityLogs((prev) => [newLog, ...prev]);
  };

  /**
   * Authenticates against the backend.
   * @param identifier - username OR email address
   * @param password   - plain-text password
   * @returns true on success, false on failure
   */
  const login = async (identifier: string, password: string): Promise<boolean> => {
    try {
      const { token, user: apiUser } = await api.login(identifier.trim(), password.trim());
      saveToken(token);

      const frontendUser = mapApiUserToFrontend(apiUser);
      setUser(frontendUser);

      // Load full user list in the background (admins need it for User Management)
      fetchUsers();

      addLog("User Login", "User logged in to the system.");
      return true;
    } catch {
      return false;
    }
  };

  /** Clears session state, JWT token, and resets the theme to light mode. */
  const logout = () => {
    if (user) addLog("User Logout", "User logged out of the system.");
    setUser(null);
    setUsers([]);
    clearToken();
    sessionStorage.removeItem(STORAGE_KEYS.sessionUser);
    localStorage.setItem("theme", "light");
    document.documentElement.classList.remove("dark");
  };

  /**
   * Creates a new user via the backend API.
   * Expects a User object plus an optional `password` property.
   */
  const addUser = async (newUser: User & { password?: string }): Promise<void> => {
    try {
      const { roles } = await api.getRoles();
      const role = roles.find((r) => r.name === (newUser.role === "admin" ? "admin" : "viewer"));
      if (!role) throw new Error("Role not found");

      await api.createUser({
        username:      newUser.email.split("@")[0], // derive username from email prefix
        email:         newUser.email,
        password:      newUser.password ?? "changeme",
        full_name:     newUser.name,
        role_id:       role.id,
        department:    newUser.department,
        system_access: newUser.systemAccess as string[],
      });

      await fetchUsers();
    } catch (err) {
      console.error("addUser failed:", err);
      throw err;
    }
  };

  /**
   * Updates an existing user by their email address.
   * Uses targetId directly if the target user is the logged-in user themselves,
   * avoiding administrative lists and permission blocks.
   */
  const updateUser = async (
    email: string,
    updatedFields: Partial<User> & { password?: string },
  ): Promise<void> => {
    try {
      let targetId: number | undefined;

      // If updating the logged-in user themselves, use their session id directly
      if (user && user.email.toLowerCase() === email.toLowerCase()) {
        targetId = user.id;
      } else {
        // Otherwise (admin flow), query the users list to find the ID
        const { users: apiUsers } = await api.getUsers();
        const target = apiUsers.find(
          (u) => (u.email ?? "").toLowerCase() === email.toLowerCase(),
        );
        if (target) targetId = target.id;
      }

      if (!targetId) throw new Error("User not found");

      const patch: Parameters<typeof api.updateUserApi>[1] = {};
      if (updatedFields.name)         patch.full_name     = updatedFields.name;
      if (updatedFields.email)        patch.email         = updatedFields.email;
      if (updatedFields.department)   patch.department    = updatedFields.department;
      if (updatedFields.systemAccess) patch.system_access = updatedFields.systemAccess as string[];
      if (updatedFields.password)     patch.password      = updatedFields.password;

      if (updatedFields.role) {
        const { roles } = await api.getRoles();
        const role = roles.find((r) => r.name === (updatedFields.role === "admin" ? "admin" : "viewer"));
        if (role) patch.role_id = role.id;
      }

      await api.updateUserApi(targetId, patch);

      // Only refresh the user list if the current user is an admin
      if (user && user.role === "admin") {
        await fetchUsers();
      }

      // Update the active session user state immediately so the change reflects in the UI
      if (user && user.email.toLowerCase() === email.toLowerCase()) {
        setUser((prev) => prev ? sanitizeUserRecord({ ...prev, ...updatedFields }) : prev);
      }
    } catch (err) {
      console.error("updateUser failed:", err);
      throw err;
    }
  };

  /**
   * Removes a user from local state.
   * Note: The backend has no DELETE /users endpoint; status can be set to
   * "inactive" via updateUser instead. This removes the user from local view.
   */
  const deleteUser = (email: string) => {
    setUsers((prev) => prev.filter((u) => u.email.toLowerCase() !== email.toLowerCase()));
    if (user && user.email.toLowerCase() === email.toLowerCase()) logout();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        loading,
        users,
        addUser,
        updateUser,
        deleteUser,
        activityLogs,
        addLog,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
