// src/layout/MainLayout.jsx
import { useState } from "react";
import Sidebar from "../components/Sidebar";
import RightPanel from "../components/RightPanel";
import { Menu, X } from "lucide-react";

export default function MainLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen flex bg-gray-100 dark:bg-gray-900 transition-colors">
      
      {/* ---------- MOBILE TOP BAR ---------- */}
      <div className="lg:hidden fixed top-0 left-0 w-full z-50 
                      bg-white dark:bg-gray-800 shadow-md p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-gray-800 dark:text-gray-200">
          Study<span className="text-indigo-600">Plan</span>
        </h1>

        {/* Mobile Menu Button */}
        <button 
          onClick={() => setSidebarOpen(!sidebarOpen)} 
          className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700">
          {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* ---------- SIDEBAR (MOBILE OVERLAY + DESKTOP FIXED) ---------- */}
      <div>
        {/* Mobile Overlay */}
        {sidebarOpen && (
          <div 
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden">
          </div>
        )}

        {/* Sidebar panel */}
        <aside
          className={`
            fixed z-50 lg:static
            top-0 left-0
            h-full lg:h-[88vh]
            w-64 
            transform transition-transform duration-300
            ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
          `}
        >
          <Sidebar closeSidebar={() => setSidebarOpen(false)} />
        </aside>
      </div>

      {/* ---------- MAIN CONTENT AREA ---------- */}
      <main className="flex-1 p-4 lg:p-8 mt-16 lg:mt-0">
        {children}
      </main>

      {/* ---------- RIGHT PANEL (DESKTOP ONLY) ---------- */}
      <div className="hidden xl:block w-80 p-4">
        <RightPanel />
      </div>
    </div>
  );
}
