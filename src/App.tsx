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
    setCurrentView(view);
    setShouldOpenModal(openModal);

    // If we just navigated and opened the modal,
    // set the flag back to false after a tiny delay so it doesn't loop
    if (openModal) {
      setTimeout(() => setShouldOpenModal(false), 100);
    }
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
