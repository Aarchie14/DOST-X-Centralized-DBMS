/**
 * useDatabaseView.ts
 *
 * Manages CRUD state and operations for the database detail view
 * of a specific project dataset (its rows / beneficiary records).
 *
 * v2 – Backend Integration
 * ─────────────────────────
 * Records are loaded from GET /datasets/:projectId/records on mount.
 * Add / edit / delete operations now call the corresponding backend
 * REST endpoints and update local state optimistically for responsiveness.
 *
 * The `data` column in the backend is a flexible JSON blob so every
 * DatabaseEntry field (beneficiaryName, location, contactNumber, etc.)
 * is stored directly inside it without any schema changes.
 */

import { useState, useContext, useEffect, useCallback } from "react";
import type { DatabaseEntry } from "../config/databaseEntries";
import { AuthContext } from "../context/AuthContext";
import { api, type ApiRecord } from "../utils/api";

// ---------------------------------------------------------------------------
// Helper: map backend ApiRecord → frontend DatabaseEntry
// ---------------------------------------------------------------------------
function mapRecordToEntry(r: ApiRecord): DatabaseEntry {
  const d = r.data as Record<string, any>;
  return {
    entryId:         r.id as unknown as number,
    beneficiaryName: d.beneficiaryName ?? d.beneficiary_name ?? "",
    location:        d.location  ?? "",
    contactNumber:   d.contactNumber ?? d.contact_number ?? "",
    dateRegistered:  d.dateRegistered ?? d.date_registered ?? "",
    amountGranted:   Number(d.amountGranted ?? d.amount_granted ?? 0),
    remarks:         d.remarks ?? "",
  };
}

/**
 * useDatabaseView Hook
 * Manages CRUD state and operations for the database detail view
 * of a specific project record.
 */
