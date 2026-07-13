import { Navbar } from "../components/layout/Navbar";
import { Sidebar } from "../components/layout/Sidebar";
import { TableToolbar } from "../components/common/TableToolbar";
import { ProjectTable } from "../components/common/ProjectTable";
import { ProjectFormModal } from "../components/common/ProjectFormModal";
import { DeleteConfirmModal } from "../components/common/DeleteConfirmModal";
import { DatabaseView } from "../components/common/DatabaseView";
import { useProjectDatabase } from "../hooks/useProjectDatabase";
import { Toast } from "../components/common/Toast";
import { useEffect, useState } from "react";
import { useContext } from "react"; 
import { AuthContext } from "../context/AuthContext";
import type { ProjectRecord } from "../config/constants";
import { useLocation, useNavigate } from "react-router-dom"; // Added useLocation and kept useNavigate

export default function ProjectDatabase() {
  const location = useLocation(); // Hook to intercept the router state
  const navigate = useNavigate();
  const { user } = useContext(AuthContext)!;

  // State to track the currently opened project database
  const [selectedProject, setSelectedProject] = useState<ProjectRecord | null>(null);

  // Custom hook containing business logic, filtering, and CRUD operations
  const {
    searchQuery,
    setSearchQuery,
    selectedDepartment,
    setSelectedDepartment,
    currentPage,
    setCurrentPage,
    isModalOpen,
    setIsModalOpen,
    isDeleteModalOpen,
    setIsDeleteModalOpen,
    editingId,
    deletingProject,
    newProject,
    setNewProject,
    totalRecordsCount,
    paginatedRecords,
    ITEMS_PER_PAGE,
    handleOpenCreateModal,
    handleOpenEditModal,
    handleOpenDeleteModal,
    handleConfirmDelete,
    handleSaveRecord,
    handleExportCSV,
    handleExportExcel,
    notification,
    selectedIds,
    toggleSelection,
    toggleSelectAll,
    clearSelection,
  } = useProjectDatabase();

  /** 
   * Side-effect to handle triggered modal states from route history
   * (e.g., when the Admin clicks "New Database Entry" from the main dashboard)
   */
  useEffect(() => {
    if (location.state?.openModal && !isModalOpen) {
      handleOpenCreateModal();

      // CLEANUP: Immediately clear router state history.
      // This ensures that page refreshes or clicking 'back' later won't trigger the modal again.
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.state, isModalOpen, handleOpenCreateModal, navigate, location.pathname]);

  /** Formats raw numbers into Philippine Peso currency strings */
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-PH", {
      style: "currency",
      currency: "PHP",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 select-none antialiased">
      <Navbar/>
      <Sidebar/>

      <div className="sm:pl-64 transition-all duration-200">
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-4">

          {/* Conditional: Show DatabaseView or Table */}
          {selectedProject ? (
            <DatabaseView
              project={selectedProject}
              userRole={user?.role}
              onBack={() => setSelectedProject(null)}
            />
          ) : (
            <>
              {/* SECTION: Toolbar for Search, Department Filter, and Data Exports */}
              <TableToolbar
                searchQuery={searchQuery}
                userRole={user?.role} 
                onSearchChange={(val) => {
                  setSearchQuery(val);
                  setCurrentPage(1);
                }}
                selectedDepartment={selectedDepartment}
                onDepartmentChange={(val) => {
                  setSelectedDepartment(val);
                  setCurrentPage(1);
                }}
                onNewRecordClick={handleOpenCreateModal}
                onExportCSV={handleExportCSV}
                onExportExcel={handleExportExcel}
              />

              {/* Selection indicator */}
              {selectedIds.size > 0 && (
                <div className="flex items-center gap-2 px-4 py-2 bg-cyan-50 border border-cyan-200 rounded-xl">
                  <span className="text-xs font-bold text-cyan-700">
                    {selectedIds.size} {selectedIds.size === 1 ? "record" : "records"} selected
                  </span>
                  <button
                    onClick={clearSelection}
                    className="text-[11px] font-bold text-cyan-500 hover:text-cyan-700 underline underline-offset-2 cursor-pointer transition-colors"
                  >
                    Clear
                  </button>
                </div>
              )}

              {/* SECTION: Main Data Table */}
              <div className="w-full">
                <ProjectTable
                  userRole={user?.role}
                  filteredRecords={paginatedRecords}
                  totalCount={totalRecordsCount}
                  itemsPerPage={ITEMS_PER_PAGE}
                  currentPage={currentPage}
                  onPageChange={setCurrentPage}
                  formatCurrency={formatCurrency}
                  onOpenEditModal={handleOpenEditModal}
                  onDeleteRecord={handleOpenDeleteModal}
                  onProjectClick={(project) => setSelectedProject(project)}
                  selectedIds={selectedIds}
                  onToggleSelection={toggleSelection}
                  onToggleSelectAll={toggleSelectAll}
                />
              </div>
            </>
          )}
        </main>
      </div>

      {/* MODALS & OVERLAYS */}
      {isModalOpen && (
        <ProjectFormModal
          editingId={editingId}
          newProject={newProject}
          setNewProject={setNewProject}
          onSubmit={handleSaveRecord}
          onClose={() => setIsModalOpen(false)}
        />
      )}

      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        projectName={deletingProject?.name || ""}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
      />

      {/* Renders the toast banner dynamically if active */}
      {notification && <Toast notification={notification} />}
    </div>
  );
}