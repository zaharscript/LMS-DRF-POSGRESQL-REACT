// src/layout/Layout.jsx
import Sidebar from "../components/Sidebar";

export default function Layout({ children }) {
  return (
    <div className="min-h-screen flex bg-gradient-to-br from-slate-100 to-slate-50">
      {/* Sidebar (fixed) */}
      <aside className="w-64 bg-white/30 backdrop-blur-xl shadow-xl border-r border-white/20 p-5 hidden lg:block">
        <Sidebar />
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
