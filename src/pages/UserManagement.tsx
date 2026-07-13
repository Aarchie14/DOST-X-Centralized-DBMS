import { Navbar } from "../components/layout/Navbar";
import { Sidebar } from "../components/layout/Sidebar";
import { useContext, useState } from "react";
import { AuthContext, type User } from "../context/AuthContext";
import { DeleteConfirmModal } from "../components/common/DeleteConfirmModal";
import { Toast } from "../components/common/Toast";

/**
 * UserManagement Component
 * Allows administrators to search, create, modify, and delete users from the system.
 */
export default function UserManagement({
  onViewChange,
  currentView,
}: {
  onViewChange: (view: string) => void;
  currentView: string;
}) {
  const { users, addUser, updateUser, deleteUser, addLog } = useContext(AuthContext)!;

  // --- UI STATES ---
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [notification, setNotification] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null);

  // --- DATA STATES ---
  const [editingEmail, setEditingEmail] = useState<string | null>(null);
  const [deletingUser, setDeletingUser] = useState<User | null>(null);
  const [userForm, setUserForm] = useState<User>({
    name: "",
    email: "",
    role: "user",
    department: "MIS",
    systemAccess: "Standard Access (Read, Write, Edit Records)",
  });

  const showToast = (message: string, type: "success" | "error" | "info" = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  // --- SEARCH FILTER ---
  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.department.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // --- MODAL HANDLERS ---
  const openCreateModal = () => {
    setEditingEmail(null);
    setUserForm({
      name: "",
      email: "",
      role: "user",
      department: "MIS",
      systemAccess: "Standard Access (Read, Write, Edit Records)",
    });
    setIsModalOpen(true);
  };

  const openEditModal = (user: User) => {
    setEditingEmail(user.email);
    setUserForm({ ...user });
    setIsModalOpen(true);
  };

  const submitForm = (e: React.FormEvent) => {
    e.preventDefault();

    if (!userForm.name.trim() || !userForm.email.trim()) {
      showToast("All fields are required", "error");
      return;
    }

    if (editingEmail) {
      // Handle update
      updateUser(editingEmail, userForm);
      showToast(`User details for "${userForm.name}" updated`, "info");
      addLog("User Management - Update", `Updated details for system user: "${userForm.name}" (${userForm.email})`);
    } else {
      // Check for duplicate emails
      const isDuplicate = users.some(
        (u) => u.email.toLowerCase() === userForm.email.toLowerCase()
      );
      if (isDuplicate) {
        showToast("A user with this email address already exists", "error");
        return;
      }
      // Handle addition
      addUser(userForm);
      showToast(`User "${userForm.name}" added successfully`, "success");
      addLog("User Management - Register", `Registered new system user: "${userForm.name}" (${userForm.email})`);
    }

    setIsModalOpen(false);
  };

  const startDeleteFlow = (user: User) => {
    setDeletingUser(user);
    setIsDeleteOpen(true);
  };

  const confirmDelete = () => {
    if (deletingUser) {
      deleteUser(deletingUser.email);
      showToast(`User "${deletingUser.name}" has been deleted`, "error");
      addLog("User Management - Delete", `Deleted system user: "${deletingUser.name}" (${deletingUser.email})`);
      setIsDeleteOpen(false);
      setDeletingUser(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 select-none antialiased">
      <Navbar
        pageTitle="User Management"
        subTitle="Users"
        onViewChange={onViewChange}
      />
      <Sidebar activeView={currentView} onViewChange={onViewChange} />

      <div className="sm:pl-64 transition-all duration-200">
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
          
          {/* Toolbar and Search */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex-1 min-w-[280px] relative group">
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
                placeholder="Search users..."
                className="w-full bg-white border border-slate-200 text-sm text-slate-700 placeholder-slate-400 pl-11 pr-4 py-2.5 rounded-xl outline-none focus:border-[#00aeef] transition-all shadow-2xs"
              />
            </div>

            <button
              onClick={openCreateModal}
              className="h-[42px] inline-flex items-center gap-2 bg-[#00aeef] text-white font-bold text-xs px-5 rounded-xl hover:bg-sky-600 transition-all active:scale-[0.98] cursor-pointer shadow-2xs"
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
              Add System User
            </button>
          </div>

          {/* User Directory Table */}
          <div className="bg-white border border-slate-200/50 rounded-2xl shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse whitespace-nowrap">
                <thead>
                  <tr className="border-b border-slate-100 text-xs font-bold text-slate-400 uppercase tracking-wider bg-slate-50/40">
                    <th className="py-3 px-6">Name</th>
                    <th className="py-3 px-6">Email</th>
                    <th className="py-3 px-6">Role</th>
                    <th className="py-3 px-6">Department</th>
                    <th className="py-3 px-6">System Access</th>
                    <th className="py-3 px-6 text-center w-28">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100/70 text-xs font-medium text-slate-600">
                  {filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-xs font-bold text-slate-400 uppercase tracking-wider">
                        No matching system users found.
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map((u) => (
                      <tr key={u.email} className="hover:bg-sky-50/20 transition-colors">
                        <td className="py-3 px-6 font-semibold text-slate-800">
                          {u.name}
                        </td>
                        <td className="py-3 px-6 font-mono text-slate-500">
                          {u.email}
                        </td>
                        <td className="py-3 px-6 capitalize text-slate-700">
                          {u.role}
                        </td>
                        <td className="py-3 px-6 text-slate-700">
                          {u.department}
                        </td>
                        <td className="py-3 px-6 text-slate-500 truncate max-w-xs" title={u.systemAccess}>
                          {u.systemAccess}
                        </td>
                        <td className="py-3 px-6 text-center">
                          <div className="inline-flex items-center gap-1.5">
                            <button
                              onClick={() => openEditModal(u)}
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
                              onClick={() => startDeleteFlow(u)}
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
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </main>
      </div>

      {/* --- ADD / EDIT USER DIALOG --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity" onClick={() => setIsModalOpen(false)} />
          <form
            onSubmit={submitForm}
            className="bg-white border border-slate-100 rounded-2xl w-full max-w-md p-6 relative z-10 shadow-xl animate-in fade-in zoom-in-95 duration-150 space-y-4"
          >
            <h3 className="text-sm font-bold text-slate-800">
              {editingEmail ? "Edit System User Details" : "Register New System User"}
            </h3>

            <div className="space-y-3.5 text-xs font-semibold text-slate-600">
              {/* Name */}
              <div className="space-y-1">
                <label className="text-slate-500">Full Name</label>
                <input
                  type="text"
                  required
                  value={userForm.name}
                  onChange={(e) => setUserForm({ ...userForm, name: e.target.value })}
                  placeholder="e.g. John Doe"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:border-[#00aeef] focus:outline-none"
                />
              </div>

              {/* Email */}
              <div className="space-y-1">
                <label className="text-slate-500">Email Address</label>
                <input
                  type="email"
                  required
                  disabled={!!editingEmail}
                  value={userForm.email}
                  onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
                  placeholder="e.g. jdoe@dost.gov.ph"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:border-[#00aeef] focus:outline-none disabled:bg-slate-50 disabled:text-slate-400"
                />
              </div>

              {/* Role & Department Row */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-500">System Role</label>
                  <select
                    value={userForm.role}
                    onChange={(e) => setUserForm({ ...userForm, role: e.target.value as "admin" | "user" })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white focus:border-[#00aeef] focus:outline-none cursor-pointer"
                  >
                    <option value="user">Staff (user)</option>
                    <option value="admin">Administrator</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-slate-500">Department</label>
                  <select
                    value={userForm.department}
                    onChange={(e) => setUserForm({ ...userForm, department: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white focus:border-[#00aeef] focus:outline-none cursor-pointer"
                  >
                    <option value="MIS">MIS</option>
                    <option value="SCC">SCC</option>
                    <option value="Planning">Planning</option>
                    <option value="GAD">GAD</option>
                  </select>
                </div>
              </div>

              {/* System Access privileges text */}
              <div className="space-y-1">
                <label className="text-slate-500">System Access Permissions</label>
                <input
                  type="text"
                  required
                  value={userForm.systemAccess}
                  onChange={(e) => setUserForm({ ...userForm, systemAccess: e.target.value })}
                  placeholder="e.g. Read, Write, Delete"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:border-[#00aeef] focus:outline-none"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2.5 text-xs font-bold text-slate-500 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2.5 text-xs font-bold text-white bg-[#00aeef] hover:bg-sky-600 rounded-xl transition-all shadow-2xs cursor-pointer"
              >
                {editingEmail ? "Save Updates" : "Register User"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* --- CONFIRM DELETE MODAL --- */}
      <DeleteConfirmModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={confirmDelete}
        projectName={deletingUser ? `${deletingUser.name} (${deletingUser.email})` : ""}
      />

      {/* --- TOASTS --- */}
      {notification && <Toast notification={notification} />}
    </div>
  );
}