export function useDatabaseView(projectId: number) {
  // --- DATA STATE ---
  const [entries, setEntries] = useState<DatabaseEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { addLog } = useContext(AuthContext)!;

  // --- EDITING STATE ---
  const [editingEntryId, setEditingEntryId] = useState<number | null>(null);
  const [editFormValues, setEditFormValues] = useState<Partial<DatabaseEntry>>({});

  // --- ADD ROW STATE ---
  const [isAddingRow, setIsAddingRow] = useState(false);
  const [newRowValues, setNewRowValues] = useState<Omit<DatabaseEntry, "entryId">>({
    beneficiaryName: "",
    location:        "",
    contactNumber:   "",
    dateRegistered:  new Date().toISOString().split("T")[0],
    amountGranted:   0,
    remarks:         "",
  });

  // --- DELETE STATE ---
  const [deletingEntry, setDeletingEntry] = useState<DatabaseEntry | null>(null);

  // --- NOTIFICATION STATE ---
  const [notification, setNotification] = useState<{
    message: string;
    type: "success" | "error" | "info";
  } | null>(null);

  /** Triggers a self-dismissing toast notification */
  const showToast = (
    message: string,
    type: "success" | "error" | "info" = "success",
  ) => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  // ---------------------------------------------------------------------------
  // Fetch records from backend on mount / projectId change
  // ---------------------------------------------------------------------------
  const fetchEntries = useCallback(async () => {
    if (!projectId) return;
    try {
      setIsLoading(true);
      const { records } = await api.getRecords(projectId, { limit: 200 });
      setEntries(records.map(mapRecordToEntry));
    } catch (err) {
      console.error("Failed to load records:", err);
    } finally {
      setIsLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    fetchEntries();
  }, [fetchEntries]);

  // ---------------------------------------------------------------------------
  // EDIT OPERATIONS
  // ---------------------------------------------------------------------------

  /** Begins inline editing for a specific row */
  const startEditing = (entry: DatabaseEntry) => {
    setEditingEntryId(entry.entryId);
    setEditFormValues({ ...entry });
  };

  /** Cancels the current inline edit without saving */
  const cancelEditing = () => {
    setEditingEntryId(null);
    setEditFormValues({});
  };

  /** Saves the current inline edit to the backend and updates local state */
  const saveEdit = async () => {
    if (editingEntryId === null) return;

    const updatedData = {
      ...editFormValues,
      amountGranted: Number(editFormValues.amountGranted) || 0,
    };

    try {
      await api.updateRecord(editingEntryId, updatedData);
      setEntries((prev) =>
        prev.map((entry) =>
          entry.entryId === editingEntryId
            ? { ...entry, ...updatedData }
            : entry,
        ),
      );
      showToast(`Entry #${editingEntryId} updated successfully`, "info");
      addLog(
        "Database Entry Updated",
        `Updated entry ID #${editingEntryId} in project database ID #${projectId}`,
      );
    } catch (err: any) {
      showToast(err.message || "Update failed", "error");
    }

    setEditingEntryId(null);
    setEditFormValues({});
  };

  /** Updates a single field in the edit form */
  const updateEditField = (
    key: keyof DatabaseEntry,
    value: string | number,
  ) => {
    setEditFormValues((prev) => ({ ...prev, [key]: value }));
  };

  // ---------------------------------------------------------------------------
  // ADD OPERATIONS
  // ---------------------------------------------------------------------------

  /** Opens the add-row form at the bottom of the table */
  const startAddingRow = () => {
    setIsAddingRow(true);
    setNewRowValues({
      beneficiaryName: "",
      location:        "",
      contactNumber:   "",
      dateRegistered:  new Date().toISOString().split("T")[0],
      amountGranted:   0,
      remarks:         "",
    });
  };

  /** Cancels the add-row form */
  const cancelAddingRow = () => setIsAddingRow(false);

  /** Sends the new row to the backend and appends it to local state */
  const confirmAddRow = async () => {
    if (!newRowValues.beneficiaryName.trim()) {
      showToast("Beneficiary name is required", "error");
      return;
    }

    const data = {
      ...newRowValues,
      amountGranted: Number(newRowValues.amountGranted) || 0,
    };

    try {
      const { id } = await api.createRecord(projectId, data);
      const newEntry: DatabaseEntry = { entryId: id, ...data };
      setEntries((prev) => [...prev, newEntry]);
      showToast(`New entry "${newRowValues.beneficiaryName}" added`, "success");
      addLog(
        "Database Entry Added",
        `Added new entry for beneficiary "${newRowValues.beneficiaryName}" (ID #${id}) in project database ID #${projectId}`,
      );
    } catch (err: any) {
      showToast(err.message || "Failed to add entry", "error");
    }

    setIsAddingRow(false);
  };

  /** Updates a single field in the new-row form */
  const updateNewRowField = (
    key: keyof Omit<DatabaseEntry, "entryId">,
    value: string | number,
  ) => {
    setNewRowValues((prev) => ({ ...prev, [key]: value }));
  };

  // ---------------------------------------------------------------------------
  // DELETE OPERATIONS
  // ---------------------------------------------------------------------------

  /** Opens the delete confirmation modal for a specific entry */
  const requestDeleteEntry = (entry: DatabaseEntry) => setDeletingEntry(entry);

  /** Confirms deletion via backend and removes the entry from local state */
  const confirmDeleteEntry = async () => {
    if (!deletingEntry) return;

    try {
      await api.deleteRecord(deletingEntry.entryId);
      setEntries((prev) =>
        prev.filter((e) => e.entryId !== deletingEntry.entryId),
      );
      showToast(`Entry #${deletingEntry.entryId} deleted`, "error");
      addLog(
        "Database Entry Deleted",
        `Deleted entry for beneficiary "${deletingEntry.beneficiaryName}" (ID #${deletingEntry.entryId}) in project database ID #${projectId}`,
      );
    } catch (err: any) {
      showToast(err.message || "Delete failed", "error");
    }

    setDeletingEntry(null);
  };

  /** Cancels the delete confirmation */
  const cancelDeleteEntry = () => setDeletingEntry(null);

  return {
    // Data
    entries,
    isLoading,

    // Edit
    editingEntryId,
    editFormValues,
    startEditing,
    cancelEditing,
    saveEdit,
    updateEditField,

    // Add
    isAddingRow,
    newRowValues,
    startAddingRow,
    cancelAddingRow,
    confirmAddRow,
    updateNewRowField,

    // Delete
    deletingEntry,
    requestDeleteEntry,
    confirmDeleteEntry,
    cancelDeleteEntry,

    // Notification
    notification,
  };
}
