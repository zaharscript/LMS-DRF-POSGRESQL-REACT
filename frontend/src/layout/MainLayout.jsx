import { useState } from "react";
import Sidebar from "../components/Sidebar";
import RightPanel from "../components/RightPanel";
import { Menu } from "lucide-react";

export default function MainLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">

      {/* --- Top Mobile Header --- */}
      <header className="md:hidden flex items-center justify-between p-4 bg-white shadow">
        <button
          onClick={() => setSidebarOpen(true)}
          className="p-2 rounded-lg border"
        >
          <Menu className="w-6 h-6" />
        </button>

        <h1 className="text-xl font-bold tracking-tight">
          Study<span className="text-indigo-600">Plan</span>
        </h1>

        <div className="w-8" /> {/* Spacer */}
      </header>

      {/* --- Responsive Grid Layout --- */}
      <div
        className="
          grid flex-1
          grid-cols-1
          md:grid-cols-[260px_1fr]
          lg:grid-cols-[260px_1fr_300px]
          gap-4 p-4
        "
      >
        {/* --- Sidebar (Desktop) --- */}
        <aside className="hidden md:block">
          <Sidebar />
        </aside>

        {/* --- Sidebar (Mobile Slide-in) --- */}
        {sidebarOpen && (
          <div
            className="
              fixed inset-0 bg-black/40 z-40 md:hidden
            "
            onClick={() => setSidebarOpen(false)}
          >
            <div
              className="
                absolute left-0 top-0 h-full w-64
                bg-white shadow-xl p-4 z-50
              "
              onClick={(e) => e.stopPropagation()}
            >
              <Sidebar />
            </div>
          </div>
        )}

        {/* --- MAIN CONTENT --- */}
        <main className="bg-white rounded-xl shadow-sm p-4 md:p-6">
          {children}
        </main>

        {/* --- Right Panel (Desktop Only) --- */}
        <aside className="hidden lg:block">
          <RightPanel />
        </aside>
      </div>
    </div>
  );
}
