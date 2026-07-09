interface Props {
  value?: string;
  onChange?: (value: string) => void;
}

const departments = ["All department", "GAD", "SCC", "MIS", "Planning"];

export function DepartmentDropdown({
  value = "All department",
  onChange,
}: Props) {
  return (
    <div className="relative flex items-center group">
      <label className="sr-only">Department</label>

      {/* Left Icon: Department Building */}
      <span className="absolute left-3 pointer-events-none text-slate-400 group-hover:text-[#00aeef] transition-colors z-10">
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
          />
        </svg>
      </span>

      {/* Styled Select Dropdown */}
      <select
        className="appearance-none bg-slate-50 hover:bg-white border border-slate-200 text-slate-600 hover:text-slate-800 font-bold text-xs pl-9 pr-8 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-100 focus:border-[#00aeef] transition-all cursor-pointer shadow-2xs"
        value={value}
        onChange={(e) => onChange && onChange(e.target.value)}
        aria-label="Select department"
      >
        {departments.map((d) => (
          <option key={d} value={d}>
            {d}
          </option>
        ))}
      </select>

      {/* Right Icon: Custom Dropdown Indicator Chevron */}
      <span className="absolute right-3 pointer-events-none text-slate-400 text-[9px] group-hover:text-slate-600 transition-colors">
        ▼
      </span>
    </div>
  );
}

export default DepartmentDropdown;
