import { useState } from "react";

/**
 * Interface for FileUploadZone component props.
 */
interface FileUploadZoneProps {
  onFileSelect: (file: File, department: string) => void;
  onShowWarning: (message: string) => void;
  userRole?: "admin" | "user";
}

/**
 * FileUploadZone Component
 * Provides a drag-and-drop interface for administrators to upload files to specific departments.
 */
export function FileUploadZone({
  onFileSelect,
  onShowWarning,
  userRole,
}: FileUploadZoneProps) {
  const [department, setDepartment] = useState("");

  // Restrict access: Only administrators can view/use the upload zone
  if (userRole !== "admin") return null;

  /**
   * Validates department selection before triggering the file upload process.
   */
  const handleUpload = (files: FileList) => {
    if (!department) {
      // Use the toast callback instead of alert()
      onShowWarning("Please select a department first!");
      return;
    }
    Array.from(files).forEach((file) => {
      onFileSelect(file, department);
    });
  };

  /**
   * Prevents default browser behavior to allow drop events.
   */
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  /**
   * Handles drop events and initiates upload for valid files.
   */
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleUpload(e.dataTransfer.files);
    }
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      className="relative border-2 border-dashed border-slate-300 rounded-2xl p-10 text-center bg-white hover:border-[#00aeef] transition-colors group"
    >
      {/* Top Right Department Selector */}
      <div className="absolute top-4 right-4">
        <select
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
          className={`text-xs font-semibold rounded-lg px-3 py-1.5 border focus:outline-none ${
            !department
              ? "border-red-300 text-red-600 bg-red-50"
              : "border-slate-200 text-slate-600 bg-slate-50"
          }`}
        >
          <option value="" disabled>
            Select Department
          </option>
          <option value="MIS">MIS</option>
          <option value="SCC">SCC</option>
          <option value="GAD">GAD</option>
          <option value="Planning">Planning</option>
        </select>
      </div>

      {/* SECTION: File Input Field */}
      <input
        type="file"
        multiple
        className="hidden"
        id="file-upload"
        onChange={(e) => {
          if (e.target.files && e.target.files.length > 0) {
            handleUpload(e.target.files);
          }
        }}
      />

      {/* SECTION: Drag and Drop Area */}
      <label htmlFor="file-upload" className="cursor-pointer block">
        <div className="w-10 h-10 mx-auto bg-slate-100 rounded-full flex items-center justify-center mb-3 group-hover:bg-[#00aeef]/10">
          <svg
            className="w-5 h-5 text-slate-400 group-hover:text-[#00aeef]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
            />
          </svg>
        </div>
        <div className="text-sm text-slate-600 font-medium">
          {department
            ? "Drag and drop files here or browse"
            : "Please select a department to begin"}
        </div>
        <p className="text-xs text-slate-400 mt-1.5">
          Supported formats: CSV, Excel (.xlsx, .xls) up to 25MB
        </p>
      </label>
    </div>
  );
}
