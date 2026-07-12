import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

/**
 * Interface representing the properties for the Navbar component.
 */
interface NavbarProps {
  pageTitle?: string;
  subTitle?: string;
  onViewChange: (view: string) => void;
}

/**
 * Navbar Component
 * Serves as the primary navigation header for the CDMS.
 * Features a real-time system clock and a responsive mobile menu.
 */
export function Navbar({
  pageTitle = "Dashboard Overview",
  subTitle = "Dashboard",
  onViewChange,
}: NavbarProps) {
  const { logout } = useContext(AuthContext)!;
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<string>("");

  const navItems = [
    { label: "Dashboard", view: "dashboard" },
    { label: "Project Records", view: "records" },
    { label: "File Repository", view: "repository" },
    { label: "System Info", view: "info" },
  ];

/** Toggles the mobile navigation drawer visibility */
  const toggleMenu = () => setIsOpen(!isOpen);

/** 
   * Updates the system clock every second. 
   * Uses local time formatting for consistency.
   */
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      // Format options to perfectly match: Mon, Jul 6, 2026 • 03:59:12 PM
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
    updateTime(); // Initial run
    const intervalId = setInterval(updateTime, 1000); // Update every second
    return () => clearInterval(intervalId); // Cleanup interval on unmount
  }, []);

  return (
    <nav className="bg-white text-black border-b border-slate-200 sticky top-0 z-50 font-sans md:pl-60">
      <div className="px-2 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-21">
          {/* Dynamic Left Heading Section */}
          <div className="flex flex-col justify-center py-2 px-6">
            <h1 className="text-slate-900 font-extrabold text-xl tracking-tight leading-none">
              {pageTitle}
            </h1>
            <div className="text-xs font-medium text-slate-400 mt-1">
              Home &gt;{" "}
              <span className="text-blue-500 font-semibold">{subTitle}</span>
            </div>
          </div>

          {/* DESKTOP ONLY: Real-time System Clock */}
          <div className="hidden md:flex items-center gap-1 text-black font-medium text-sm tracking-wide">
            {/* Clock Icon */}
            <svg
              className="w-4 h-4 text-slate-800 shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>{currentTime || "Loading status..."}</span>
          </div>

          {/* MOBILE ONLY: Menu Button (Hamburger) */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMenu}
              type="button"
              className="text-slate-900 hover:text-cyan-600 focus:outline-none cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>
      
      {/* MOBILE ONLY: Dropdown Panel */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-slate-100 px-2 pt-2 pb-4 space-y-1 shadow-inner">
          {navItems.map((item) => (
            <button
              key={item.label}
              onClick={() => {
                onViewChange(item.view);
                setIsOpen(false);
              }}
              className="w-full text-left block px-3 py-2 rounded-md text-base font-bold text-slate-600 hover:bg-cyan-50 hover:text-[#00aeef] transition-colors cursor-pointer"
            >
              {item.label}
            </button>
          ))}
          {/* Logout Button */}
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
