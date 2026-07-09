import { Navbar } from "../components/layout/Navbar";
import { Sidebar } from "../components/layout/Sidebar";

export default function App() {
  const handleViewChange = (_view: string) => {};

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 select-none antialiased">
      {/* Global Navigation Interfaces with custom metadata attributes mapped contextually */}
      <Navbar
        pageTitle="Data Records"
        subTitle="Records"
        onViewChange={handleViewChange}
      />
      <Sidebar activeView="dashboard" onViewChange={handleViewChange} />

      {/* Main Container Wrapper - Shifted over safely to account for Sidebar frame width */}
      <div className="sm:pl-64 transition-all duration-200">
        {/* BOTTOM SECTION: Main Worksheets Control Console */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"></main>
      </div>
    </div>
  );
}
