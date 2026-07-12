import { Navbar } from "../components/layout/Navbar";
import { Sidebar } from "../components/layout/Sidebar";
import { TableToolbar } from "../components/common/TableToolbar";
import { ProjectTable } from "../components/common/ProjectTable";
import { ProjectFormModal } from "../components/common/ProjectFormModal";
import { DeleteConfirmModal } from "../components/common/DeleteConfirmModal";
import { useProjectRecords } from "../hooks/useProjectRecords";
import { Toast } from "../components/common/Toast";
import { useEffect } from "react";
import { useContext } from "react"; 
import { AuthContext } from "../context/AuthContext"; 

export default function ProjectRecords({
  onViewChange,
  currentView,
  openModalOnLoad,
}: {
  onViewChange: (view: string) => void;
  currentView: string;
  openModalOnLoad?: boolean; 
}) {

/**
 * ProjectRecords Component
 * Central hub for viewing, searching, and managing project data.
 * Utilizes the custom useProjectRecords hook for data logic and state orchestration.
 */
  const { user } = useContext(AuthContext)!;

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
  } = useProjectRecords();

  /** 
   * Side-effect to handle triggered modal states (e.g., direct navigation 
   * to this page with an 'open' intent from the dashboard)
   */
  useEffect(() => {
    if (openModalOnLoad && !isModalOpen) {
      handleOpenCreateModal();
    }
  }, [openModalOnLoad, isModalOpen, handleOpenCreateModal]);

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
      <Navbar
        pageTitle="Project Records"
        subTitle="Records"
        onViewChange={onViewChange}
      />
      <Sidebar activeView={currentView} onViewChange={onViewChange} />

      <div className="sm:pl-64 transition-all duration-200">
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-4">

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
            />
          </div>
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
