import { useDatabaseView } from "../../hooks/useDatabaseView";
import { DATABASE_COLUMNS } from "../../config/databaseEntries";
import type { DatabaseEntry } from "../../config/databaseEntries";
import type { ProjectRecord } from "../../config/constants";
import { DeleteConfirmModal } from "./DeleteConfirmModal";
import { Toast } from "./Toast";

/**
 * Props interface for the DatabaseView component.
 */
interface DatabaseViewProps {
  project: ProjectRecord;
  userRole?: "admin" | "user";
  onBack: () => void;
}

/**
 * DatabaseView Component
 * Renders a full CRUD table for a specific project's database entries.
 * Supports inline editing, adding rows, and role-based deletion.
 */
export function DatabaseView({ project, userRole, onBack }: DatabaseViewProps) {
  const {
    entries,
    editingEntryId,
    editFormValues,
    startEditing,
    cancelEditing,
    saveEdit,
    updateEditField,
    isAddingRow,
    newRowValues,
    startAddingRow,
    cancelAddingRow,
    confirmAddRow,
    updateNewRowField,
    deletingEntry,
    requestDeleteEntry,
    confirmDeleteEntry,
    cancelDeleteEntry,
    notification,
  } = useDatabaseView(project.id);

  /** Formats raw numbers into Philippine Peso currency strings */
  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("en-PH", {
      style: "currency",
      currency: "PHP",
      maximumFractionDigits: 0,
    }).format(amount);

  /** Renders an editable or read-only cell based on editing state */
  const renderCell = (entry: DatabaseEntry, col: typeof DATABASE_COLUMNS[number]) => {
    const isEditing = editingEntryId === entry.entryId;
    const value = isEditing ? editFormValues[col.key] : entry[col.key];

    // Non-editable columns (entryId) always render as plain text
    if (!col.editable || !isEditing) {
      if (col.key === "amountGranted") {
        return (
          <span className="font-mono font-semibold text-slate-700">
            {formatCurrency(entry[col.key] as number)}
          </span>
        );
      }
      if (col.key === "entryId") {
        return <span className="text-slate-500 font-mono">#{entry.entryId}</span>;
      }
      return <span>{String(entry[col.key])}</span>;
    }

    // Editable input fields
    if (col.type === "number") {
      return (
        <input
          type="number"
          value={value as number}
          onChange={(e) => updateEditField(col.key, e.target.value)}
          className="w-full px-2 py-1 text-xs border border-cyan-300 rounded-lg bg-cyan-50/30 focus:outline-none focus:ring-2 focus:ring-cyan-400/40 font-mono"
        />
      );
    }
    if (col.type === "date") {
      return (
        <input
          type="date"
          value={value as string}
          onChange={(e) => updateEditField(col.key, e.target.value)}
          className="w-full px-2 py-1 text-xs border border-cyan-300 rounded-lg bg-cyan-50/30 focus:outline-none focus:ring-2 focus:ring-cyan-400/40"
        />
      );
    }
    return (
      <input
        type="text"
        value={value as string}
        onChange={(e) => updateEditField(col.key, e.target.value)}
        className="w-full px-2 py-1 text-xs border border-cyan-300 rounded-lg bg-cyan-50/30 focus:outline-none focus:ring-2 focus:ring-cyan-400/40"
      />
    );
  };

  return (
    <div className="space-y-4">
      {/* SECTION: Header Bar with Back Button and Project Info */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          {/* Back Button */}
          <button
            onClick={onBack}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-all active:scale-95 cursor-pointer"
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
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to Records
          </button>

          {/* Project Identifier */}
          <div className="flex flex-col">
            <h2 className="text-sm font-extrabold text-slate-800 tracking-tight">
              {project.name}
            </h2>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-[11px] font-bold text-slate-400">
                {project.department}
              </span>
              <span className="text-slate-300">•</span>
              <span className="text-[11px] font-bold text-slate-400">
                {project.sectorCategory}
              </span>
              <span className="text-slate-300">•</span>
              <span className="inline-flex items-center text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-cyan-100 text-cyan-700">
                {entries.length} {entries.length === 1 ? "entry" : "entries"}
              </span>
            </div>
          </div>
        </div>

        {/* Add Row Action Button */}
        {!isAddingRow && (
          <button
            onClick={startAddingRow}
            className="inline-flex items-center gap-2 bg-[#00aeef] text-white font-bold text-xs px-4 py-2.5 rounded-xl hover:bg-sky-600 transition-all shadow-2xs active:scale-95 cursor-pointer"
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
            Add Entry
          </button>
        )}
      </div>

      {/* SECTION: Data Table */}
      <div className="bg-white border border-slate-200/50 rounded-2xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse whitespace-nowrap">
            {/* Table Header */}
            <thead>
              <tr className="border-b border-slate-100 text-xs font-bold text-slate-400 uppercase tracking-wider bg-slate-50/40">
                {DATABASE_COLUMNS.map((col) => (
                  <th key={col.key} className="py-3 px-4">
                    {col.label}
                  </th>
                ))}
                <th className="py-3 px-4 text-center w-28">Actions</th>
              </tr>
            </thead>

            {/* Table Body */}
            <tbody className="divide-y divide-slate-100/70 text-xs font-medium text-slate-600">
              {entries.length === 0 && !isAddingRow ? (
                <tr>
                  <td
                    colSpan={DATABASE_COLUMNS.length + 1}
                    className="py-16 text-center text-xs font-bold text-slate-400 uppercase tracking-wider"
                  >
                    No entries found for this project. Click "Add Entry" to get
                    started.
                  </td>
                </tr>
              ) : (
                entries.map((entry) => {
                  const isEditing = editingEntryId === entry.entryId;
                  return (
                    <tr
                      key={entry.entryId}
                      className={`transition-colors ${
                        isEditing
                          ? "bg-cyan-50/40 ring-1 ring-inset ring-cyan-200"
                          : "hover:bg-sky-50/20"
                      }`}
                    >
                      {DATABASE_COLUMNS.map((col) => (
                        <td key={col.key} className="py-2.5 px-4">
                          {renderCell(entry, col)}
                        </td>
                      ))}

                      {/* Action Buttons per Row */}
                      <td className="py-2.5 px-4 text-center">
                        <div className="inline-flex items-center gap-1.5">
                          {isEditing ? (
                            <>
                              {/* Save Edit */}
                              <button
                                onClick={saveEdit}
                                className="p-1.5 bg-emerald-100 hover:bg-emerald-200 text-emerald-700 rounded-lg transition-all cursor-pointer"
                                title="Save changes"
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
                                    d="M5 13l4 4L19 7"
                                  />
                                </svg>
                              </button>
                              {/* Cancel Edit */}
                              <button
                                onClick={cancelEditing}
                                className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-500 rounded-lg transition-all cursor-pointer"
                                title="Cancel editing"
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
                                    d="M6 18L18 6M6 6l12 12"
                                  />
                                </svg>
                              </button>
                            </>
                          ) : (
                            <>
                              {/* Edit Row */}
                              <button
                                onClick={() => startEditing(entry)}
                                className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg hover:text-blue-500 transition-all cursor-pointer"
                                title="Edit entry"
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

                              {/* Delete Row — Admin only */}
                              {userRole === "admin" && (
                                <button
                                  onClick={() => requestDeleteEntry(entry)}
                                  className="p-1.5 bg-slate-100 hover:bg-rose-50 text-slate-700 hover:text-rose-600 rounded-lg transition-all cursor-pointer"
                                  title="Delete entry"
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
                              )}
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}

              {/* SECTION: Add New Row — Inline Form */}
              {isAddingRow && (
                <tr className="bg-emerald-50/30 ring-1 ring-inset ring-emerald-200">
                  {/* Entry ID — auto-generated */}
                  <td className="py-2.5 px-4">
                    <span className="text-slate-400 font-mono text-xs italic">
                      Auto
                    </span>
                  </td>

                  {/* Editable fields for new row */}
                  {DATABASE_COLUMNS.filter((col) => col.key !== "entryId").map(
                    (col) => (
                      <td key={col.key} className="py-2.5 px-4">
                        <input
                          type={
                            col.type === "number"
                              ? "number"
                              : col.type === "date"
                                ? "date"
                                : "text"
                          }
                          placeholder={col.label}
                          value={
                            newRowValues[
                              col.key as keyof typeof newRowValues
                            ] as string | number
                          }
                          onChange={(e) =>
                            updateNewRowField(
                              col.key as keyof Omit<
                                import("../../config/databaseEntries").DatabaseEntry,
                                "entryId"
                              >,
                              col.type === "number"
                                ? e.target.value
                                : e.target.value,
                            )
                          }
                          className="w-full px-2 py-1 text-xs border border-emerald-300 rounded-lg bg-white/80 focus:outline-none focus:ring-2 focus:ring-emerald-400/40 placeholder:text-slate-300"
                        />
                      </td>
                    ),
                  )}

                  {/* Action buttons for new row */}
                  <td className="py-2.5 px-4 text-center">
                    <div className="inline-flex items-center gap-1.5">
                      {/* Confirm Add */}
                      <button
                        onClick={confirmAddRow}
                        className="p-1.5 bg-emerald-100 hover:bg-emerald-200 text-emerald-700 rounded-lg transition-all cursor-pointer"
                        title="Save new entry"
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
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </button>
                      {/* Cancel Add */}
                      <button
                        onClick={cancelAddingRow}
                        className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-500 rounded-lg transition-all cursor-pointer"
                        title="Cancel"
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
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* SECTION: Table Footer — Entry Count */}
        <div className="px-6 py-3 border-t border-slate-100 flex items-center justify-between bg-slate-50/20">
          <span className="text-xs font-bold text-slate-400">
            {entries.length} {entries.length === 1 ? "entry" : "entries"} total
          </span>
        </div>
      </div>

      {/* MODALS & OVERLAYS */}
      <DeleteConfirmModal
        isOpen={!!deletingEntry}
        onClose={cancelDeleteEntry}
        onConfirm={confirmDeleteEntry}
        projectName={
          deletingEntry
            ? `Entry #${deletingEntry.entryId} — ${deletingEntry.beneficiaryName}`
            : ""
        }
      />

      {/* Toast */}
      {notification && <Toast notification={notification} />}
    </div>
  );
}
