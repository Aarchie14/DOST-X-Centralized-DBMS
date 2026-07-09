import React from "react";

interface PageHeaderProps {
  title: string;
  breadcrumbs: { label: string; href?: string; active?: boolean }[];
  children?: React.ReactNode; // For widgets like dropdowns or status pills on the right side
}

export function PageHeader({ title, breadcrumbs, children }: PageHeaderProps) {
  return (
    <div className="bg-white border-b border-slate-200 px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 font-sans">
      
      {/* Left side: Dynamic Title and Hierarchy Navigation Map */}
      <div className="flex flex-col">
        <h1 className="text-slate-900 font-extrabold text-2xl tracking-tight leading-tight">
          {title}
        </h1>
        <nav className="flex items-center space-x-1.5 text-xs font-medium text-slate-400 mt-1">
          {breadcrumbs.map((crumb, idx) => (
            <React.Fragment key={idx}>
              {idx > 0 && <span className="text-slate-300">&gt;</span>}
              {crumb.active ? (
                <span className="text-blue-500 font-semibold">{crumb.label}</span>
              ) : (
                <a href={crumb.href || "#"} className="hover:text-slate-600 transition-colors">
                  {crumb.label}
                </a>
              )}
            </React.Fragment>
          ))}
        </nav>
      </div>

      {/* Right side: Pluggable Contextual Widgets Area */}
      {children && (
        <div className="flex items-center gap-3 self-end sm:self-center">
          {children}
        </div>
      )}

    </div>
  );
}