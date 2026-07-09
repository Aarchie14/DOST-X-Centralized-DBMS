import { Navbar } from "../components/layout/Navbar";
import { Sidebar } from "../components/layout/Sidebar";
import { TableToolbar } from "../components/common/TableToolbar";
import { ProjectTable } from "../components/common/ProjectTable";
import { ProjectFormModal } from "../components/common/ProjectFormModal";
import { DeleteConfirmModal } from "../components/common/DeleteConfirmModal";
import { useProjectRecords } from "../hooks/useProjectRecords";
import { Toast } from "../components/common/Toast";
import { useEffect } from "react";

export default function ProjectRecords({
  onViewChange,
  currentView,
  openModalOnLoad, // Add this here
}: {
  onViewChange: (view: string) => void;
  currentView: string;
  openModalOnLoad?: boolean; // Add this definition (the '?' means it's optional)
}) {
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

  // Inside ProjectRecords.tsx
  useEffect(() => {
    if (openModalOnLoad) {
      const timer = setTimeout(() => {
        handleOpenCreateModal();
        console.log("Modal opened via delayed trigger");
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [openModalOnLoad, handleOpenCreateModal]);

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
          <TableToolbar
            searchQuery={searchQuery}
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
            onNewRecordClick={handleOpenCreateModal}
            onExportCSV={handleExportCSV}
            onExportExcel={handleExportExcel}
          />

          {/* Table goes back to a clean full-width footprint */}
          <div className="w-full">
            <ProjectTable
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
