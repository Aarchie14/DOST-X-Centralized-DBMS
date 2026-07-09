import { DepartmentDropdown } from "./DepartmentDropdown"; // <--- THIS LINE IS MISSING
import { ExportDropdown } from "./ExportDropdown";

interface TableToolbarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  selectedDepartment: string;
  onDepartmentChange: (value: string) => void;
  // Add '?' to make these optional
  onNewRecordClick?: () => void;
  onExportCSV?: () => void;
  onExportExcel?: () => void;
}

export function TableToolbar({
  searchQuery,
  onSearchChange,
  selectedDepartment,
  onDepartmentChange,
  onNewRecordClick, // These are now optional
  onExportCSV,
  onExportExcel,
}: TableToolbarProps) {
  return (
    <div className="flex flex-wrap items-center gap-3 mb-6">
      {/* Search Input */}
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
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search..."
          className="w-full bg-slate-100/80 border border-slate-200/60 text-sm text-slate-700 placeholder-slate-400 pl-11 pr-4 py-2.5 rounded-xl outline-none focus:bg-white focus:border-[#00aeef] transition-all"
        />
      </div>

      <DepartmentDropdown
        value={selectedDepartment}
        onChange={onDepartmentChange}
      />

      {/* Conditionally render New Record Button */}
      {onNewRecordClick && (
        <button
          onClick={onNewRecordClick}
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
          <span>New Record Entry</span>
        </button>
      )}

      {/* Conditionally render Export Dropdown */}
      {(onExportCSV || onExportExcel) && (
        <div className="h-[42px]">
          <ExportDropdown
            onExportCSV={onExportCSV ?? (() => {})}
            onExportExcel={onExportExcel ?? (() => {})}
          />
        </div>
      )}
    </div>
  );
}
