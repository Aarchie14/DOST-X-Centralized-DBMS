import { useState, useRef, useEffect } from "react";

interface ExportDropdownProps {
  onExportCSV?: () => void;
  onExportExcel?: () => void;
}

export function ExportDropdown({
  onExportCSV,
  onExportExcel,
}: ExportDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block text-left h-[42px]" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="h-full flex items-center gap-2 px-5 bg-emerald-500 border hover:bg-emerald-600 text-white font-bold text-xs rounded-xl shadow-2xs transition-all duration-150"
      >
        <svg
          className="w-4 h-4 text-white"
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
        <span>Export As</span>
        <svg
          className={`w-3 h-3 text-white transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2.5}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-44 rounded-xl bg-white border border-slate-200/80 shadow-lg z-50 py-1.5 animate-in fade-in slide-in-from-top-1 duration-100">
          <button
            onClick={() => {
              onExportExcel?.();
              setIsOpen(false);
            }}
            className="flex items-center gap-2.5 w-full px-3 py-2 text-left text-xs font-medium text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 transition-colors"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            Microsoft Excel (.csv)
          </button>

          <button
            onClick={() => {
              onExportCSV?.();
              setIsOpen(false);
            }}
            className="flex items-center gap-2.5 w-full px-3 py-2 text-left text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors"
          >
            <span className="w-2 h-2 rounded-full bg-slate-400" />
            Standard Plain CSV
          </button>
        </div>
      )}
    </div>
  );
}
