/**
 * Interface for DeleteConfirmModal component props.
 */
interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  projectName: string;
}

/**
 * DeleteConfirmModal Component
 * A destructive action confirmation modal used to prevent accidental deletion 
 * of project records.
 */
export function DeleteConfirmModal({ isOpen, onClose, onConfirm, projectName }: DeleteConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop blur effect */}
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity" onClick={onClose} />

      {/* Modal Card Body */}
      <div className="bg-white border border-slate-100 rounded-2xl w-full max-w-sm p-6 relative z-10 shadow-xl animate-in fade-in zoom-in-95 duration-150 text-center">
        {/* Warning Icon Graphic */}
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-rose-50 text-rose-600 mb-4">
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>

        <h3 className="text-sm font-bold text-slate-800 mb-2">Delete Project Entry Entry</h3>
        <p className="text-xs text-slate-500 font-medium leading-relaxed mb-6 px-2">
          Are you sure you want to delete <span className="font-semibold text-slate-700">"{projectName}"</span>? This action cannot be undone.
        </p>

        {/* Modal Buttons Grid Layout */}
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 text-xs font-bold text-slate-500 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="px-4 py-2.5 text-xs font-bold text-white bg-rose-500 hover:bg-rose-600 rounded-xl transition-all shadow-2xs active:scale-95 cursor-pointer"
          >
            Delete Record
          </button>
        </div>
      </div>
    </div>
  );
}