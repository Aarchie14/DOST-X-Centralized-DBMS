import { Navbar } from "../components/layout/Navbar";
import { Sidebar } from "../components/layout/Sidebar";
import { DepartmentDropdown } from "../components/common/DepartmentDropdown";
import DOSTD from "../assets/DOSTD.png";
import herorBg from "../assets/hheror.bg.png";
import { departmentStats } from "../Data/departmentData";
import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  // 1. AuthContext Hook to access user role and authentication functions
  const { user } = useContext(AuthContext)!;
  const navigate = useNavigate();

  if (!user) return null;

  // 2. STATE INTERFACES LOGIC HOOKS
  const [selectedDepartment, setSelectedDepartment] =
    useState<string>("All department");

  // Resolve the active data based on current state selection
  const currentStats =
    departmentStats[selectedDepartment] || departmentStats["All department"];

  const handleNavigate = (view: string) => {
    if (view === "records") {
      navigate("/dashboard/database");
    } else if (view === "repository") {
      navigate("/dashboard/repository");
    } else {
      navigate(`/dashboard/${view}`);
    }
  };

  // 3. THE SINGLE CORRECT RETURN STATEMENT
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 select-none antialiased">
      {/* Global Navigation Interfaces */}
      <Navbar />
      <Sidebar />
      {/* Main Container Wrapper */}
      <div className="w-full overflow-x-hidden sm:pl-64 transition-all duration-200">
        {/* TOP SECTION: Hero Banner Container */}
        <div
          className="relative bg-cover bg-no-repeat border-b border-slate-200 py-20"
          style={{
            backgroundImage: `url(${herorBg})`,
            backgroundPosition: "center center",
          }}
        >
          {/* Restructured Gradient Mask */}
          <div className="absolute inset-0 via-transparent to-black/10 pointer-events-none" />

          {/* Content Box - Centered Brand Hub */}
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10 flex flex-col items-center justify-center text-center">
            <div className="flex flex-col items-center group drop-shadow-sm">
              <img
                src={DOSTD}
                alt="DOST Logo"
                className="h-50 w-auto object-contain"
              />
            </div>
          </div>
        </div>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          {/* items-stretch matches left and right column heights automatically */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
            {/* LEFT COLUMN: Premium Analytics Cards matched to right column height */}
            <div className="flex flex-col gap-4 h-full">
              <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Analytics
              </h2>

              {/* Card 1: Total Files */}
              <div className="group flex-1 bg-white border border-slate-200/60 rounded-2xl p-6 flex items-center justify-between shadow-xs hover:shadow-md hover:border-cyan-200 transition-all duration-200 cursor-pointer">
                <div className="flex flex-col">
                  <span className="text-4xl font-extrabold text-slate-900 tracking-tight group-hover:text-[#00aeef] transition-colors">
                    {currentStats.totalFiles}
                  </span>
                  <span className="text-xs font-bold text-slate-400 mt-1 tracking-wide uppercase">
                    Total Files
                  </span>
                </div>
                <div className="p-3.5 bg-cyan-50 text-[#00aeef] rounded-xl group-hover:bg-[#00aeef] group-hover:text-white transition-all duration-200 shadow-2xs">
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
              </div>

              {/* Card 2: Total Project Databases */}
              <div className="group flex-1 bg-white border border-slate-200/60 rounded-2xl p-6 flex items-center justify-between shadow-xs hover:shadow-md hover:border-emerald-200 transition-all duration-200 cursor-pointer">
                <div className="flex flex-col">
                  <span className="text-4xl font-extrabold text-slate-900 tracking-tight group-hover:text-emerald-500 transition-colors">
                    {currentStats.projectRecords}
                  </span>
                  <span className="text-xs font-bold text-slate-400 mt-1 tracking-wide uppercase">
                    Total Project Databases
                  </span>
                </div>
                <div className="p-3.5 bg-emerald-50 text-emerald-500 rounded-xl group-hover:bg-emerald-500 group-hover:text-white transition-all duration-200 shadow-2xs">
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                    />
                  </svg>
                </div>
              </div>

              {/* Card 3: Key Sectors */}
              <div className="group flex-1 bg-white border border-slate-200/60 rounded-2xl p-6 flex items-center justify-between shadow-xs hover:shadow-md hover:border-indigo-200 transition-all duration-200 cursor-pointer">
                <div className="flex flex-col">
                  <span className="text-4xl font-extrabold text-slate-900 tracking-tight group-hover:text-indigo-600 transition-colors">
                    {currentStats.sectors}
                  </span>
                  <span className="text-xs font-bold text-slate-400 mt-1 tracking-wide uppercase">
                    Key Sectors
                  </span>
                </div>
                <div className="p-3.5 bg-indigo-50 text-indigo-500 rounded-xl group-hover:bg-indigo-600 group-hover:text-white transition-all duration-200 shadow-2xs">
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11 3.055A9.003 9.003 0 1020.945 13H11V3.055z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z"
                    />
                  </svg>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: Quick Operations & Sector Progress Bars */}
            <div className="lg:col-span-2 flex flex-col gap-4">
              <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Quick Operations
              </h2>

              {/* ACTION RIBBON */}
              <div className="flex flex-wrap items-center gap-3 bg-white p-3 border border-slate-200/60 rounded-2xl shadow-xs">
                {/* Embedded Search Icon Button */}
                <button
                  type="button"
                  onClick={() => handleNavigate("repository")}
                  className="flex-1 min-w-[200px] flex items-center bg-slate-50 border border-slate-200 hover:border-[#00aeef] text-slate-400 hover:text-slate-500 px-4 py-2 rounded-xl transition-all active:scale-[0.98] cursor-pointer text-left group"
                  aria-label="Trigger search panel"
                >
                  <svg
                    className="w-4 h-4 text-slate-400 group-hover:text-[#00aeef] group-hover:scale-110 transition-all shrink-0 mr-2.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                  <span className="text-sm tracking-wide text-slate-400 select-none">
                    Search Project Database..
                  </span>
                </button>

                {user.role === "admin" ? (
                  <>
                    {/* Admin Action: Create */}
                    <button
                      type="button"
                      onClick={() =>
                        navigate("/dashboard/database", {
                          state: { openModal: true },
                        })
                      }
                      className="inline-flex items-center gap-2 bg-[#00aeef] text-white font-bold text-xs px-4 py-2.5 rounded-xl hover:bg-sky-600 transition-all shadow-2xs"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2.5}
                          d="M12 4v16m8-8H4"
                        />
                      </svg>
                      <span>New Database Entry</span>
                    </button>

                    {/* Admin Action: Upload */}
                    <button
                      type="button"
                      onClick={() => handleNavigate("repository")}
                      className="inline-flex items-center gap-2 bg-emerald-500 text-white font-bold text-xs px-4 py-2.5 rounded-xl hover:bg-emerald-600 transition-all shadow-2xs"
                    >
                      <span>Upload CSV/Excel</span>
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                        />
                      </svg>
                    </button>
                  </>
                ) : (
                  <>
                    {/* User Navigation: Database */}
                    <button
                      onClick={() => handleNavigate("database")}
                      className="inline-flex items-center gap-2 bg-slate-50 border border-slate-200 text-slate-700 font-bold text-xs px-4 py-2.5 rounded-xl hover:bg-slate-200 transition-all group cursor-pointer"
                    >
                      <svg
                        className="w-4 h-4 text-slate-500 transition-colors duration-150 group-hover:text-cyan-brand shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 6h16M4 10h16M4 14h16M4 18h16"
                        />
                      </svg>
                      <span>View Database</span>
                    </button>

                    {/* User Navigation: Files */}
                    <button
                      onClick={() => handleNavigate("repository")}
                      className="inline-flex items-center gap-2 bg-slate-50 border border-slate-200 text-slate-700 font-bold text-xs px-4 py-2.5 rounded-xl hover:bg-slate-200 transition-all group cursor-pointer"
                    >
                      <svg
                        className="w-4 h-4 text-slate-500 transition-colors duration-150 group-hover:text-cyan-brand shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
                        />
                      </svg>
                      <span>View Files</span>
                    </button>
                  </>
                )}

                {/* Dropdown Component Wrapper */}
                <DepartmentDropdown
                  value={selectedDepartment}
                  onChange={(val) => setSelectedDepartment(val)}
                />
              </div>

              {/* CHART BOX CONSOLE */}
              <div className="bg-white border border-slate-200/60 rounded-2xl p-5 shadow-xs flex flex-col justify-between flex-1 gap-4">
                <div>
                  <h3 className="text-sm font-bold text-slate-800">
                    Project Distribution by Sector
                  </h3>
                  <p className="text-[11px] font-medium text-slate-400 mt-0.5">
                    Overview of focused areas in{" "}
                    <span className="text-blue-500 font-semibold underline cursor-pointer">
                      {selectedDepartment}
                    </span>
                  </p>
                </div>

                {/* Dynamic Progress Bars Stack */}
                <div className="space-y-4">
                  {currentStats.distribution.map((sector) => (
                    <div key={sector.name} className="space-y-1.5">
                      <span className="text-xs font-bold text-slate-600 block">
                        {sector.name}
                      </span>
                      <div className="w-full bg-slate-100 h-5 rounded-lg overflow-hidden relative flex items-center border border-slate-200/30">
                        <div
                          className={`bg-gradient-to-r ${sector.color} h-full rounded-lg transition-all duration-500 flex items-center pl-2.5`}
                          style={{
                            width:
                              sector.count === 0 ? "7%" : sector.percentage,
                          }}
                        >
                          <span
                            className={`text-[10px] font-extrabold whitespace-nowrap ${sector.count === 0 ? "text-slate-400 pl-1" : "text-white drop-shadow-xs"}`}
                          >
                            {sector.percentage} ({sector.count})
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
