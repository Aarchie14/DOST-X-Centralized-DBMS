import { useState, useContext, useEffect } from "react"; 
import type { ReactElement } from "react";
import LogoDD from "../../assets/LogoDD.png";
import { AuthContext } from "../../context/AuthContext";
import { useSidebar } from "../../context/SidebarContext";
import { NavLink } from "react-router-dom";

interface NavItem {
  path: string;
  name: string;
  icon: ReactElement;
}

export function Sidebar() {
  const { logout, user } = useContext(AuthContext)!;
  const { isCollapsed, setIsCollapsed, isHovered, setIsHovered } = useSidebar();
  const [isProfileExpanded, setIsProfileExpanded] = useState<boolean>(false);

  const isOpen = !isCollapsed || isHovered;

  // Track body class to dynamically adjust main page layout paddings
  useEffect(() => {
    if (isCollapsed) {
      document.body.classList.remove("sidebar-expanded");
    } else {
      document.body.classList.add("sidebar-expanded");
    }
  }, [isCollapsed]);

  const navItems: NavItem[] = [
    {
      path: "/dashboard",
      name: "Dashboard",
      icon: (
        <svg
          className="w-5 h-5"
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
      ),
    },
    {
      path: "/dashboard/database",
      name: "Project Database",
      icon: (
        <svg
          className="w-5 h-5"
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
      ),
    },
    {
      path: "/dashboard/repository",
      name: "File Repository",
      icon: (
        <svg
          className="w-5 h-5"
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
      ),
    },
    ...(user?.role === "admin"
      ? [
          {
            path: "/dashboard/management",
            name: "User Management",
            icon: (
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            ),
          },
        ]
      : [
          {
            path: "/dashboard/profile",
            name: "User Profile",
            icon: (
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            ),
          },
        ]),
    ...(user?.role === "admin"
      ? [
          {
            path: "/dashboard/logs",
            name: "Activity Logs",
            icon: (
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                />
              </svg>
            ),
          },
          {
            path: "/dashboard/info",
            name: "System Info",
            icon: (
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            ),
          },
        ]
      : []),
  ];

  return (
    <aside
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`fixed inset-y-0 left-0 z-50 hidden sm:flex flex-col bg-slate-100 border-r border-slate-200 text-slate-700 transition-all duration-300 ease-in-out ${
        isOpen ? "w-70" : "w-20"
      }`}
    >
      {/* PERSISTENT TOGGLE BUTTON (Arrow) */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          setIsCollapsed(!isCollapsed);
        }}
        type="button"
        className={`absolute top-6 -right-3.5 z-60 hidden sm:flex items-center justify-center w-7 h-7 bg-white border border-slate-200 rounded-full text-slate-500 hover:text-[#00aeef] hover:border-[#00aeef] shadow-xs hover:shadow-md cursor-pointer transition-all ${
          isCollapsed ? "" : "rotate-180"
        }`}
        aria-label="Toggle Sidebar"
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
            d="M9 5l7 7-7 7"
          />
        </svg>
      </button>

      {/* BRANDING LOGO & HEADER AREA */}
      <div className={`flex items-center gap-3 px-5 py-6 border-b border-slate-200 transition-all duration-300 ${isOpen ? "justify-start" : "justify-center"}`}>
        <div className="flex items-center justify-center shrink-0">
          <img
            src={LogoDD}
            alt="DOST Logo"
            className="h-9 w-auto object-contain drop-shadow-xs"
          />
        </div>
        {isOpen && (
          <div className="animate-fadeIn">
            <h1 className="text-sm font-black tracking-wide text-slate-800 uppercase leading-tight">
              DOST HUB
            </h1>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              Northern Mindanao
            </p>
          </div>
        )}
      </div>

      {/* NAVIGATION LINKS CONTAINER */}
      <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto overflow-x-hidden">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === "/dashboard"}
            className={({ isActive }) =>
              `w-full flex items-center gap-3.5 px-4 py-3 text-xs font-bold rounded-xl transition-all duration-150 cursor-pointer text-left group ${
                isOpen ? "justify-start px-4" : "justify-center px-0"
              } ${
                isActive
                  ? "bg-[#00aeef] text-white shadow-xs"
                  : "text-slate-800 hover:bg-slate-200/70 hover:text-cyan-brand"
              }`
            }
          >
            {({ isActive }) => (
              <>
                <span
                  className={`transition-colors duration-150 shrink-0 ${
                    isActive
                      ? "text-white"
                      : "text-slate-500 group-hover:text-cyan-brand"
                  }`}
                >
                  {item.icon}
                </span>
                {isOpen && <span className="animate-fadeIn truncate">{item.name}</span>}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* NEW FOOTER SECTION: Dynamic Account Card & Toggle Menu */}
      <div className={`p-3 border-t border-slate-200 bg-slate-50/50 transition-all duration-300 ${isOpen ? "" : "flex justify-center"}`}>
        <div className="flex flex-col gap-1 w-full">
          {/* Main Account Identity Card Component */}
          <button
            onClick={() => isOpen && setIsProfileExpanded(!isProfileExpanded)}
            type="button"
            className={`w-full flex items-center justify-between p-2.5 rounded-xl transition-all text-left cursor-pointer group ${
              !isOpen ? "justify-center p-1 bg-transparent hover:bg-slate-200/50" : isProfileExpanded ? "bg-slate-200/80" : "hover:bg-slate-200/50"
            }`}
          >
            <div className="flex items-center gap-3 min-w-0">
              {/* Fallback User Avatar Circle Layout */}
              <div className="w-8 h-8 rounded-lg bg-[#00aeef] text-white flex items-center justify-center font-bold text-sm shrink-0 uppercase shadow-xs">
                {user?.name
                  ? user.name.charAt(0)
                  : user?.email?.charAt(0) || "U"}
              </div>

              {/* Account Identity Strings */}
              {isOpen && (
                <div className="flex flex-col min-w-0 animate-fadeIn">
                  <span className="text-xs font-bold text-slate-800 truncate leading-tight">
                    {user?.name || "Active Session"}
                  </span>
                  <span className="text-[10px] font-semibold text-slate-400 truncate mt-0.5 uppercase tracking-wide">
                    {user?.role || "user"} account
                  </span>
                </div>
              )}
            </div>

            {/* Caret Down Arrow Indicator */}
            {isOpen && (
              <svg
                className={`w-4 h-4 text-slate-400 transition-transform duration-200 shrink-0 ml-2 ${
                  isProfileExpanded
                    ? "rotate-180 text-slate-600"
                    : "group-hover:text-slate-600"
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            )}
          </button>

          {/* Collapsible Action Dropdown Drawer */}
          {isOpen && isProfileExpanded && (
            <div className="px-1 pt-1 animate-fadeIn">
              <button
                onClick={logout}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 rounded-lg transition-colors duration-150 text-left cursor-pointer group"
              >
                <svg
                  className="w-4 h-4 text-rose-500 transition-transform group-hover:-translate-x-0.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
                Logout from Hub
              </button>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
