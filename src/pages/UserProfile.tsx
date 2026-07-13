import { Navbar } from "../components/layout/Navbar";
import { Sidebar } from "../components/layout/Sidebar";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

/**
 * UserProfile Component
 * Renders the active user's details, role, department, and system access rights.
 */
export default function UserProfile({}) {
  const { user } = useContext(AuthContext)!;

  if (!user) return null;

  // 1. Declare output cleanly as a string array
  let accessPrivileges: string[] = [];

  // 2. Perform isolated runtime checks to avoid "never" type-narrowing errors
  if (Array.isArray(user.systemAccess)) {
    accessPrivileges = user.systemAccess;
  } else if (user.systemAccess) {
    // Coerce to raw string safely away from TypeScript's compiler constraints
    const cleanString = String(user.systemAccess as unknown);
    
    // Check if it's the specific complex legacy text string: "FULL ACCESS (READ, WRITE, ...)"
    if (cleanString.includes("(") && cleanString.includes(")")) {
      const insideBrackets = cleanString.match(/\(([^)]+)\)/);
      if (insideBrackets && insideBrackets[1]) {
        accessPrivileges = insideBrackets[1]
          .split(",")
          .map((priv) => priv.trim().toLowerCase()) // Match the uniform backend keys
          .filter(Boolean);
      }
    } else if (cleanString.trim() !== "") {
      // Standard comma-separated fallback string parser
      accessPrivileges = cleanString
        .split(",")
        .map((priv) => priv.trim().toLowerCase())
        .filter(Boolean);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 select-none antialiased">
      <Navbar />
      <Sidebar />

      <div className="sm:pl-64 transition-all duration-200">
        <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
          {/* Card Body */}
          <div className="bg-white border border-slate-200/60 rounded-2xl p-6 md:p-8 shadow-xs space-y-6">
          
            {/* Brand Header */}
            <div className="flex items-center gap-4 border-b border-slate-100 pb-6">
              <div className="w-16 h-16 rounded-2xl bg-cyan-50 text-[#00aeef] flex items-center justify-center font-bold text-2xl shadow-inner border border-cyan-100/30">
                {user.name.charAt(0)}
              </div>
              <div>
                <h2 className="text-lg font-extrabold text-slate-800 leading-tight">
                  {user.name}
                </h2>
                <p className="text-xs font-bold text-slate-400 mt-1 uppercase tracking-wider">
                  {user.role === "admin"
                    ? "System Administrator"
                    : "Regular User Member"}
                </p>
              </div>
            </div>

            {/* Grid of Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
                  Email Address
                </span>
                <span className="text-sm font-semibold text-slate-700 font-mono">
                  {user.email}
                </span>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
                  Assigned Department
                </span>
                <span className="text-sm font-semibold text-slate-700">
                  {user.department}
                </span>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
                  System Role
                </span>
                <span className="text-sm font-semibold text-slate-700 capitalize">
                  {user.role}
                </span>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
                  Region Assignment
                </span>
                <span className="text-sm font-semibold text-slate-700">
                  Region X (Northern Mindanao)
                </span>
              </div>
            </div>

            {/* Access Privileges Section */}
            <div className="border-t border-slate-100 pt-6 space-y-3">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                System Access Privileges
              </h3>

              {accessPrivileges.length > 0 ? (
                <ul className="space-y-2 text-xs font-bold text-slate-600">
                  {accessPrivileges.map((privilege, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <svg
                        className="w-3.5 h-3.5 text-emerald-500 shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={3}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      <span className="uppercase tracking-wider text-[11px] bg-slate-50 border border-slate-200 px-2 py-0.5 rounded-md">
                        {privilege.replace(/_/g, " ")}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-xs italic text-slate-400 font-medium">
                  No system access privileges assigned to this profile.
                </p>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}