import { useState, useEffect, useContext, useMemo } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

interface NavItem {
  label: string;
  path: string;
  rolesAllowed: ("admin" | "user")[];
}

const NAVIGATION_ROUTES: NavItem[] = [
  { label: "Dashboard", path: "/dashboard", rolesAllowed: ["admin", "user"] },
  { label: "Project Database", path: "/dashboard/database", rolesAllowed: ["admin", "user"] },
  { label: "File Repository", path: "/dashboard/repository", rolesAllowed: ["admin", "user"] },
  { label: "User Management", path: "/dashboard/management", rolesAllowed: ["admin"] },
  { label: "User Profile", path: "/dashboard/profile", rolesAllowed: ["admin", "user"] },
  { label: "Activity Log", path: "/dashboard/logs", rolesAllowed: ["admin"] },
  { label: "System Info", path: "/dashboard/info", rolesAllowed: ["admin"] },
];

// 1. Removed NavbarProps completely since the navbar calculates titles dynamically!
export function Navbar() {
  const { logout, user } = useContext(AuthContext)!;
  const [isOpen, setIsOpen] = useState<boolean>(false);
const [currentTime, setCurrentTime] = useState<string>("");

  const location = useLocation();

  const allowedNavItems = useMemo(() => {
    const userRole = (user?.role || "user") as "admin" | "user";
    return NAVIGATION_ROUTES.filter((route) => route.rolesAllowed.includes(userRole));
  }, [user]);

  const currentRoute = useMemo(() => {
    return NAVIGATION_ROUTES.find((route) => route.path === location.pathname);
  }, [location.pathname]);

  // 2. These clean local variables now calculate safely without shadowing errors
  const pageTitle = currentRoute ? `${currentRoute.label} Overview` : "Dashboard Overview";
  const subTitle = currentRoute ? currentRoute.label : "Dashboard";

  const toggleMenu = () => setIsOpen(!isOpen);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const dateString = now.toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
        year: "numeric",
      });
      const timeString = now.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      });
      setCurrentTime(`${dateString} • ${timeString}`);
    };
    updateTime();
    const intervalId = setInterval(updateTime, 1000);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <nav className="bg-white text-black border-b border-slate-200 sticky top-0 z-50 font-sans md:pl-60">
      <div className="px-2 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-21">
          <div className="flex flex-col justify-center py-2 px-6">
            <h1 className="text-slate-900 font-extrabold text-xl tracking-tight leading-none">
              {pageTitle}
            </h1>
            <div className="text-xs font-medium text-slate-400 mt-1">
              Home &gt; <span className="text-blue-500 font-semibold">{subTitle}</span>
            </div>
          </div>

          {/* Desktop Clock State */}
          <div className="hidden md:flex items-center gap-1 text-black font-medium text-sm tracking-wide">
            <svg className="w-4 h-4 text-slate-800 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{currentTime || "Loading status..."}</span>
          </div>

          {/* Mobile Menu Toggle Button */}
          <div className="md:hidden flex items-center">
            <button onClick={toggleMenu} type="button" className="text-slate-900 focus:outline-none cursor-pointer">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* MOBILE ONLY: Dropdown Panel */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-slate-100 px-2 pt-2 pb-4 space-y-1 shadow-inner">
          {allowedNavItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/dashboard"}
              onClick={() => setIsOpen(false)}
              className={({ isActive }) =>
                `w-full text-left block px-3 py-2 rounded-md text-base font-bold transition-colors cursor-pointer ${
                  isActive ? "bg-cyan-50 text-[#00aeef]" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
          <button
            onClick={() => {
              logout();
              setIsOpen(false);
            }}
            className="w-full text-left block px-3 py-2 mt-2 rounded-md text-base font-bold text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer border-t border-slate-100"
          >
            Logout
          </button>
        </div>
      )}
    </nav>
  );
}