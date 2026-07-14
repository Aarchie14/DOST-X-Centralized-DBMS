import { useContext } from "react";
import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "./context/AuthContext";
import { SidebarProvider } from "./context/SidebarContext";
import { useInactivityLogout } from "./hooks/useInactivityLogout";

// Pages
import LoginPage from "./pages/LoginPage";
import Dashboard from "./pages/Dashboard";
import ProjectDatabase from "./pages/ProjectDatabase";
import FileRepository from "./pages/FileRepository";
import SystemInfo from "./pages/SystemInfo";
import UserProfile from "./pages/UserProfile";
import UserManagement from "./pages/UserManagement";
import ActivityLogs from "./pages/ActivityLogs";

// 1. Create a Protected Layout wrapper to guard routes and host shared components
function ProtectedLayout() {
  const { user } = useContext(AuthContext)!;

  // If not logged in, boot back to login screen
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Outlet acts as a placeholder where child components render dynamically
  return <Outlet />;
}

// 2. Admin Guard component to lock down specific paths
function AdminRoute() {
  const { user } = useContext(AuthContext)!;
  return user?.role === "admin" ? <Outlet /> : <Navigate to="/dashboard" replace />;
}

export default function App() {
  const { user, logout } = useContext(AuthContext)!;

  const handleLogout = () => {
    logout();
    // Router takes care of redirects now, window.location.replace is no longer needed
  };

  useInactivityLogout(handleLogout, 900000);

  return (
    <SidebarProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={!user ? <LoginPage /> : <Navigate to="/dashboard" replace />} />

          {/* Protected Dashboard Shell */}
          <Route element={<ProtectedLayout />}>
            <Route path="/dashboard" element={<Dashboard/>} />
            <Route path="/dashboard/database" element={<ProjectDatabase />} />
            <Route path="/dashboard/repository" element={<FileRepository />} />
            <Route path="/dashboard/profile" element={<UserProfile />} />

            {/* Admin Specific Sub-Routes */}
            <Route element={<AdminRoute />}>
              <Route path="/dashboard/management" element={<UserManagement />} />
              <Route path="/dashboard/logs" element={<ActivityLogs />} />
              <Route path="/dashboard/info" element={<SystemInfo />} />
            </Route>
          </Route>

          {/* Fallback redirect */}
          <Route path="*" element={<Navigate to={user ? "/dashboard" : "/login"} replace />} />
        </Routes>
      </BrowserRouter>
    </SidebarProvider>
  );
}