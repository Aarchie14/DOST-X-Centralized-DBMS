/**
 * useProjectDatabase.ts
 *
 * Manages project-level dataset state, filtering, pagination, CRUD, and CSV/Excel
 * export functionality.
 *
 * v2 – Backend Integration
 * ─────────────────────────
 * All CRUD operations (create / update / delete) now call the backend REST API
 * via src/utils/api.ts. Data is fetched from GET /datasets on mount. The local
 * records state is kept in sync with backend responses so the UI remains
 * responsive without a full page reload.
 *
 * Filtering (department / search) is still performed client-side after the full
 * dataset list is fetched, matching the existing UX behaviour.
 */

import { useState, useContext, useEffect, useCallback } from "react";
import type { ProjectRecord } from "../config/constants";
import { AuthContext } from "../context/AuthContext";
import { scopeToUnit, resolveInitialDepartment } from "../utils/unitAccess";
import { api, type ApiDataset } from "../utils/api";

const ITEMS_PER_PAGE = 10;

// ---------------------------------------------------------------------------
// Helper: map API dataset shape → frontend ProjectRecord shape
// ---------------------------------------------------------------------------
function mapDatasetToRecord(d: ApiDataset): ProjectRecord {
  return {
    id:             d.id,
    name:           d.name,
    department:     (d.department ?? "MIS") as ProjectRecord["department"],
    sectorCategory: (d.sector_category ?? "") as ProjectRecord["sectorCategory"],
    budget:         d.budget ?? 0,
    status:         (d.status ?? "On going") as ProjectRecord["status"],
    lastAccessed:   d.last_accessed
      ? new Date(d.last_accessed).toLocaleDateString("en-GB").replace(/\//g, "-")
      : new Date().toLocaleDateString("en-GB").replace(/\//g, "-"),
  };
}

/**
 * useProjectDatabase Hook
 * Manages project data state, filtering, CRUD operations,
 * pagination, and report export functionality.
 */
export function useProjectDatabase() {
  const { addLog, user } = useContext(AuthContext)!;

  // --- UI STATE ---
  const [searchQuery, setSearchQuery]               = useState<string>("");
  const [selectedDepartment, setSelectedDepartment] = useState<string>(() =>
    resolveInitialDepartment(user, "All department"),
  );
  const [currentPage, setCurrentPage]   = useState<number>(1);
  const [isModalOpen, setIsModalOpen]   = useState<boolean>(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading]       = useState<boolean>(false);

  // --- DATA STATE ---
  const [editingId, setEditingId]               = useState<number | null>(null);
  const [deletingProject, setDeletingProject]   = useState<ProjectRecord | null>(null);
  const [newProject, setNewProject]             = useState({
    name:           "",
    department:     "" as any,
    sectorCategory: "" as any,
    budget:         "",
    status:         "" as any,
  });
  const [records, setRecords] = useState<ProjectRecord[]>([]);

  /** Records the current user is allowed to see (unit-scoped for non-admins). */
  const visibleRecords = scopeToUnit(records, user);

  // --- NOTIFICATION STATE ---
  const [notification, setNotification] = useState<{
    message: string;
    type: "success" | "error" | "info";
  } | null>(null);

  // --- SELECTION STATE ---
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());

  // ---------------------------------------------------------------------------
  // Fetch datasets from backend on mount
  // ---------------------------------------------------------------------------
  const fetchRecords = useCallback(async () => {
    try {
      setIsLoading(true);
      const { datasets } = await api.getDatasets();
      setRecords(datasets.map(mapDatasetToRecord));
    } catch (err) {
      console.error("Failed to fetch datasets:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRecords();
  }, [fetchRecords]);

  // ---------------------------------------------------------------------------
  // UI helpers
  // ---------------------------------------------------------------------------

  /** Toggles selection for a single record ID */
  const toggleSelection = (id: number) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) { next.delete(id); } else { next.add(id); }
      return next;
    });
  };

  /** Selects or deselects all currently visible (paginated) record IDs */
  const toggleSelectAll = (pageRecordIds: number[]) => {
    setSelectedIds((prev) => {
      const allSelected = pageRecordIds.every((id) => prev.has(id));
      const next = new Set(prev);
      if (allSelected) { pageRecordIds.forEach((id) => next.delete(id)); }
      else             { pageRecordIds.forEach((id) => next.add(id)); }
      return next;
    });
  };

  /** Clears the entire selection */
  const clearSelection = () => setSelectedIds(new Set());

  /** Triggers a self-dismissing toast notification */
  const showToast = (
    message: string,
    type: "success" | "error" | "info" = "success",
  ) => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  // ---------------------------------------------------------------------------
  // Modal handlers
  // ---------------------------------------------------------------------------
  const openModalImmediately = () => setIsModalOpen(true);

  const handleOpenCreateModal = () => {
    setEditingId(null);
    setNewProject({
      name: "", department: "" as any, sectorCategory: "" as any,
      budget: "", status: "" as any,
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (project: ProjectRecord) => {
    setEditingId(project.id);
    setNewProject({
      name:           project.name,
      department:     project.department as any,
      sectorCategory: project.sectorCategory,
      budget:         project.budget.toString(),
      status:         project.status,
    });
    setIsModalOpen(true);
  };

  const handleOpenDeleteModal = (project: ProjectRecord) => {
    setDeletingProject(project);
    setIsDeleteModalOpen(true);
  };

  // ---------------------------------------------------------------------------
  // CRUD Operations (backend-connected)
  // ---------------------------------------------------------------------------

  /** Deletes the project via backend API then removes from local state. */
  const handleConfirmDelete = async () => {
    if (!deletingProject) return;
    try {
      await api.deleteDataset(deletingProject.id);
      setRecords((prev) => prev.filter((r) => r.id !== deletingProject.id));
      showToast(`Successfully deleted "${deletingProject.name}"`, "error");
      addLog(
        "Project Record Deleted",
        `Deleted project: "${deletingProject.name}" (ID #${deletingProject.id})`,
      );
    } catch (err: any) {
      showToast(err.message || "Delete failed", "error");
    } finally {
      setIsDeleteModalOpen(false);
      setDeletingProject(null);
      setCurrentPage(1);
    }
  };

  /** Creates or updates a project record via the backend API. */
  const handleSaveRecord = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProject.name.trim() || !newProject.budget) return;

    const payload = {
      name:           newProject.name,
      department:     newProject.department,
      sector_category: newProject.sectorCategory,
      budget:         Number(newProject.budget),
      status:         newProject.status,
    };

    try {
      if (editingId !== null) {
        // --- EDIT ---
        await api.updateDataset(editingId, payload);
        setRecords((prev) =>
          prev.map((rec) =>
            rec.id === editingId
              ? {
                  ...rec,
                  name:           newProject.name,
                  department:     newProject.department as any,
                  sectorCategory: newProject.sectorCategory as any,
                  budget:         Number(newProject.budget),
                  status:         newProject.status as any,
                  lastAccessed:   new Date().toLocaleDateString("en-GB").replace(/\//g, "-"),
                }
              : rec,
          ),
        );
        showToast(`Updated entry for "${newProject.name}"`, "info");
        addLog(
          "Project Record Updated",
          `Updated details for project: "${newProject.name}" (ID #${editingId})`,
        );
      } else {
        // --- CREATE ---
        const { id } = await api.createDataset(payload);
        const newRecordEntry: ProjectRecord = {
          id,
          name:           newProject.name,
          department:     newProject.department as any,
          sectorCategory: newProject.sectorCategory as any,
          budget:         Number(newProject.budget),
          status:         newProject.status as any,
          lastAccessed:   new Date().toLocaleDateString("en-GB").replace(/\//g, "-"),
        };
        setRecords((prev) => [newRecordEntry, ...prev]);
        showToast(`Created new project "${newProject.name}"`, "success");
        addLog(
          "Project Record Created",
          `Created new project: "${newProject.name}" (ID #${id})`,
        );
      }
    } catch (err: any) {
      showToast(err.message || "Save failed", "error");
    }

    setIsModalOpen(false);
  };

  // ---------------------------------------------------------------------------
  // Export Logic (client-side, uses current visible records)
  // ---------------------------------------------------------------------------

  /** Resolves which records to export: selected subset or all visible records */
  const getExportRecords = () =>
    selectedIds.size > 0
      ? visibleRecords.filter((rec) => selectedIds.has(rec.id))
      : visibleRecords;

  /** Converts the export record list into a CSV-formatted string */
  const generateCSVData = () => {
    const exportRecords = getExportRecords();
    const headers = [
      "Project ID", "Project Name", "Department",
      "Sector Category", "Budget (PHP)", "Status", "Last Accessed",
    ];
    const rows = exportRecords.map((rec) => [
      rec.id,
      `"${rec.name.replace(/"/g, '""')}"`,
      `"${rec.department}"`,
      `"${rec.sectorCategory}"`,
      rec.budget,
      `"${rec.status}"`,
      `"${rec.lastAccessed}"`,
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
    addLog("Project Database Export", `Exported ${exportRecords.length} records to CSV (${label} report).`);
  };

  /** Exports data as an Excel-compatible XLS file */
  const handleExportExcel = () => {
    const exportRecords = getExportRecords();
    if (exportRecords.length === 0) return showToast("No data to export", "info");

    let tableHtml = `
      <meta charset="utf-8">
      <table border="1">
        <tr style="background-color: #00aeef; color: white; font-weight: bold;">
          <th>Project ID</th><th>Project Name</th><th>Department</th>
          <th>Sector Category</th><th>Budget (PHP)</th><th>Status</th><th>Last Accessed</th>
        </tr>
    `;
    exportRecords.forEach((rec) => {
      tableHtml += `
        <tr>
          <td>${rec.id}</td><td>${rec.name}</td><td>${rec.department}</td>
          <td>${rec.sectorCategory}</td><td>${rec.budget}</td><td>${rec.status}</td><td>${rec.lastAccessed}</td>
        </tr>
      `;
    });
    tableHtml += `</table>`;

    const blob = new Blob([tableHtml], { type: "application/vnd.ms-excel;charset=utf-8;" });
    const label = selectedIds.size > 0 ? `Selected_${selectedIds.size}` : "Full";
    triggerDownload(blob, `${label}_Report.xls`);
    addLog("Project Database Export", `Exported ${exportRecords.length} records to Excel (${label} report).`);
  };

  /** Browser utility to force download a blob file */
  const triggerDownload = (blob: Blob, suffix: string) => {
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute(
      "download",
      `Project_Records_${new Date().toISOString().split("T")[0]}_${suffix}`,
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast("Report exported successfully!", "success");
  };

  // ---------------------------------------------------------------------------
  // Derived Data
  // ---------------------------------------------------------------------------
  const sortedAndFilteredRecords = visibleRecords
    .filter((rec) => {
      const matchesDept =
        selectedDepartment === "All department" ||
        rec.department === selectedDepartment;
      const matchesSearch =
        rec.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        rec.sectorCategory.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesDept && matchesSearch;
    })
    .sort((a, b) => a.id - b.id);

  const paginatedRecords = sortedAndFilteredRecords.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

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
    isLoading,
    handleOpenCreateModal,
    handleOpenEditModal,
    handleOpenDeleteModal,
    handleConfirmDelete,
    handleSaveRecord,
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