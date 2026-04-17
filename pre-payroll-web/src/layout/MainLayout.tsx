import { useState } from 'react';
import type { CSSProperties, ReactNode } from 'react';
import { BarChart3, CalendarDays, ChevronLeft, ChevronRight, LayoutDashboard } from 'lucide-react';

export default function MainLayout({ children }: { children: ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const layoutStyle = { '--sidebar-width': collapsed ? '72px' : '16rem' } as unknown as CSSProperties;

  return (
    <div className="flex h-screen w-full bg-slate-50 overflow-hidden font-sans" style={layoutStyle}>
      {/* Sidebar */}
      <aside className={`bg-slate-50 border-r border-slate-200 flex flex-col transition-[width] duration-200 ${collapsed ? 'w-[72px]' : 'w-64'}`}>
        {/* Logo Zone */}
        <div className={`h-16 bg-[#ffcc00] flex items-center ${collapsed ? 'px-0 justify-center' : 'px-6 justify-between'}`}>
          <span className="text-[#3d50b6] font-bold text-xl tracking-tight">{collapsed ? 'B' : 'Butter'}</span>
          <button
            type="button"
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            onClick={() => setCollapsed((v) => !v)}
            className={`h-8 w-8 rounded-md bg-white/70 hover:bg-white border border-white/70 text-[#3d50b6] flex items-center justify-center ${collapsed ? 'hidden' : ''}`}
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
        </div>
        {collapsed && (
          <div className="px-3 pt-3">
            <button
              type="button"
              aria-label="Expand sidebar"
              onClick={() => setCollapsed(false)}
              className="h-9 w-full rounded-md border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 flex items-center justify-center"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
        {/* Nav Links Placeholder */}
        <nav className={`flex-1 py-4 ${collapsed ? 'px-2' : 'px-3'} space-y-1`}>
          <a href="#" className={`flex items-center ${collapsed ? 'justify-center' : ''} px-3 py-2 rounded-md bg-blue-50 text-blue-700 text-sm font-medium`}>
            <LayoutDashboard className="w-4 h-4 shrink-0" />
            {!collapsed && <span className="ml-2">Pre-Payroll</span>}
          </a>
          <a href="#" className={`flex items-center ${collapsed ? 'justify-center' : ''} px-3 py-2 rounded-md text-slate-600 hover:bg-slate-100 text-sm font-medium`}>
            <CalendarDays className="w-4 h-4 shrink-0" />
            {!collapsed && <span className="ml-2">Leave & Attendance</span>}
          </a>
          <a href="#" className={`flex items-center ${collapsed ? 'justify-center' : ''} px-3 py-2 rounded-md text-slate-600 hover:bg-slate-100 text-sm font-medium`}>
            <BarChart3 className="w-4 h-4 shrink-0" />
            {!collapsed && <span className="ml-2">Analytics</span>}
          </a>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col bg-[#f4f6f8] overflow-hidden">
        {/* Top Header */}
        <header className="h-16 bg-[#3d50b6] flex items-center px-6 shrink-0 justify-between">
          <h1 className="text-white font-semibold text-lg">Leave & Attendance Data</h1>
          <div className="flex items-center space-x-4">
            <span className="text-blue-200 text-sm">Assignee: Zhang San</span>
            <div className="w-8 h-8 rounded-full bg-blue-400 flex items-center justify-center text-white font-medium text-sm">
              ZS
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
