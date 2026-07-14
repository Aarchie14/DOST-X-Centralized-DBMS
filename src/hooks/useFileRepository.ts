import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { scopeToUnit, resolveInitialDepartment } from "../utils/unitAccess";

/**
 * Interface representing a file entry within the repository.
 */
interface FileRecord {
  id: number;
  fileName: string;
  department: string;
  sectorCategory: string;
  lastAccessed: string;
}

/**
 * useFileRepository Hook
 * Manages the state and filtering logic for the departmental file repository.
 */
export function useFileRepository() {
  const { user } = useContext(AuthContext)!;

  // --- DATA STATE ---
  const [files, setFiles] = useState<FileRecord[]>([
    { id: 1, fileName: "SETUP Food Processing.csv", department: "MIS", sectorCategory: "SETUP (MSMEs)", lastAccessed: "07-07-2026" },
  ]);

  // --- UI STATE ---
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState(() =>
    resolveInitialDepartment(user, "All department"),
  );

  /**
   * Removes a file record from the repository by its unique ID.
   * @param id - The unique identifier of the file to delete.
   */
  const handleDeleteFile = (id: number) => {
    setFiles(files.filter(f => f.id !== id));
  };

  // --- DERIVED DATA ---
  /**
   * Computed list of files based on active search criteria and department filters.
   */
  const visibleFiles = scopeToUnit(files, user);

  const filteredFiles = visibleFiles.filter(f => {
    const matchesDept = selectedDepartment === "All department" || f.department === selectedDepartment;
    const matchesSearch = f.fileName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesDept && matchesSearch;
  });

  return { files: filteredFiles, searchQuery, setSearchQuery, selectedDepartment, setSelectedDepartment, handleDeleteFile };
}