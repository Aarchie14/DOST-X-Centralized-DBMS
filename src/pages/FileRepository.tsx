import { Navbar } from "../components/layout/Navbar";
import { Sidebar } from "../components/layout/Sidebar";
import { TableToolbar } from "../components/common/TableToolbar";
import { FileUploadZone } from "../components/common/FileUploadZone";
import { FileTable } from "../components/common/FileTable";
import { Toast, type ToastNotification } from "../components/common/Toast";
import { DeleteConfirmModal } from "../components/common/DeleteConfirmModal";
import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { scopeToUnit, getUnitLock, resolveInitialDepartment } from "../utils/unitAccess";
import { formatFileSize } from "../utils/fileUtils";

export default function FileRepository({
}) {
  // 1. AuthContext Hook to access user role, logging, and authentication functions
  const { user, addLog } = useContext(AuthContext)!;
  const lockedDepartment = getUnitLock(user) ?? undefined;

  // STATE HOOKS
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState(() =>
    resolveInitialDepartment(user, "All department"),
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [notification, setNotification] = useState<ToastNotification | null>(
    null,
  );

  // State for the delete modal
  const [fileToDelete, setFileToDelete] = useState<{
    id: number;
    name: string;
  } | null>(null);

  const [files, setFiles] = useState([
    {
      id: 1,
      fileName: "SETUP Food Processing Facility Upgrade.csv",
      fileSize: "124.5 KB",
      department: "MIS",
      sectorCategory: "SETUP (MSMEs)",
      lastAccessed: "07-07-2026",
    },
    {
      id: 2,
      fileName: "S&T_Scholarship(2025-2026).xlsx",
      fileSize: "1.2 MB",
      department: "SCC",
      sectorCategory: "Scholarship",
      lastAccessed: "07-07-2026",
    },
  ]);

  const ITEMS_PER_PAGE = 10;

  // --- TOAST UTILITIES ---
  /** Triggers a transient notification message */
  const triggerToast = (
    message: string,
    type: "success" | "error" | "info" = "info",
  ) => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  // 2. DERIVED DATA
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

  const indexOfLastFile = currentPage * ITEMS_PER_PAGE;
  const indexOfFirstFile = indexOfLastFile - ITEMS_PER_PAGE;
  const currentFiles = filteredFiles.slice(indexOfFirstFile, indexOfLastFile);

  // --- HANDLERS ---
  /** Adds a new file to the state and resets view */
  const handleFileUpload = (file: File, department: string) => {
    const newFile = {
      id: Date.now(),
      fileName: file.name,
      fileSize: formatFileSize(file.size),
      department: department,
      sectorCategory: "Uploaded",
      lastAccessed: new Date().toLocaleDateString("en-GB").replace(/\//g, "-"),
    };
    setFiles((prevFiles) => [newFile, ...prevFiles]);
    triggerToast(`"${file.name}" uploaded to ${department}`, "success");
    addLog("File Uploaded", `Uploaded file: "${file.name}" to ${department} department`);
    setCurrentPage(1);
  };

  // Trigger the modal instead of deleting
  const initiateDelete = (id: number, name: string) => {
    setFileToDelete({ id, name });
  };

  // Actual deletion logic
  const confirmDelete = () => {
    if (fileToDelete) {
      setFiles((prevFiles) =>
        prevFiles.filter((file) => file.id !== fileToDelete.id),
      );
      triggerToast("File deleted successfully", "error");
      addLog("File Deleted", `Deleted file: "${fileToDelete.name}"`);
      setFileToDelete(null);
    }
  };

  const handleSearchChange = (val: string) => {
    setSearchQuery(val);
    setCurrentPage(1);
  };

  const handleDeptChange = (val: string) => {
    setSelectedDepartment(val);
    setCurrentPage(1);
  };

  /** Programmatically triggers a browser file download */
  const handleDownload = (fileName: string) => {
    const link = document.createElement("a");
    link.href = `/files/${fileName}`;
    link.setAttribute("download", fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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

          {/* SECTION: File Listing Table */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col h-[630px] overflow-hidden">
            <div className="flex-1 overflow-hidden">
              <FileTable
                userRole={user?.role}
                files={currentFiles}
                onDelete={initiateDelete}
                onDownload={handleDownload}
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
