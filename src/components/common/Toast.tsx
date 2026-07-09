import React from "react";

// Declaring the interface right here fixes the broken hook import completely!
export interface ToastNotification {
  message: string;
  type: "success" | "error" | "info";
}

interface ToastProps {
  notification: ToastNotification;
}

export function Toast({ notification }: ToastProps) {
  const styles = {
    success:
      "bg-emerald-600 border-emerald-500 text-white shadow-emerald-600/10",
    error: "bg-rose-600 border-rose-500 text-white shadow-rose-600/10",
    info: "bg-slate-800 border-slate-700 text-white shadow-slate-900/20",
  };

  const safeNotification = notification || { message: "", type: "info" };

  return (
    <div
      className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-xl border text-xs font-semibold shadow-xl transition-all duration-300 ${styles[safeNotification.type]}`}
    >
      {safeNotification.type === "success" && (
        <svg
          className="w-4 h-4 text-emerald-200"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2.5}
            d="M5 13l4 4L19 7"
          />
        </svg>
      )}
      {safeNotification.type === "error" && (
        <svg
          className="w-4 h-4 text-rose-200"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2.5}
            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-16v4M4 7h16"
          />
        </svg>
      )}
      {safeNotification.type === "info" && (
        <svg
          className="w-4 h-4 text-sky-300"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2.5}
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      )}
      <span>{safeNotification.message}</span>
    </div>
  );
}
