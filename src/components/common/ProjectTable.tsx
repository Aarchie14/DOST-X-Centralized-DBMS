import type { ProjectRecord } from "../../config/constants";
import { STATUSES } from "../../config/constants";

interface ProjectTableProps {
  filteredRecords: ProjectRecord[];
  totalCount: number;
  itemsPerPage: number;
  currentPage: number;
  onPageChange: (page: number) => void;
  formatCurrency: (amount: number) => string;
  onOpenEditModal: (project: ProjectRecord) => void;
  onDeleteRecord: (project: ProjectRecord) => void;
}

export function ProjectTable({
  filteredRecords,
  totalCount,
  itemsPerPage,
  currentPage,
  onPageChange,
  formatCurrency,
  onOpenEditModal,
  onDeleteRecord,
}: ProjectTableProps) {
  const totalPages = Math.ceil(totalCount / itemsPerPage);

  const rangeStart =
    totalCount === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const rangeEnd = Math.min(currentPage * itemsPerPage, totalCount);

  // Easily adjust your badge design palette right here!
  const statusBadgeStyles: Record<string, string> = {
    [STATUSES.ON_GOING]:
      "bg-green-500/10 text-green-700 border border-green-500/20",
    [STATUSES.UNDER_REVIEW]:
      "bg-amber-500/10 text-amber-800 border border-amber-500/20",
    [STATUSES.COMPLETED]: "bg-sky-500/10 text-sky-700 border border-sky-500/20",
  };

  return (
    <div className="bg-white border border-slate-200/50 rounded-2xl shadow-xs overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse whitespace-nowrap">
          <thead>
            <tr className="border-b border-slate-100 text-xs font-bold text-slate-400 uppercase tracking-wider bg-slate-50/40">
              <th className="py-3 px-6 w-16">ID</th>
              <th className="py-3 px-6">Project Name</th>
              <th className="py-3 px-6">Department</th>
              <th className="py-3 px-6">Sector / Category</th>
              <th className="py-3 px-6">Budget</th>
              <th className="py-3 px-6">Status</th>
              <th className="py-3 px-6">Last Accessed</th>
              <th className="py-3 px-6 text-center w-24">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100/70 text-xs font-medium text-slate-600">
            {filteredRecords.length === 0 ? (
              <tr>
                <td
                  colSpan={8}
                  className="py-12 text-center text-xs font-bold text-slate-400 uppercase tracking-wider"
                >
                  No matches found for your active criteria filters.
                </td>
              </tr>
            ) : (
              filteredRecords.map((project) => {
                // Fetch the mapped status classes, fallback if not explicitly found
                const activeBadgeStyle =
                  statusBadgeStyles[project.status] ||
                  "bg-slate-100 text-slate-600 border border-slate-200";

                return (
                  <tr
                    key={project.id}
                    className="hover:bg-sky-50/20 transition-colors"
                  >
                    <td className="py-2.5 px-6 text-slate-500 font-mono">
                      #{project.id}
                    </td>
                    <td className="py-2.5 px-6 font-semibold text-slate-700 break-words whitespace-normal max-w-xs">
                      {project.name}
                    </td>
                    <td className="py-2.5 px-6 text-slate-500">
                      {project.department}
                    </td>
                    <td className="py-2.5 px-6 text-slate-500">
                      {project.sectorCategory}
                    </td>
                    <td className="py-2.5 px-6 font-mono font-semibold text-slate-700">
                      {formatCurrency(project.budget)}
                    </td>
                    <td className="py-2.5 px-6">
                      <span
                        className={`inline-flex items-center text-[11px] font-bold px-2 py-0.5 rounded-full shadow-2xs ${activeBadgeStyle}`}
                      >
                        {project.status}
                      </span>
                    </td>
                    <td className="py-2.5 px-6 font-mono text-slate-400 text-xs">
                      {project.lastAccessed}
                    </td>
                    <td className="py-2.5 px-6 text-center">
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          onClick={() => onOpenEditModal(project)}
                          className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg hover:text-blue-500 transition-all cursor-pointer"
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
                          onClick={() => onDeleteRecord(project)}
                          className="p-1.5 bg-slate-100 hover:bg-rose-50 text-slate-700 hover:text-rose-600 rounded-lg transition-all cursor-pointer"
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

      <div className="px-6 py-3 border-t border-slate-100 flex items-center justify-between flex-wrap gap-3 bg-slate-50/20">
        <span className="text-xs font-bold text-slate-400">
          Showing {rangeStart} to {rangeEnd} of {totalCount} entries
        </span>

        {totalPages > 1 && (
          <div className="inline-flex items-center gap-1 bg-slate-100/60 p-1 rounded-xl border border-slate-200/30">
            <button
              disabled={currentPage === 1}
              onClick={() => onPageChange(currentPage - 1)}
              className="p-1.5 rounded-lg text-slate-500 hover:bg-white hover:text-slate-800 disabled:opacity-40 disabled:hover:bg-transparent cursor-pointer disabled:cursor-not-allowed transition-all"
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
            </button>

            {Array.from({ length: totalPages }, (_, index) => {
              const pageNumber = index + 1;
              return (
                <button
                  key={pageNumber}
                  onClick={() => onPageChange(pageNumber)}
                  className={`w-7 h-7 flex items-center justify-center font-bold text-xs rounded-lg transition-all cursor-pointer ${
                    currentPage === pageNumber
                      ? "bg-[#00aeef] text-white shadow-xs"
                      : "text-slate-500 hover:bg-white hover:text-slate-700"
                  }`}
                >
                  {pageNumber}
                </button>
              );
            })}

            <button
              disabled={currentPage === totalPages}
              onClick={() => onPageChange(currentPage + 1)}
              className="p-1.5 rounded-lg text-slate-500 hover:bg-white hover:text-slate-800 disabled:opacity-40 disabled:hover:bg-transparent cursor-pointer disabled:cursor-not-allowed transition-all"
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
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
