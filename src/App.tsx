import LoginPage from "./pages/LoginPage";
import Dashboard from "./pages/Dashboard";
import ProjectRecords from "./pages/ProjectRecords";
import FileRepository from "./pages/FileRepository";
import SystemInfo from "./pages/SystemInfo";
import UserProfile from "./pages/UserProfile";
import UserManagement from "./pages/UserManagement";
import ActivityLogs from "./pages/ActivityLogs";
import { useContext, useState } from "react";
import { AuthContext } from "./context/AuthContext";

export default function App() {
  // 1. Unified Auth State
  const { user } = useContext(AuthContext)!; // Access user from context
  const [currentView, setCurrentView] = useState("dashboard");
  const [shouldOpenModal, setShouldOpenModal] = useState(false);

  // 2. Navigation Handler
  const handleNavigate = (view: string, openModal: boolean = false) => {
    setCurrentView(view);
    setShouldOpenModal(openModal);
    if (openModal) {
      setTimeout(() => setShouldOpenModal(false), 500);
    }
  };

  // 3. View Logic
  if (!user) return <LoginPage />; 

  return (
    <>
      {currentView === "dashboard" && (
        <Dashboard
          onViewChange={handleNavigate}
          currentView={currentView}
        />
      )}
      {currentView === "records" && (
        <ProjectRecords
          onViewChange={handleNavigate} // Use handleNavigate here
          currentView={currentView}
          openModalOnLoad={shouldOpenModal}
        />
      )}
      {currentView === "repository" && (
        <FileRepository
          onViewChange={handleNavigate}
          currentView={currentView}
          openModalOnLoad={shouldOpenModal}
        />
      )}
      {currentView === "profile" && (
        <UserProfile onViewChange={handleNavigate} currentView={currentView} />
      )}
      {currentView === "users" && (
        <UserManagement onViewChange={handleNavigate} currentView={currentView} />
      )}
      {currentView === "logs" && (
        <ActivityLogs onViewChange={handleNavigate} currentView={currentView} />
      )}
      {currentView === "info" && user?.role === "admin" && (
        <SystemInfo onViewChange={handleNavigate} currentView={currentView} />
      )}
    </>
  );
}
