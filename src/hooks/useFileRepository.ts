import { useState } from "react";

export function useFileRepository() {
  const [files, setFiles] = useState<FileRecord[]>([
    { id: 1, fileName: "SETUP Food Processing.csv", department: "MIS", sectorCategory: "SETUP (MSMEs)", lastAccessed: "07-07-2026" },
    // Add your other initial records here...
  ]);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("All department");

  const handleDeleteFile = (id: number) => {
    setFiles(files.filter(f => f.id !== id));
  };

  const filteredFiles = files.filter(f => {
    const matchesDept = selectedDepartment === "All department" || f.department === selectedDepartment;
    const matchesSearch = f.fileName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesDept && matchesSearch;
  });

  return { files: filteredFiles, searchQuery, setSearchQuery, selectedDepartment, setSelectedDepartment, handleDeleteFile };
}