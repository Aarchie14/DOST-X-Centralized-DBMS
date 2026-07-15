/**
 * FileRepository.tsx
 *
 * Departmental file repository page.
 *
 * v2 – Backend Integration
 * ─────────────────────────
 * Files are fetched from GET /files on mount.
 * Uploads POST to /files as multipart/form-data (with department + sector_category).
 * Downloads stream via GET /files/:id/download through the backend.
 * Deletions call DELETE /files/:id.
 *
 * Department and sector_category metadata from the backend replace the
 * previous hard-coded sectorCategory field ("Uploaded").
 */

import { Navbar }            from "../components/layout/Navbar";
import { Sidebar }           from "../components/layout/Sidebar";
import { TableToolbar }      from "../components/common/TableToolbar";
import { FileUploadZone }    from "../components/common/FileUploadZone";
import { FileTable }         from "../components/common/FileTable";
import { Toast, type ToastNotification } from "../components/common/Toast";
import { DeleteConfirmModal} from "../components/common/DeleteConfirmModal";
import { useState, useContext, useEffect, useCallback } from "react";
import { AuthContext }       from "../context/AuthContext";
import {
  scopeToUnit,
  getUnitLock,
  resolveInitialDepartment,
} from "../utils/unitAccess";
import { formatFileSize }    from "../utils/fileUtils";
import { api, type ApiFile } from "../utils/api";

// ---------------------------------------------------------------------------
// Helper: map backend ApiFile → local display shape
// ---------------------------------------------------------------------------
interface FileRecord {
  id:             number;
  fileName:       string;
  fileSize:       string;
  department:     string;
  sectorCategory: string;
  lastAccessed:   string;
}

