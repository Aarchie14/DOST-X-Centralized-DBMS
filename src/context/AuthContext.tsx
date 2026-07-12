import { createContext, useState, useEffect, ReactNode } from "react";

// 1. Define a more complete User type
type User = { 
  email: string; 
  role: "admin" | "user"; 
  name: string 
};

export const AuthContext = createContext<{
  user: User | null;
  login: (email: string, password: string) => boolean;
  logout: () => void;
  loading: boolean;
} | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // 2. Mock Logic with credentials
  const login = (email: string, password: string) => {
    if (email === "admin@dost.gov.ph" && password === "admin123") {
      const adminUser = { email, role: "admin" as const, name: "Administrator" };
      setUser(adminUser);
      localStorage.setItem("user", JSON.stringify(adminUser));
      return true;
    } else if (email === "user@dost.gov.ph" && password === "user123") {
      const regularUser = { email, role: "user" as const, name: "Staff Member" };
      setUser(regularUser);
      localStorage.setItem("user", JSON.stringify(regularUser));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) setUser(JSON.parse(savedUser));
    setLoading(false);
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};