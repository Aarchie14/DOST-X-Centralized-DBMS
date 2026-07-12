import React from "react";

/**
 * Interface representing the structure of a breadcrumb item.
 */
interface PageHeaderProps {
  title: string;
  breadcrumbs: { label: string; href?: string; active?: boolean }[];
  children?: React.ReactNode;
}

/**
 * PageHeader Component
 * A standardized header displaying the current page title,
 * hierarchical breadcrumb navigation, and optional contextual action widgets.
 */
export function PageHeader({ title, breadcrumbs, children }: PageHeaderProps) {
  return (
    <div className="bg-white border-b border-slate-200 px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 font-sans">

      {/* SECTION: Title and Breadcrumb Navigation */}
      <div className="flex flex-col">
        <h1 className="text-slate-900 font-extrabold text-2xl tracking-tight leading-tight">
          {title}
        </h1>

        {/* Breadcrumb Map: Renders hierarchical links with separator logic */}
        <nav className="flex items-center space-x-1.5 text-xs font-medium text-slate-400 mt-1">
          {breadcrumbs.map((crumb, idx) => (
            <React.Fragment key={idx}>
              {/* Separator icon rendered between crumbs */}
              {idx > 0 && <span className="text-slate-300">&gt;</span>}
              {crumb.active ? (
                <span className="text-blue-500 font-semibold">
                  {crumb.label}
                </span>
              ) : (
                <a
                  href={crumb.href || "#"}
                  className="hover:text-slate-600 transition-colors"
                >
                  {crumb.label}
                </a>
              )}
            </React.Fragment>
          ))}
        </nav>
      </div>

      {/* Right side: Pluggable Contextual Widgets Area */}
      {/* Renders any children (buttons, filters, or status badges) passed to the header */}
      {children && (
        <div className="flex items-center gap-3 self-end sm:self-center">
          {children}
        </div>
      )}
    </div>
  );
}
