import type { User } from "../../types/auth";

interface UserTableProps {
  users: User[];
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
}

export function UserTable({ users, onEdit, onDelete }: UserTableProps) {
  return (
    <div className="bg-white border border-slate-200/50 rounded-2xl shadow-xs overflow-hidden">
      <div className="overflow-x-auto">
        {/* Main Header Table */}
        <table className="w-full text-left border-collapse whitespace-nowrap">
          <thead>
            <tr className="border-b border-slate-100 text-xs font-bold text-slate-400 uppercase tracking-wider bg-slate-50/40">
              <th className="py-3 px-6 w-[20%]">Name</th>
              <th className="py-3 px-6 w-[25%]">Email</th>
              <th className="py-3 px-6 w-[15%]">Role</th>
              <th className="py-3 px-6 w-[15%]">Department</th>
              <th className="py-3 px-6 w-[15%]">System Access</th>
              <th className="py-3 px-6 text-center w-28">Actions</th>
            </tr>
          </thead>
        </table>
      </div>

      {/* Scrollable Body Container */}
      <div className="max-h-[600px] overflow-y-auto">
        <table className="w-full text-left border-collapse whitespace-nowrap">
          <tbody className="divide-y divide-slate-100/70 text-xs font-medium text-slate-600">
            {users.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="py-12 text-center text-xs font-bold text-slate-400 uppercase tracking-wider"
                >
                  No matching system users found.
                </td>
              </tr>
            ) : (
              users.map((u) => {
                let accessPrivileges: string[] = [];

                // 1. Flatten whatever data structure is there into a single clean string
                const rawAccessString = Array.isArray(u.systemAccess)
                  ? u.systemAccess.join(",")
                  : String(u.systemAccess || "");

                const cleanString = rawAccessString.trim();

                if (cleanString !== "") {
                  // 2. If it's a legacy bracketed string: "FULL ACCESS (READ, WRITE)"
                  if (cleanString.includes("(") && cleanString.includes(")")) {
                    const insideBrackets = cleanString.match(/\(([^)]+)\)/);
                    if (insideBrackets && insideBrackets[1]) {
                      accessPrivileges = insideBrackets[1]
                        .split(",")
                        .map((priv) => priv.trim().toLowerCase())
                        .filter(Boolean);
                    }
                  }
                  // 3. Catch if it's a giant smashed block without proper commas
                  else if (
                    !cleanString.includes(",") &&
                    cleanString.length > 12
                  ) {
                    const lowerSource = cleanString
                      .toLowerCase()
                      .replace(/[\s_]+/g, "");

                    // Define all possible permission tokens your system uses
                    const systemTokens = [
                      { key: "manage_users", match: "manageusers" },
                      { key: "manage_users", match: "usermanagement" },
                      { key: "edit_records", match: "editrecords" },
                      { key: "delete", match: "delete" },
                      { key: "write", match: "write" },
                      { key: "read", match: "read" },
                    ];

                    // Scan the text and pull out matched tokens sequentially
                    systemTokens.forEach(({ key, match }) => {
                      if (
                        lowerSource.includes(match) &&
                        !accessPrivileges.includes(key)
                      ) {
                        accessPrivileges.push(key);
                      }
                    });
                  }
                  // 4. Normal, well-formatted comma-separated strings or arrays
                  else {
                    accessPrivileges = cleanString
                      .split(",")
                      .map((priv) => priv.trim().toLowerCase())
                      .filter(Boolean);
                  }
                }

                return (
                  <tr
                    key={u.email}
                    className="hover:bg-sky-50/20 transition-colors"
                  >
                    <td className="py-3 px-6 font-semibold text-slate-800 w-[20%]">
                      {u.name}
                    </td>
                    <td className="py-3 px-6 font-mono text-slate-500 w-[25%]">
                      {u.email}
                    </td>
                    <td className="py-3 px-6 capitalize text-slate-700 w-[15%]">
                      {u.role}
                    </td>
                    <td className="py-3 px-6 text-slate-700 w-[15%]">
                      {u.department}
                    </td>

                    <td className="py-3 px-6 w-[15%]">
                      <div className="flex flex-wrap gap-1 max-w-xs">
                        {accessPrivileges.length > 0 ? (
                          accessPrivileges.map((perm) => (
                            <span
                              key={perm}
                              className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider border ${
                                perm === "manage_users" || perm === "delete"
                                  ? "bg-rose-50 text-rose-600 border-rose-100"
                                  : perm === "write"
                                    ? "bg-amber-50 text-amber-600 border-amber-100"
                                    : "bg-slate-100 text-slate-600 border-slate-200"
                              }`}
                            >
                              {perm.replace(/_/g, " ")}
                            </span>
                          ))
                        ) : (
                          <span className="text-slate-400 text-xs italic">
                            No Access
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="py-3 px-6 text-center w-28">
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          onClick={() => onEdit(u)}
                          className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg hover:text-blue-500 transition-all cursor-pointer"
                          title="Edit user details"
                        >
                          <svg
                            className="w-3.5 h-3.5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2.5}
                              d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                            />
                          </svg>
                        </button>
                        <button
                          onClick={() => onDelete(u)}
                          className="p-1.5 bg-slate-100 hover:bg-rose-50 text-slate-700 hover:text-rose-600 rounded-lg transition-all cursor-pointer"
                          title="Delete user"
                        >
                          <svg
                            className="w-3.5 h-3.5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2.5}
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-16v4M4 7h16"
                            />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