function mapApiFile(f: ApiFile): FileRecord {
  return {
    id:             f.id,
    fileName:       f.original_name,
    fileSize:       formatFileSize(f.file_size),
    department:     f.department ?? "MIS",
    sectorCategory: f.sector_category ?? "Uploaded",
    lastAccessed:   new Date(f.uploaded_at)
      .toLocaleDateString("en-GB")
      .replace(/\//g, "-"),
  };
}

export default function FileRepository() {
  // AuthContext
  const { user, addLog } = useContext(AuthContext)!;
  const lockedDepartment  = getUnitLock(user) ?? undefined;

  // STATE HOOKS
  const [searchQuery,         setSearchQuery]         = useState("");
  const [selectedDepartment,  setSelectedDepartment]  = useState(() =>
    resolveInitialDepartment(user, "All department"),
  );
  const [currentPage,   setCurrentPage]   = useState(1);
  const [notification,  setNotification]  = useState<ToastNotification | null>(null);
  const [fileToDelete,  setFileToDelete]  = useState<{ id: number; name: string } | null>(null);
  const [files,         setFiles]         = useState<FileRecord[]>([]);
  const [isLoading,     setIsLoading]     = useState(false);

  const ITEMS_PER_PAGE = 10;

  // --- TOAST UTILITIES ---
  const triggerToast = (
    message: string,
    type: "success" | "error" | "info" = "info",
  ) => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  // ---------------------------------------------------------------------------
  // Fetch files from backend on mount / after search changes
  // ---------------------------------------------------------------------------
  const fetchFiles = useCallback(async (search?: string) => {
    try {
      setIsLoading(true);
      const { files: apiFiles } = await api.getFiles(search);
      setFiles(apiFiles.map(mapApiFile));
    } catch (err) {
      console.error("Failed to load files:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFiles();
  }, [fetchFiles]);

  // ---------------------------------------------------------------------------
  // Derived Data
  // ---------------------------------------------------------------------------
  const visibleFiles = scopeToUnit(files, user);

  const filteredFiles = visibleFiles.filter((file) => {
    const matchesSearch = file.fileName
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesDept =
      selectedDepartment === "All department" ||
      file.department === selectedDepartment;
    return matchesSearch && matchesDept;
  });

  const indexOfLastFile  = currentPage * ITEMS_PER_PAGE;
  const indexOfFirstFile = indexOfLastFile - ITEMS_PER_PAGE;
  const currentFiles     = filteredFiles.slice(indexOfFirstFile, indexOfLastFile);

  // ---------------------------------------------------------------------------
  // HANDLERS
  // ---------------------------------------------------------------------------

  /**
   * Uploads a file to the backend (multipart/form-data) with department metadata.
   * On success, prepends the new file to local state so the UI updates instantly.
   */
  const handleFileUpload = async (file: File, department: string) => {
    try {
      const result = await api.uploadFile(file, { department, sector_category: "Uploaded" });
      const newFile: FileRecord = {
        id:             result.id,
        fileName:       file.name,
        fileSize:       formatFileSize(file.size),
        department,
        sectorCategory: "Uploaded",
        lastAccessed:   new Date().toLocaleDateString("en-GB").replace(/\//g, "-"),
      };
      setFiles((prev) => [newFile, ...prev]);
      triggerToast(`"${file.name}" uploaded to ${department}`, "success");
      addLog("File Uploaded", `Uploaded file: "${file.name}" to ${department} department`);
      setCurrentPage(1);
    } catch (err: any) {
      triggerToast(err.message || "Upload failed", "error");
    }
  };

  /** Opens delete confirmation modal */
  const initiateDelete = (id: number, name: string) =>
    setFileToDelete({ id, name });

  /** Deletes file via backend API then removes from local state */
  const confirmDelete = async () => {
    if (!fileToDelete) return;
    try {
      await api.deleteFile(fileToDelete.id);
      setFiles((prev) => prev.filter((f) => f.id !== fileToDelete.id));
      triggerToast("File deleted successfully", "error");
      addLog("File Deleted", `Deleted file: "${fileToDelete.name}"`);
    } catch (err: any) {
      triggerToast(err.message || "Delete failed", "error");
    }
    setFileToDelete(null);
  };

  const handleSearchChange = (val: string) => {
    setSearchQuery(val);
    setCurrentPage(1);
  };

  const handleDeptChange = (val: string) => {
    setSelectedDepartment(val);
    setCurrentPage(1);
  };

  /**
   * Downloads a file from the backend server via GET /files/:id/download.
   * The backend streams the stored file; the browser prompts a save dialog.
   */
  const handleDownload = async (fileName: string, fileId?: number) => {
    if (fileId == null) {
      triggerToast("Cannot determine file ID for download", "error");
      return;
    }
    try {
      await api.downloadFile(fileId, fileName);
      addLog("File Downloaded", `Downloaded file: "${fileName}"`);
    } catch (err: any) {
      triggerToast(err.message || "Download failed", "error");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 select-none antialiased">
      <Navbar/>
      <Sidebar/>

      <div className="sm:pl-64 transition-all duration-200">
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* SECTION: File Upload Interface */}
          <div className="mb-8">
            <h2 className="text-sm font-bold text-slate-700 mb-4">
              Uploaded Files
            </h2>
            <FileUploadZone
              userRole={user?.role}
              onFileSelect={handleFileUpload}
              onShowWarning={(msg) => triggerToast(msg, "error")}
            />
          </div>

          {/* SECTION: Filtering & Table Controls */}
          <TableToolbar
            searchQuery={searchQuery}
            onSearchChange={handleSearchChange}
            selectedDepartment={selectedDepartment}
            onDepartmentChange={handleDeptChange}
            lockedDepartment={lockedDepartment}
          />

          {/* Loading indicator */}
          {isLoading && (
            <p className="text-xs text-slate-400 text-center py-4">
              Loading files…
            </p>
          )}

          {/* SECTION: File Listing Table */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col h-[630px] overflow-hidden">
            <div className="flex-1 overflow-hidden">
              <FileTable
                userRole={user?.role}
                files={currentFiles}
                onDelete={initiateDelete}
                onDownload={(fileName, fileId) => handleDownload(fileName, fileId)}
              />
            </div>
          </div>
        </main>
      </div>

      {/* MODALS & OVERLAYS */}
      {fileToDelete && (
        <DeleteConfirmModal
          isOpen={!!fileToDelete}
          onClose={() => setFileToDelete(null)}
          onConfirm={confirmDelete}
          projectName={fileToDelete.name}
        />
      )}

      {/* Toast Overlay */}
      {notification && <Toast notification={notification} />}
    </div>
  );
}
