import { Navbar } from "../components/layout/Navbar";
import { Sidebar } from "../components/layout/Sidebar";
import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";

/**
 * ActivityLogs Component
 * Renders the clean, minimal table of all system events and operations.
 */
export default function ActivityLogs({
  onViewChange,
  currentView,
}: {
  onViewChange: (view: string) => void;
  currentView: string;
}) {
  const { activityLogs, user, users } = useContext(AuthContext)!;
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUserEmail, setSelectedUserEmail] = useState<string>("All");

  // Determine logs visible based on role and selected filter
  const visibleLogs = activityLogs.filter((log) => {
    if (user?.role === "user") {
      return log.userEmail.toLowerCase() === user.email.toLowerCase();
    } else {
      if (selectedUserEmail === "All") return true;
      return log.userEmail.toLowerCase() === selectedUserEmail.toLowerCase();
    }
  });

  // Search filter applied over visible logs
  const filteredLogs = visibleLogs.filter(
    (log) =>
      log.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.userEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.details.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
      <Navbar
        pageTitle="Activity Logs"
        subTitle="Logs"
        onViewChange={onViewChange}
      />
      <Sidebar activeView={currentView} onViewChange={onViewChange} />

      <div className="sm:pl-64 transition-all duration-200">
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
          
          <div className="flex flex-wrap items-center gap-3">
            {/* Search bar */}
            <div className="relative group max-w-md flex-1 min-w-[280px]">
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
                className="w-full bg-white border border-slate-200 text-sm text-slate-700 placeholder-slate-400 pl-11 pr-4 py-2.5 rounded-xl outline-none focus:border-[#00aeef] transition-all shadow-2xs"
              />
            </div>

            {/* Admin User Filter Dropdown */}
            {user?.role === "admin" && (
              <div className="flex items-center gap-2">
                <label className="text-xs font-bold text-slate-500 whitespace-nowrap">Filter by User:</label>
                <select
                  value={selectedUserEmail}
                  onChange={(e) => setSelectedUserEmail(e.target.value)}
                  className="px-3 py-2 text-xs font-bold border border-slate-200 rounded-xl bg-white focus:border-[#00aeef] focus:outline-none cursor-pointer"
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

          {/* Minimal Logs Table */}
          <div className="bg-white border border-slate-200/50 rounded-2xl shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse whitespace-nowrap">
                <thead>
                  <tr className="border-b border-slate-100 text-xs font-bold text-slate-400 uppercase tracking-wider bg-slate-50/40">
                    <th className="py-3 px-6 w-52">Timestamp</th>
                    <th className="py-3 px-6 w-60">User</th>
                    <th className="py-3 px-6 w-48">Action</th>
                    <th className="py-3 px-6">Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100/70 text-xs font-medium text-slate-600">
                  {filteredLogs.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="py-12 text-center text-xs font-bold text-slate-400 uppercase tracking-wider">
                        No matching activity logs found.
                      </td>
                    </tr>
                  ) : (
                    filteredLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-sky-50/20 transition-colors">
                        <td className="py-3 px-6 font-mono text-slate-400">
                          {formatTimestamp(log.timestamp)}
                        </td>
                        <td className="py-3 px-6">
                          <div className="flex flex-col">
                            <span className="font-semibold text-slate-700">{log.userName}</span>
                            <span className="font-mono text-[10px] text-slate-400 mt-0.5">{log.userEmail}</span>
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
