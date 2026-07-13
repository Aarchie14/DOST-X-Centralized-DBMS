import { useState, useContext } from "react";
import type { DatabaseEntry } from "../config/databaseEntries";
import { MOCK_DATABASE_ENTRIES } from "../config/databaseEntries";
import { AuthContext } from "../context/AuthContext";

/**
 * useDatabaseView Hook
 * Manages CRUD state and operations for the database detail view
 * of a specific project record.
 */
export function useDatabaseView(projectId: number) {
  // --- DATA STATE ---
  const [entries, setEntries] = useState<DatabaseEntry[]>(() => {
    // Deep-clone mock data so mutations don't affect the source
    const source = MOCK_DATABASE_ENTRIES[projectId] || [];
    return source.map((e) => ({ ...e }));
  });

  const { addLog } = useContext(AuthContext)!;

  // --- EDITING STATE ---
  const [editingEntryId, setEditingEntryId] = useState<number | null>(null);
  const [editFormValues, setEditFormValues] = useState<Partial<DatabaseEntry>>({});

  // --- ADD ROW STATE ---
  const [isAddingRow, setIsAddingRow] = useState(false);
  const [newRowValues, setNewRowValues] = useState<Omit<DatabaseEntry, "entryId">>({
    beneficiaryName: "",
    location: "",
    contactNumber: "",
    dateRegistered: new Date().toISOString().split("T")[0],
    amountGranted: 0,
    remarks: "",
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

  // --- EDIT OPERATIONS ---

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

  /** Saves the current inline edit to state */
  const saveEdit = () => {
    if (editingEntryId === null) return;

    setEntries((prev) =>
      prev.map((entry) =>
        entry.entryId === editingEntryId
          ? {
              ...entry,
              ...editFormValues,
              amountGranted: Number(editFormValues.amountGranted) || entry.amountGranted,
            }
          : entry,
      ),
    );
    showToast(`Entry #${editingEntryId} updated successfully`, "info");
    addLog(
      "Database Entry Updated",
      `Updated entry ID #${editingEntryId} in project database ID #${projectId}`
    );
    setEditingEntryId(null);
    setEditFormValues({});
  };

  /** Updates a single field in the edit form */
  const updateEditField = (key: keyof DatabaseEntry, value: string | number) => {
    setEditFormValues((prev) => ({ ...prev, [key]: value }));
  };

  // --- ADD OPERATIONS ---

  /** Opens the add-row form at the bottom of the table */
  const startAddingRow = () => {
    setIsAddingRow(true);
    setNewRowValues({
      beneficiaryName: "",
      location: "",
      contactNumber: "",
      dateRegistered: new Date().toISOString().split("T")[0],
      amountGranted: 0,
      remarks: "",
    });
  };

  /** Cancels the add-row form */
  const cancelAddingRow = () => {
    setIsAddingRow(false);
  };

  /** Commits the new row to the entries list */
  const confirmAddRow = () => {
    if (!newRowValues.beneficiaryName.trim()) {
      showToast("Beneficiary name is required", "error");
      return;
    }

    const nextId =
      entries.length > 0
        ? Math.max(...entries.map((e) => e.entryId)) + 1
        : 1;

    const newEntry: DatabaseEntry = {
      entryId: nextId,
      ...newRowValues,
      amountGranted: Number(newRowValues.amountGranted) || 0,
    };

    setEntries((prev) => [...prev, newEntry]);
    showToast(`New entry "${newRowValues.beneficiaryName}" added`, "success");
    addLog(
      "Database Entry Added",
      `Added new entry for beneficiary "${newRowValues.beneficiaryName}" (ID #${nextId}) in project database ID #${projectId}`
    );
    setIsAddingRow(false);
  };

  /** Updates a single field in the new-row form */
  const updateNewRowField = (key: keyof Omit<DatabaseEntry, "entryId">, value: string | number) => {
    setNewRowValues((prev) => ({ ...prev, [key]: value }));
  };

  // --- DELETE OPERATIONS ---

  /** Opens the delete confirmation modal for a specific entry */
  const requestDeleteEntry = (entry: DatabaseEntry) => {
    setDeletingEntry(entry);
  };

  /** Confirms deletion and removes the entry from state */
  const confirmDeleteEntry = () => {
    if (!deletingEntry) return;

    setEntries((prev) => prev.filter((e) => e.entryId !== deletingEntry.entryId));
    showToast(`Entry #${deletingEntry.entryId} deleted`, "error");
    addLog(
      "Database Entry Deleted",
      `Deleted entry for beneficiary "${deletingEntry.beneficiaryName}" (ID #${deletingEntry.entryId}) in project database ID #${projectId}`
    );
    setDeletingEntry(null);
  };

  /** Cancels the delete confirmation */
  const cancelDeleteEntry = () => {
    setDeletingEntry(null);
  };

  return {
    // Data
    entries,

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
