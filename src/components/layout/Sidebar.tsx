import type { ReactElement } from "react";
import LogoDD from "../../assets/LogoDD.png";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

/**
 * Interface representing a navigation item in the sidebar.
 */
interface NavItem {
  id: string;
  name: string;
  icon: ReactElement;
}

/**
 * Interface for Sidebar props.
 */
interface SidebarProps {
  onViewChange: (view: string) => void;
  activeView: string;
  icon?: ReactElement;
}

/**
 * Sidebar Component
 * Provides global navigation and session management for the application.
 */
export function Sidebar({ onViewChange, activeView }: SidebarProps) {
  const { logout, user } = useContext(AuthContext)!;

  // --- NAVIGATION CONFIGURATION ---
  const navItems: NavItem[] = [
    {
      id: "dashboard",
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
      id: "records",
      name: "Project Records",
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
      id: "repository",
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
            id: "users",
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
            id: "profile",
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
    {
      id: "logs",
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
    ...(user?.role === "admin"
      ? [
          {
            id: "info",
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
    <aside className="fixed inset-y-0 left-0 z-50 hidden sm:flex flex-col w-70 bg-slate-100 border-r border-slate-200 text-slate-700">
      {/* BRANDING LOGO & HEADER AREA */}
      <div className="flex items-center gap-3 px-5 py-6 border-b border-slate-200">
        <div className="flex items-center justify-center shrink-0">
          <img
            src={LogoDD}
            alt="DOST Logo"
            className="h-9 w-auto object-contain drop-shadow-xs"
          />
        </div>

        <div>
          <h1 className="text-sm font-black tracking-wide text-slate-800 uppercase leading-tight">
            DOST HUB
          </h1>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            Northern Mindanao
          </p>
        </div>
      </div>

      {/* NAVIGATION LINKS CONTAINER */}
      <nav className="flex-1 px-4 py-6 space-y-1.5">
        {navItems.map((item) => {
          const isActive = activeView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className={`w-full flex items-center gap-3.5 px-4 py-3 text-xs font-bold rounded-xl transition-all duration-150 cursor-pointer text-left ${
                isActive
                  ? "bg-[#00aeef] text-white shadow-xs"
                  : "text-slate-800 hover:bg-slate-200/70 hover:text-cyan-brand"
              }`}
            >
              <span
                className={
                  isActive
                    ? "text-white"
                    : "text-cyan-brand group-hover:text-slate-600"
                }
              >
                {item.icon}
              </span>
              {item.name}
            </button>
          );
        })}
      </nav>

      {/* SECTION: Footer Actions (Logout) */}
      <div className="p-4 border-t border-slate-200">
        <button
          onClick={logout}
          className="w-full flex items-center justify-center gap-2 py-2.5 text-xs font-bold text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200 group"
        >
          <svg
            className="w-4 h-4 transition-transform group-hover:-translate-x-0.5"
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
          Logout
        </button>
      </div>
    </aside>
  );
}
