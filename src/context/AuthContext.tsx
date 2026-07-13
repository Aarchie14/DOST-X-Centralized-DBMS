import { createContext, useState, useEffect, ReactNode } from "react";

// 1. Define a complete User type
export type User = { 
  email: string; 
  role: "admin" | "user"; 
  name: string;
  department: string;
  systemAccess: string;
};

// Define activity log interface
export interface ActivityLog {
  id: string;
  userName: string;
  userEmail: string;
  action: string;
  details: string;
  timestamp: string; // ISO string
}

const INITIAL_USERS: User[] = [
  {
    email: "admin@dost.gov.ph",
    role: "admin",
    name: "Administrator",
    department: "MIS",
    systemAccess: "Full Access (Read, Write, Delete, User Management)",
  },
  {
    email: "user@dost.gov.ph",
    role: "user",
    name: "Staff Member",
    department: "SCC",
    systemAccess: "Standard Access (Read, Write, Edit Records)",
  },
  {
    email: "planning_officer@dost.gov.ph",
    role: "user",
    name: "Planning Specialist",
    department: "Planning",
    systemAccess: "Standard Access (Read, Write, Edit Records)",
  },
  {
    email: "gad_officer@dost.gov.ph",
    role: "user",
    name: "Gender Analyst",
    department: "GAD",
    systemAccess: "Standard Access (Read, Write, Edit Records)",
  },
];

const INITIAL_LOGS: ActivityLog[] = [
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
  {
    id: "log-3",
    userName: "Administrator",
    userEmail: "admin@dost.gov.ph",
    action: "User Registered",
    details: "Registered new system user: Planning Specialist (planning_officer@dost.gov.ph)",
    timestamp: "2026-07-13T01:05:00Z",
  },
];

/**
 * AuthContext Interface
 * Exposes user state, login/logout handlers, and application loading status.
 */
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

/**
 * AuthProvider Component
 * Manages global authentication state, session persistence, 
 * and provides mock credential validation.
 */
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Stateful list of users initialized from storage or defaults
  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem("users_list");
    return saved ? JSON.parse(saved) : INITIAL_USERS;
  });

  // Stateful list of activity logs
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>(() => {
    const saved = localStorage.getItem("activity_logs");
    return saved ? JSON.parse(saved) : INITIAL_LOGS;
  });

  // Keep localStorage synced with the users state
  useEffect(() => {
    localStorage.setItem("users_list", JSON.stringify(users));
  }, [users]);

  // Keep localStorage synced with activity logs state
  useEffect(() => {
    localStorage.setItem("activity_logs", JSON.stringify(activityLogs));
  }, [activityLogs]);

  // Utility helper to append to activity logs list
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

  // Mock Logic with credentials resolved from the users list
  const login = (email: string, password: string) => {
    const foundUser = users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase()
    );

    if (foundUser) {
      // Allow role-based default passwords or 'password123'
      const expectedPassword = foundUser.role === "admin" ? "admin123" : "user123";
      if (password === expectedPassword || password === "password123") {
        setUser(foundUser);
        localStorage.setItem("user", JSON.stringify(foundUser));

        // Create log event
        const newLog: ActivityLog = {
          id: `log-${Date.now()}`,
          userName: foundUser.name,
          userEmail: foundUser.email,
          action: "User Login",
          details: `User logged in to the system.`,
          timestamp: new Date().toISOString(),
        };
        setActivityLogs((prev) => [newLog, ...prev]);

        return true;
      }
    }
    return false;
  };

  /**
   * Clears user state and removes authentication data from storage.
   */
  const logout = () => {
    if (user) {
      const newLog: ActivityLog = {
        id: `log-${Date.now()}`,
        userName: user.name,
        userEmail: user.email,
        action: "User Logout",
        details: `User logged out of the system.`,
        timestamp: new Date().toISOString(),
      };
      setActivityLogs((prev) => [newLog, ...prev]);
    }
    setUser(null);
    localStorage.removeItem("user");
  };

  const addUser = (newUser: User) => {
    setUsers((prev) => [...prev, newUser]);
  };

  const updateUser = (email: string, updatedFields: Partial<User>) => {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.email.toLowerCase() === email.toLowerCase()) {
          const updatedU = { ...u, ...updatedFields };
          // If the edited user is the current active session, sync it
          if (user && user.email.toLowerCase() === email.toLowerCase()) {
            setUser(updatedU);
            localStorage.setItem("user", JSON.stringify(updatedU));
          }
          return updatedU;
        }
        return u;
      })
    );
  };

  const deleteUser = (email: string) => {
    setUsers((prev) => prev.filter((u) => u.email.toLowerCase() !== email.toLowerCase()));
    // If the active user got deleted, log them out immediately
    if (user && user.email.toLowerCase() === email.toLowerCase()) {
      logout();
    }
  };

  /**
   * Side-effect to rehydrate the user session from localStorage 
   * on initial application mount.
   */
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) setUser(JSON.parse(savedUser));
    setLoading(false);
  }, []);

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