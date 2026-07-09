// src/App.tsx
import { useState } from "react";
import LoginPage from "./pages/LoginPage";
import Dashboard from "./pages/Dashboard";
import ProjectRecords from "./pages/ProjectRecords";
import FileRepository from "./pages/FileRepository";
import SystemInfo from "./pages/SystemInfo";

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentView, setCurrentView] = useState("dashboard");
  const [shouldOpenModal, setShouldOpenModal] = useState(false);

  if (!isLoggedIn) return <LoginPage onLogin={() => setIsLoggedIn(true)} />;

  // Centralized navigation logic
  const handleNavigate = (view: string, openModal: boolean = false) => {
    console.log("Navigating to:", view, "with modal:", openModal); // <--- DEBUGGER
    setCurrentView(view);
    setShouldOpenModal(openModal);
  };

  return (
    <>
      {currentView === "dashboard" && (
        <Dashboard onViewChange={handleNavigate} currentView={currentView} />
      )}
      {currentView === "records" && (
        <ProjectRecords
          onViewChange={setCurrentView}
          currentView={currentView}
          openModalOnLoad={shouldOpenModal}
        />
      )}
      {currentView === "repository" && (
        <FileRepository
          onViewChange={setCurrentView}
          currentView={currentView}
          openModalOnLoad={shouldOpenModal}
        />
      )}
      {currentView === "info" && (
        <SystemInfo onViewChange={setCurrentView} currentView={currentView} />
      )}
    </>
  );
}
