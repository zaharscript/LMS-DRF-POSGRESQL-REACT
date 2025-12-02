// src/layout/MainLayout.jsx
import Sidebar from "../components/Sidebar";

export default function MainLayout({ children, rightPanel = null }) {
  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* LEFT SIDEBAR */}
      <div className="w-64 p-4">
        <Sidebar />
      </div>

      {/* MAIN CONTENT */}
      <div className="flex-1 p-6">{children}</div>

      {/* OPTIONAL RIGHT PANEL */}
      {rightPanel && <div className="w-80 p-4">{rightPanel}</div>}
    </div>
  );
}
