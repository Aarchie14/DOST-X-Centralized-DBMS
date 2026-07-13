import { useState, useContext } from "react";
import { INITIAL_RECORDS } from "../config/mockData";
import type { ProjectRecord } from "../config/constants";
import { AuthContext } from "../context/AuthContext";

const ITEMS_PER_PAGE = 10;

/**
 * useProjectRecords Hook
 * Manages project data state, filtering, CRUD operations, 
 * pagination, and report export functionality.
 */
export function useProjectDatabase() {

  // --- UI STATE ---
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedDepartment, setSelectedDepartment] = useState<string>("All department");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);

// --- DATA STATE ---
  const [editingId, setEditingId] = useState<number | null>(null);
  const [deletingProject, setDeletingProject] = useState<ProjectRecord | null>(null);
  const [newProject, setNewProject] = useState({
    name: "",
    department: "" as any,
    sectorCategory: "" as any,
    budget: "",
    status: "" as any,
  });
  const [records, setRecords] = useState<ProjectRecord[]>(INITIAL_RECORDS);
  const { addLog } = useContext(AuthContext)!;
  
// --- NOTIFICATION STATE ---
  const [notification, setNotification] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null);

// --- SELECTION STATE ---
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());

  /** Toggles selection for a single record ID */
  const toggleSelection = (id: number) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  /** Selects or deselects all currently visible (paginated) record IDs */
  const toggleSelectAll = (pageRecordIds: number[]) => {
    setSelectedIds((prev) => {
      const allSelected = pageRecordIds.every((id) => prev.has(id));
      const next = new Set(prev);
      if (allSelected) {
        pageRecordIds.forEach((id) => next.delete(id));
      } else {
        pageRecordIds.forEach((id) => next.add(id));
      }
      return next;
    });
  };

  /** Clears the entire selection */
  const clearSelection = () => setSelectedIds(new Set());

/** Triggers a self-dismissing toast notification */
  const showToast = (message: string, type: "success" | "error" | "info" = "success") => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 3000); 
  };

  // --- MODAL HANDLERS ---
const openModalImmediately = () => {
  setIsModalOpen(true);
};
  const handleOpenCreateModal = () => {
    setEditingId(null);
    setNewProject({ name: "", department: "" as any, sectorCategory: "" as any, budget: "", status: "" as any });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (project: ProjectRecord) => {
    setEditingId(project.id);
    setNewProject({
      name: project.name,
      department: project.department as any,
      sectorCategory: project.sectorCategory,
      budget: project.budget.toString(),
      status: project.status,
    });
    setIsModalOpen(true);
  };

  const handleOpenDeleteModal = (project: ProjectRecord) => {
    setDeletingProject(project);
    setIsDeleteModalOpen(true);
  };

  // --- CRUD OPERATIONS ---
  const handleConfirmDelete = () => {
    if (deletingProject) {
      setRecords(records.filter((r) => r.id !== deletingProject.id));
      // TRIGGER NOTIFICATION
      showToast(`Successfully deleted "${deletingProject.name}"`, "error");
      addLog("Project Record Deleted", `Deleted project: "${deletingProject.name}" (ID #${deletingProject.id})`);
      setIsDeleteModalOpen(false);
      setDeletingProject(null);
      setCurrentPage(1);
    }
  };

  const handleSaveRecord = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProject.name.trim() || !newProject.budget) return;
// Handle Edit
    if (editingId !== null) {
      setRecords(records.map((rec) => rec.id === editingId ? {
        ...rec,
        name: newProject.name,
        department: newProject.department as any,
        sectorCategory: newProject.sectorCategory as any,
        budget: Number(newProject.budget),
        status: newProject.status as any,
        lastAccessed: "07-08-2026",
      } : rec));

      // TRIGGER NOTIFICATION
      showToast(`Updated entry for "${newProject.name}"`, "info");
      addLog("Project Record Updated", `Updated details for project: "${newProject.name}" (ID #${editingId})`);
// Handle Creation
    } else {
      const newRecordEntry: ProjectRecord = {
        id: records.length > 0 ? Math.max(...records.map((r) => r.id)) + 1 : 1,
        name: newProject.name,
        department: newProject.department as any,
        sectorCategory: newProject.sectorCategory as any,
        budget: Number(newProject.budget),
        status: newProject.status as any,
        lastAccessed: "07-08-2026",
      };
      const updatedRecords = [...records, newRecordEntry];
      setRecords(updatedRecords);

      // TRIGGER NOTIFICATION
      showToast(`Created new project "${newProject.name}"`, "success");
      addLog("Project Record Created", `Created new project: "${newProject.name}" (ID #${newRecordEntry.id})`);

      // Navigate to last page after adding
      const totalFilteredCount = updatedRecords.filter((rec) => {
        const matchesDept = selectedDepartment === "All department" || rec.department === selectedDepartment;
        const matchesSearch = rec.name.toLowerCase().includes(searchQuery.toLowerCase()) || rec.sectorCategory.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesDept && matchesSearch;
      }).length;

      setCurrentPage(Math.ceil(totalFilteredCount / ITEMS_PER_PAGE) || 1);
    }
    setIsModalOpen(false);
  };

