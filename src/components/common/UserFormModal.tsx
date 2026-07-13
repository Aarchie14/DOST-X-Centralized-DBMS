import type { FormEvent } from "react";
import type { User } from "../../types/auth";

interface UserFormModalProps {
  isEdit: boolean;
  userForm: User & { password?: string };
  onFormChange: (updatedForm: User & { password?: string }) => void;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void; // Fixed generic parameter here
  onClose: () => void;
}

export function UserFormModal({
  isEdit,
  userForm,
  onFormChange,
  onSubmit,
  onClose,
}: UserFormModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />
      <form
        onSubmit={onSubmit}
        className="bg-white border border-slate-100 rounded-2xl w-full max-w-md p-6 relative z-10 shadow-xl animate-in fade-in zoom-in-95 duration-150 space-y-4"
      >
        <h3 className="text-sm font-bold text-slate-800">
          {isEdit ? "Edit System User Details" : "Register New System User"}
        </h3>

        {/* Input Wrapper Group Container */}
        <div className="space-y-3.5 text-xs font-semibold text-slate-600">
          {/* Full Name */}
          <div className="space-y-1">
            <label className="text-slate-500">Full Name</label>
            <input
              type="text"
              required
              value={userForm.name}
              onChange={(e) =>
                onFormChange({ ...userForm, name: e.target.value })
              }
              placeholder="e.g. John Doe"
              className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:border-[#00aeef] focus:outline-none"
            />
          </div>

          {/* Email Address */}
          <div className="space-y-1">
            <label className="text-slate-500">Email Address</label>
            <input
              type="email"
              required
              disabled={isEdit}
              value={userForm.email}
              onChange={(e) =>
                onFormChange({ ...userForm, email: e.target.value })
              }
              placeholder="e.g. jdoe@dost.gov.ph"
              className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:border-[#00aeef] focus:outline-none disabled:bg-slate-50 disabled:text-slate-400"
            />
          </div>

          {/* Dynamic Password Field */}
          {!isEdit && (
            <div className="space-y-1 animate-in fade-in slide-in-from-top-2 duration-200">
              <label className="text-slate-500">
                Temporary / Initial Password
              </label>
              <input
                type="password"
                required={!isEdit}
                value={userForm.password || ""}
                onChange={(e) =>
                  onFormChange({ ...userForm, password: e.target.value })
                }
                placeholder="Set initial account password"
                minLength={6}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:border-[#00aeef] focus:outline-none"
              />
              <p className="text-[10px] text-slate-400 font-normal mt-0.5">
                Provide this password to the user for their initial login.
              </p>
            </div>
          )}

          {/* Role & Department Row */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-slate-500">System Role</label>
              <select
                value={userForm.role}
                onChange={(e) =>
                  onFormChange({
                    ...userForm,
                    role: e.target.value as "admin" | "user",
                  })
                }
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
                onChange={(e) =>
                  onFormChange({ ...userForm, department: e.target.value })
                }
                className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white focus:border-[#00aeef] focus:outline-none cursor-pointer"
              >
                <option value="MIS">MIS</option>
                <option value="SCC">SCC</option>
                <option value="Planning">Planning</option>
                <option value="GAD">GAD</option>
              </select>
            </div>
          </div>
        </div>

        {/* Interactive System Access Permission Tags */}
        <div className="space-y-2">
          <label className="text-slate-500 block text-xs font-semibold">
            System Access Privileges
          </label>

          <div className="flex flex-wrap gap-2">
            {(
              [
                "read",
                "write",
                "delete",
                "manage_users",
                "edit_records",
              ] as const
            ).map((perm) => {
              const isSelected = userForm.systemAccess?.includes(perm);

              const handleTogglePermission = () => {
                const currentPermissions = Array.isArray(userForm.systemAccess)
                  ? userForm.systemAccess
                  : [];

                const updatedPermissions = isSelected
                  ? currentPermissions.filter((p) => p !== perm)
                  : [...currentPermissions, perm];

                onFormChange({ ...userForm, systemAccess: updatedPermissions });
              };

              const labelMap: Record<string, string> = {
                read: "Read Records",
                write: "Create/Edit",
                delete: "Delete Records",
                manage_users: "User Management",
                edit_records: "Edit Records",
              };

              return (
                <button
                  key={perm}
                  type="button"
                  onClick={handleTogglePermission}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer select-none flex items-center gap-1 ${
                    isSelected
                      ? "bg-[#00aeef]/10 border-[#00aeef] text-[#00aeef] shadow-xs"
                      : "bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100"
                  }`}
                >
                  {isSelected && (
                    <svg
                      className="w-3 h-3"
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
                  )}
                  {labelMap[perm]}
                </button>
              );
            })}
          </div>
          <p className="text-[10px] text-slate-400 font-normal mt-1">
            Click the badges to toggle explicit access privileges for this
            account.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 text-xs font-bold text-slate-500 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2.5 text-xs font-bold text-white bg-[#00aeef] hover:bg-sky-600 rounded-xl transition-all shadow-2xs cursor-pointer"
          >
            {isEdit ? "Save Updates" : "Register User"}
          </button>
        </div>
      </form>
    </div>
  );
}
