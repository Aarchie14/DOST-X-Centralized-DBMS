import { createContext, useState, useEffect, type ReactNode } from "react";
import {
  type User,
  type ActivityLog,
  STORAGE_KEYS,
  EMAIL_PATTERN,
  MIN_PASSWORD_LENGTH,
  FAILURE_LIMIT,
  LOCKOUT_MS,
  INITIAL_USERS,
  INITIAL_LOGS,
} from "../types/auth";
import { readStorageJson, writeStorageJson } from "../utils/storage";
import { sanitizeUserRecord } from "../utils/userSanitizer";

export const AuthContext = createContext<{
  user: User | null;
  login: (email: string, password: string) => boolean;
  logout: () => void;
  loading: boolean;
  users: User[];
  addUser: (newUser: User) => void;
  updateUser: (email: string, updatedFields: Partial<User>) => void;
  deleteUser: (email: string) => void;
  activityLogs: ActivityLog[];
  addLog: (action: string, details: string) => void;
} | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(() =>
    readStorageJson(sessionStorage, STORAGE_KEYS.sessionUser, null),
  );
  const [loading, setLoading] = useState(true);

  const [users, setUsers] = useState<User[]>(() =>
    readStorageJson(localStorage, STORAGE_KEYS.usersList, INITIAL_USERS).map(
      sanitizeUserRecord,
    ),
  );

  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>(() =>
    readStorageJson(localStorage, STORAGE_KEYS.activityLogs, INITIAL_LOGS),
  );

  // --- PERSISTENCE SYNCS ---
  useEffect(() => {
    writeStorageJson(localStorage, STORAGE_KEYS.usersList, users);
  }, [users]);

  useEffect(() => {
    writeStorageJson(localStorage, STORAGE_KEYS.activityLogs, activityLogs);
  }, [activityLogs]);

  useEffect(() => {
    if (user) {
      writeStorageJson(sessionStorage, STORAGE_KEYS.sessionUser, user);
    } else {
      sessionStorage.removeItem(STORAGE_KEYS.sessionUser);
    }
  }, [user]);

  useEffect(() => {
    const savedUser = readStorageJson<User | null>(
      sessionStorage,
      STORAGE_KEYS.sessionUser,
      null,
    );
    if (savedUser) {
      setUser(sanitizeUserRecord(savedUser));
    }
    setLoading(false);
  }, []);

  // --- ACTIONS ---
  const addLog = (action: string, details: string) => {
    const newLog: ActivityLog = {
      id: `log-${Date.now()}`,
      userName: user ? user.name : "System",
      userEmail: user ? user.email : "system@dost.gov.ph",
      action,
      details,
      timestamp: new Date().toISOString(),
    };
    setActivityLogs((prev) => [newLog, ...prev]);
  };

  const login = (email: string, password: string) => {
    const normalizedEmail = email.trim().toLowerCase();
    const trimmedPassword = password.trim();

    if (
      !EMAIL_PATTERN.test(normalizedEmail) ||
      trimmedPassword.length < MIN_PASSWORD_LENGTH
    ) {
      return false;
    }

    const lockoutUntil = Number(
      sessionStorage.getItem(STORAGE_KEYS.loginLockoutUntil) || "0",
    );
    if (Date.now() < lockoutUntil) return false;

    const foundUser = users.find(
      (u) => u.email.toLowerCase() === normalizedEmail,
    );

    if (!foundUser) {
      handleFailure();
      return false;
    }

    const expectedPassword =
      foundUser.password ||
      (foundUser.role === "admin" ? "admin123" : "user123");
    if (trimmedPassword !== expectedPassword) {
      handleFailure();
      return false;
    }

    sessionStorage.removeItem(STORAGE_KEYS.loginAttempts);
    sessionStorage.removeItem(STORAGE_KEYS.loginLockoutUntil);

    const { password: _, ...sessionUser } = foundUser;
    setUser(sessionUser);
    addLog("User Login", "User logged in to the system.");
    return true;
  };

  const handleFailure = () => {
    const attempts =
      Number(sessionStorage.getItem(STORAGE_KEYS.loginAttempts) || "0") + 1;
    sessionStorage.setItem(STORAGE_KEYS.loginAttempts, String(attempts));
    if (attempts >= FAILURE_LIMIT) {
      sessionStorage.setItem(
        STORAGE_KEYS.loginLockoutUntil,
        String(Date.now() + LOCKOUT_MS),
      );
    }
  };

  const logout = () => {
    if (user) addLog("User Logout", "User logged out of the system.");
    setUser(null);
    sessionStorage.removeItem(STORAGE_KEYS.sessionUser);
  };

  const addUser = (newUser: User) => {
    const normalizedUser = sanitizeUserRecord(newUser);

    setUsers((prev) => {
      const alreadyExists = prev.some(
        (u) => u.email.toLowerCase() === normalizedUser.email.toLowerCase(),
      );
      return alreadyExists ? prev : [...prev, normalizedUser];
    });
  };

  const updateUser = (email: string, updatedFields: Partial<User>) => {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.email.toLowerCase() === email.toLowerCase()) {
          const updatedU = sanitizeUserRecord({ ...u, ...updatedFields });
          if (user && user.email.toLowerCase() === email.toLowerCase()) {
            const { password: _, ...sessionUser } = updatedU;
            setUser(sessionUser);
          }
          return updatedU;
        }
        return u;
      }),
    );
  };

  const deleteUser = (email: string) => {
    setUsers((prev) =>
      prev.filter((u) => u.email.toLowerCase() !== email.toLowerCase()),
    );
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
