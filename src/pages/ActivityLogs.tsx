import { Navbar } from "../components/layout/Navbar";
import { Sidebar } from "../components/layout/Sidebar";
import { useContext, useState, useMemo } from "react";
import { AuthContext } from "../context/AuthContext";

/**
 * ActivityLogs Component
 * Renders a scrollable, minimal table of all system events and operations.
 */
export default function ActivityLogs({
}) {
  const { activityLogs = [], user, users = [] } = useContext(AuthContext)!;
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUserEmail, setSelectedUserEmail] = useState<string>("All");

  // Memoize filtering to protect performance as logs scale
  const filteredLogs = useMemo(() => {
    const searchLower = searchQuery.toLowerCase().trim();
    const filterEmailLower = selectedUserEmail.toLowerCase();
    const currentUserEmailLower = user?.email?.toLowerCase();

    return activityLogs.filter((log) => {
      const logEmailLower = log.userEmail.toLowerCase();

      // 1. Role-based & Dropdown user filtering
      if (user?.role === "user") {
        if (logEmailLower !== currentUserEmailLower) return false;
      } else if (selectedUserEmail !== "All") {
        if (logEmailLower !== filterEmailLower) return false;
      }

      // 2. Search query matching
      if (!searchLower) return true;

      return (
        log.userName.toLowerCase().includes(searchLower) ||
        logEmailLower.includes(searchLower) ||
        log.action.toLowerCase().includes(searchLower) ||
        log.details.toLowerCase().includes(searchLower)
      );
    });
  }, [activityLogs, searchQuery, selectedUserEmail, user]);

  /** Formats timestamp ISO string into a clean date-time format */
  const formatTimestamp = (isoString: string) => {
    const d = new Date(isoString);
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 select-none antialiased">
      <Navbar />
      <Sidebar/>

      <div className="sm:pl-64 transition-all duration-200">
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
          {/* Header Controls aligned perfectly to the table edges */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 w-full">
            {/* Search bar - Left Aligned */}
            <div className="relative group flex-1 w-full">
              <svg
                className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2"
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
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search logs..."
                className="w-full bg-white border border-slate-200 text-sm text-slate-700 placeholder-slate-400 pl-11 pr-4 py-2.5 rounded-xl outline-none focus:border-[#00aeef] transition-all shadow-xs"
              />
            </div>

            {/* Admin User Filter Dropdown - Right Aligned */}
            {user?.role === "admin" && (
              <div className="flex items-center justify-between sm:justify-end gap-2 w-full sm:w-auto">
                <label className="text-xs font-bold text-slate-500 whitespace-nowrap">
                  Filter by User:
                </label>
                <select
                  value={selectedUserEmail}
                  onChange={(e) => setSelectedUserEmail(e.target.value)}
                  className="px-3 py-2 text-xs font-bold border border-slate-200 rounded-xl bg-white focus:border-[#00aeef] focus:outline-none cursor-pointer shadow-xs min-w-[160px]"
                >
                  <option value="All">All Users</option>
                  {users.map((u) => (
                    <option key={u.email} value={u.email}>
                      {u.name} ({u.role})
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* Table Outer Container */}
          <div className="bg-white border border-slate-200/60 rounded-2xl shadow-xs overflow-hidden">
            {/* Scrollable container with fixed maximum height */}
            <div className="overflow-x-auto overflow-y-auto max-h-[calc(100vh-250px)] custom-scrollbar">
              <table className="w-full text-left border-collapse whitespace-nowrap">
                <thead>
                  {/* Sticky headers wrapper */}
                  <tr className="sticky top-0 z-10 border-b border-slate-100 text-xs font-bold text-slate-400 uppercase tracking-wider bg-slate-50/90 backdrop-blur-xs">
                    <th className="py-3.5 px-6 w-52">Timestamp</th>
                    <th className="py-3.5 px-6 w-60">User</th>
                    <th className="py-3.5 px-6 w-48">Action</th>
                    <th className="py-3.5 px-6">Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100/70 text-xs font-medium text-slate-600">
                  {filteredLogs.length === 0 ? (
                    <tr>
                      <td
                        colSpan={4}
                        className="py-16 text-center text-sm font-medium text-slate-400"
                      >
                        No matching activity logs found.
                      </td>
                    </tr>
                  ) : (
                    filteredLogs.map((log) => (
                      <tr
                        key={log.id}
                        className="hover:bg-slate-50/60 transition-colors"
                      >
                        <td className="py-3 px-6 font-mono text-slate-400">
                          {formatTimestamp(log.timestamp)}
                        </td>
                        <td className="py-3 px-6">
                          <div className="flex flex-col">
                            <span className="font-semibold text-slate-700">
                              {log.userName}
                            </span>
                            <span className="font-mono text-[10px] text-slate-400 mt-0.5">
                              {log.userEmail}
                            </span>
                          </div>
                        </td>
                        <td className="py-3 px-6 font-semibold text-slate-700">
                          {log.action}
                        </td>
                        <td className="py-3 px-6 text-slate-500 break-words whitespace-normal max-w-lg">
                          {log.details}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
