import { DEPARTMENTS, SECTORS, STATUSES } from "../../config/constants";
import type { Department, Sector, ProjectStatus } from "../../config/constants";

interface ProjectFormModalProps {
  editingId: number | null;
  newProject: {
    name: string;
    department: Exclude<Department, "All department"> | "";
    sectorCategory: Sector | "";
    budget: string;
    status: ProjectStatus | "";
  };
  setNewProject: React.Dispatch<React.SetStateAction<{
    name: string;
    department: Exclude<Department, "All department"> | "";
    sectorCategory: Sector | "";
    budget: string;
    status: ProjectStatus | "";
  }>>;
  onSubmit: (e: React.FormEvent) => void;
  onClose: () => void;
}

export function ProjectFormModal({ editingId, newProject, setNewProject, onSubmit, onClose }: ProjectFormModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity" onClick={onClose} />
      
      <div className="bg-white border border-slate-100 rounded-2xl w-full max-w-md p-6 relative z-10 shadow-xl animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
          <h3 className="text-sm font-bold text-slate-800">
            {editingId !== null ? "Edit Project Entry" : "Add New Project Entry"}
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1 rounded-lg transition-colors cursor-pointer">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wide mb-1.5">Project Name</label>
            <input
              type="text"
              required
              value={newProject.name}
              onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
              placeholder="Enter a project name"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-sm text-slate-700 placeholder-slate-400 outline-none focus:bg-white focus:border-[#00aeef] transition-all"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wide mb-1.5">Filing Dept.</label>
              <select
                required
                value={newProject.department}
                onChange={(e) => setNewProject({ ...newProject, department: e.target.value as any })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-700 outline-none focus:bg-white focus:border-[#00aeef] cursor-pointer invalid:text-slate-400"
              >
                <option value="" disabled hidden>Select department</option>
                {Object.values(DEPARTMENTS).filter(d => d !== "All department").map(d => (
                  <option key={d} value={d} className="text-slate-700">{d}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wide mb-1.5">Status</label>
              <select
                required
                value={newProject.status}
                onChange={(e) => setNewProject({ ...newProject, status: e.target.value as any })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-700 outline-none focus:bg-white focus:border-[#00aeef] cursor-pointer invalid:text-slate-400"
              >
                <option value="" disabled hidden>Select status</option>
                {Object.values(STATUSES).map(s => (
                  <option key={s} value={s} className="text-slate-700">{s}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wide mb-1.5">Sector Area / Category</label>
            <select
              required
              value={newProject.sectorCategory}
              onChange={(e) => setNewProject({ ...newProject, sectorCategory: e.target.value as any })}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-700 outline-none focus:bg-white focus:border-[#00aeef] cursor-pointer invalid:text-slate-400"
            >
              <option value="" disabled hidden>Select sector area</option>
              {Object.values(SECTORS).map(s => (
                <option key={s} value={s} className="text-slate-700">{s}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wide mb-1.5">Project Allocation Budget (PHP)</label>
            <input
              type="number"
              required
              min="0"
              value={newProject.budget}
              onChange={(e) => setNewProject({ ...newProject, budget: e.target.value })}
              placeholder="Enter allocated budget amount"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 font-mono text-sm text-slate-700 placeholder-slate-400 outline-none focus:bg-white focus:border-[#00aeef] transition-all"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 mt-5">
            <button type="button" onClick={onClose} className="px-4 py-2 text-xs font-bold text-slate-500 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all cursor-pointer">Cancel</button>
            <button type="submit" className="px-5 py-2 text-xs font-bold text-white bg-[#00aeef] hover:bg-sky-600 rounded-xl transition-all shadow-2xs active:scale-95 cursor-pointer">
              {editingId !== null ? "Update Entry" : "Save Entry"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}