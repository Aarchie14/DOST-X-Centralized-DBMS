interface FileRecord {
  id: number;
  fileName: string;
  department: string;
  lastAccessed: string;
}

interface FileTableProps {
  files: FileRecord[];
  onDelete: (id: number, name: string) => void;
  onDownload: (fileName: string) => void;
}

export function FileTable({ files, onDelete, onDownload }: FileTableProps) {
  const ITEMS_PER_PAGE = 10;
  // This ensures we always have exactly 10 rows worth of height
  const emptyRows = ITEMS_PER_PAGE - files.length;

  return (
    <div className="w-full h-full overflow-hidden">
      <table className="w-full text-left border-collapse table-fixed">
        <thead className="sticky top-0 bg-slate-50 border-b border-slate-200 z-10">
          <tr className="text-slate-500 text-xs uppercase tracking-wider">
            <th className="px-6 py-4 font-semibold w-1/3">File Name</th>
            <th className="px-6 py-4 font-semibold w-1/4">Department</th>
            <th className="px-6 py-4 font-semibold w-1/4">Last Accessed</th>
            <th className="px-6 py-4 font-semibold w-1/6 text-center">
              Action
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {files.map((file) => (
            <tr
              key={file.id}
              className="h-[52px] hover:bg-slate-50 transition-colors group"
            >
              <td className="px-6 py-2 text-sm font-medium text-slate-700 truncate">
                {file.fileName}
              </td>
              <td className="px-6 py-2 text-sm text-slate-600">
                {file.department}
              </td>
              <td className="px-6 py-2 text-sm text-slate-600 font-mono">
                {file.lastAccessed}
              </td>
              <td className="px-6 py-2 text-center">
                <div className="flex items-center justify-center gap-3">
                  <button
                    onClick={() => onDownload(file.fileName)}
                    className="text-slate-400 hover:text-[#00aeef] transition-colors"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                      />
                    </svg>
                  </button>
                  <button
                    onClick={() => onDelete(file.id, file.fileName)}
                    className="text-slate-400 hover:text-red-500 transition-colors"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
          ))}

          {emptyRows > 0 &&
            Array.from({ length: emptyRows }).map((_, index) => (
              <tr key={`empty-${index}`} className="h-[52px]">
                {/* Remove borders from empty rows so they don't look like cut-off lines */}
                <td colSpan={4} className="border-none">
                  &nbsp;
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}