// --- EXPORT LOGIC ---
  /** Resolves which records to export: selected subset or all records */
  const getExportRecords = () => {
    if (selectedIds.size > 0) {
      return records.filter((rec) => selectedIds.has(rec.id));
    }
    return records;
  };

  /** Converts the export record list into a CSV-formatted string */
  const generateCSVData = () => {
    const exportRecords = getExportRecords();
    const headers = ["Project ID", "Project Name", "Department", "Sector Category", "Budget (PHP)", "Status", "Last Accessed"];
    const rows = exportRecords.map((rec) => [
      rec.id,
      `"${rec.name.replace(/"/g, '""')}"`,
      `"${rec.department}"`,
      `"${rec.sectorCategory}"`,
      rec.budget,
      `"${rec.status}"`,
      `"${rec.lastAccessed}"`
    ]);
    return [headers.join(","), ...rows.map((row) => row.join(","))].join("\n");
  };

/** Exports data as a CSV file */
  const handleExportCSV = () => {
    const exportRecords = getExportRecords();
    if (exportRecords.length === 0) return showToast("No data to export", "info");
    const csvContent = generateCSVData();
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const label = selectedIds.size > 0 ? `Selected_${selectedIds.size}` : "Standard";
    triggerDownload(blob, `${label}_Report.csv`);
  };

/** Exports data as an Excel-compatible XLS file */
 const handleExportExcel = () => {
    const exportRecords = getExportRecords();
    if (exportRecords.length === 0) return showToast("No data to export", "info");

    let tableHtml = `
      <meta charset="utf-8">
      <table border="1">
        <tr style="background-color: #00aeef; color: white; font-weight: bold;">
          <th>Project ID</th>
          <th>Project Name</th>
          <th>Department</th>
          <th>Sector Category</th>
          <th>Budget (PHP)</th>
          <th>Status</th>
          <th>Last Accessed</th>
        </tr>
    `;

    exportRecords.forEach((rec) => {
      tableHtml += `
        <tr>
          <td>${rec.id}</td>
          <td>${rec.name}</td>
          <td>${rec.department}</td>
          <td>${rec.sectorCategory}</td>
          <td>${rec.budget}</td>
          <td>${rec.status}</td>
          <td>${rec.lastAccessed}</td>
        </tr>
      `;
    });

    tableHtml += `</table>`;

    const blob = new Blob([tableHtml], { type: "application/vnd.ms-excel;charset=utf-8;" });
    const label = selectedIds.size > 0 ? `Selected_${selectedIds.size}` : "Full";
    triggerDownload(blob, `${label}_Report.xls`);
  };

/** Browser utility to force download a blob file */
  const triggerDownload = (blob: Blob, suffix: string) => {
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `Project_Records_${new Date().toISOString().split('T')[0]}_${suffix}`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast("Report exported successfully!", "success");
  };

  // --- DERIVED DATA ---
  const sortedAndFilteredRecords = records
    .filter((rec) => {
      const matchesDept = selectedDepartment === "All department" || rec.department === selectedDepartment;
      const matchesSearch = rec.name.toLowerCase().includes(searchQuery.toLowerCase()) || rec.sectorCategory.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesDept && matchesSearch;
    })
    .sort((a, b) => a.id - b.id);
  const paginatedRecords = sortedAndFilteredRecords.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  return {
    searchQuery, setSearchQuery,
    selectedDepartment, setSelectedDepartment,
    currentPage, setCurrentPage,
    isModalOpen, setIsModalOpen,
    isDeleteModalOpen, setIsDeleteModalOpen,
    editingId, deletingProject, newProject, setNewProject,
    totalRecordsCount: sortedAndFilteredRecords.length,
    paginatedRecords,
    ITEMS_PER_PAGE,
    handleOpenCreateModal, handleOpenEditModal, handleOpenDeleteModal, handleConfirmDelete, handleSaveRecord,
    handleExportCSV,   
    handleExportExcel, 
    notification, 
    openModalImmediately,
    selectedIds,
    toggleSelection,
    toggleSelectAll,
    clearSelection,
  };
}