import { useState } from "react";
import { INITIAL_RECORDS } from "../config/mockData";
import { STATUSES } from "../config/constants";
import type { ProjectRecord } from "../config/constants";

const ITEMS_PER_PAGE = 10;

export function useProjectRecords() {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedDepartment, setSelectedDepartment] = useState<string>("All department");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
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
  
const openModalImmediately = () => {
  setIsModalOpen(true);
};

  // State for tracking a single active popup notification
  const [notification, setNotification] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null);

  // Helper to trigger a self-dismissing toast
  const showToast = (message: string, type: "success" | "error" | "info" = "success") => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 3000); // Automatically disappears after 3 seconds
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

  const handleConfirmDelete = () => {
    if (deletingProject) {
      setRecords(records.filter((r) => r.id !== deletingProject.id));
      
      // TRIGGER NOTIFICATION
      showToast(`Successfully deleted "${deletingProject.name}"`, "error");

      setIsDeleteModalOpen(false);
      setDeletingProject(null);
      setCurrentPage(1);
    }
  };

  const handleSaveRecord = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProject.name.trim() || !newProject.budget) return;

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

      const totalFilteredCount = updatedRecords.filter((rec) => {
        const matchesDept = selectedDepartment === "All department" || rec.department === selectedDepartment;
        const matchesSearch = rec.name.toLowerCase().includes(searchQuery.toLowerCase()) || rec.sectorCategory.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesDept && matchesSearch;
      }).length;

      setCurrentPage(Math.ceil(totalFilteredCount / ITEMS_PER_PAGE) || 1);
    }
    setIsModalOpen(false);
  };

  // --- NEW EXPORT LOGIC UTILITIES ---

  // Helper to compile matching records matrix data cleanly into a parsed CSV string template
  const generateCSVData = () => {
    const headers = ["Project ID", "Project Name", "Department", "Sector Category", "Budget (PHP)", "Status", "Last Accessed"];
    const rows = records.map((rec) => [
      rec.id,
      `"${rec.name.replace(/"/g, '""')}"`, // Clean outer quotes for spacing safety
      `"${rec.department}"`,
      `"${rec.sectorCategory}"`,
      rec.budget,
      `"${rec.status}"`,
      `"${rec.lastAccessed}"`
    ]);
    return [headers.join(","), ...rows.map((row) => row.join(","))].join("\n");
  };

  // Option A: Standard Plain Text CSV Data 
  const handleExportCSV = () => {
    if (records.length === 0) return showToast("No data to export", "info");
    const csvContent = generateCSVData();
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    triggerDownload(blob, "Standard_Report.csv");
  };

  // Option B: Excel-Optimized parsing with Byte Order Mark configuration
 const handleExportExcel = () => {
    if (records.length === 0) return showToast("No data to export", "info");

    // 1. Build a clean HTML Table structure as a string
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

    // 2. Append rows dynamically
    records.forEach((rec) => {
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

    // 3. Create a template blob that forces Excel application parsing
    const blob = new Blob([tableHtml], { type: "application/vnd.ms-excel;charset=utf-8;" });
    
    // 4. Trigger download with a clean .xls extension!
    triggerDownload(blob, "Report.xls");
  };

  // Browser anchor DOM executor runner
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
    handleExportCSV,   // Export handler exposed
    handleExportExcel, // Excel handler exposed
    notification, 
    openModalImmediately,
  };
}