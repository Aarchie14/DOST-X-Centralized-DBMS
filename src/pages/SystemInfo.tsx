import { Navbar } from "../components/layout/Navbar";
import { Sidebar } from "../components/layout/Sidebar";
import { useContext } from "react"; 
import { AuthContext } from "../context/AuthContext"; 

export default function SystemInfo({
}) {
  const { user, users } = useContext(AuthContext)!;

  if (user?.role !== "admin") return null;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 select-none antialiased">
      <Navbar/>
      <Sidebar/>

      <div className="sm:pl-64 transition-all duration-200">
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
            
            {/* Section 1: System Specs */}
            <div className="bg-white border border-slate-200/60 rounded-2xl p-6 shadow-xs space-y-4">
              <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-2.5">
                Core Specifications
              </h2>
              <div className="space-y-3.5 text-xs font-semibold">
                <div className="flex justify-between">
                  <span className="text-slate-400">Application Name</span>
                  <span className="text-slate-700">Centralized Database Management System (CDMS)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">App Version</span>
                  <span className="text-slate-700 font-mono">v1.2.4</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Framework Stack</span>
                  <span className="text-slate-700 font-mono">React 19 / Vite 8 / TS 6</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Style Engine</span>
                  <span className="text-slate-700">Tailwind CSS v4</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">System Environment</span>
                  <span className="text-emerald-600">Production Mode</span>
                </div>
              </div>
            </div>

            {/* Section 2: Hosting and Storage Server */}
            <div className="bg-white border border-slate-200/60 rounded-2xl p-6 shadow-xs space-y-4">
              <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-2.5">
                Infrastructure & Database
              </h2>
              <div className="space-y-3.5 text-xs font-semibold">
                <div className="flex justify-between">
                  <span className="text-slate-400">Simulated Database Host</span>
                  <span className="text-slate-700">DOST-X Local Server Instance</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Active Connection API</span>
                  <span className="text-slate-700 font-mono">SQLite (Encrypted LocalState)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Ping Response Time</span>
                  <span className="text-slate-700 font-mono">4 ms</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Assigned Storage Space</span>
                  <span className="text-slate-700 font-mono">12.4 GB / 50.0 GB (24.8% used)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Server Health Status</span>
                  <span className="text-emerald-600">Healthy & Synchronized</span>
                </div>
              </div>
            </div>

            {/* Section 3: Registered Directories */}
            <div className="bg-white border border-slate-200/60 rounded-2xl p-6 shadow-xs space-y-4">
              <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-2.5">
                System Directory Stats
              </h2>
              <div className="space-y-3.5 text-xs font-semibold">
                <div className="flex justify-between">
                  <span className="text-slate-400">Total Registered Users</span>
                  <span className="text-slate-700">{users.length} accounts</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Configured Department Channels</span>
                  <span className="text-slate-700">4 active (MIS, SCC, Planning, GAD)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Preloaded Project Indices</span>
                  <span className="text-slate-700">5 records</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Primary Sector Divisions</span>
                  <span className="text-slate-700">4 divisions (SETUP, Scholarships, S&T Services, R&D Projects)</span>
                </div>
              </div>
            </div>

            {/* Section 4: Local Office Details */}
            <div className="bg-white border border-slate-200/60 rounded-2xl p-6 shadow-xs space-y-4">
              <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-2.5">
                Regional Hub Information
              </h2>
              <div className="space-y-3.5 text-xs font-semibold">
                <div className="flex justify-between">
                  <span className="text-slate-400">Hosting Office Agency</span>
                  <span className="text-slate-700">DOST Region X (Northern Mindanao)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Office Location</span>
                  <span className="text-slate-700">Cagayan de Oro City, Misamis Oriental</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Regional Director</span>
                  <span className="text-slate-700">Dir. Mark L. Garcia</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Support Email Portal</span>
                  <span className="text-slate-700 font-mono">support@region10.dost.gov.ph</span>
                </div>
              </div>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}
