// src/components/Sidebar.jsx
import { Home, BookOpen, Bookmark, User, Settings } from "lucide-react";
import { NavLink } from "react-router-dom";
import { Sun, Moon } from "lucide-react";
import useTheme from "../hooks/useTheme";


export default function Sidebar() {
  const menu = [
    { label: "Dashboard", icon: <Home size={20} />, href: "/" },
    { label: "My Courses", icon: <BookOpen size={20} />, href: "/" },
    { label: "Saved", icon: <Bookmark size={20} />, href: "/" },
    { label: "Profile", icon: <User size={20} />, href: "/" },
    { label: "Settings", icon: <Settings size={20} />, href: "/" },
  ];

  return (
    <aside
      className="
        sticky top-6
        h-[88vh]
        w-64
        rounded-2xl
        p-6
        backdrop-blur-xl
        bg-white/20
        shadow-xl border border-white/30
        flex flex-col justify-between
      "
    >
      {/* Logo */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800 mb-8 tracking-tight">
          Study<span className="text-indigo-600">Plan</span>
        </h1>

        <button
          onClick={toggleTheme}
          className="p-2 rounded-xl hover:bg-white/40 dark:hover:bg-white/10
                     transition"
        >
          {theme === "light" ? (
            <Moon className="w-5 h-5 text-gray-700" />
          ) : (
            <Sun className="w-5 h-5 text-yellow-300" />
          )}
        </button>

        {/* Menu */}
        <nav className="flex flex-col gap-3">
          {menu.map((item) => (
            <NavLink
              key={item.label}
              to={item.href}
              className={({ isActive }) =>
                `
              flex items-center gap-3
              px-4 py-2
              rounded-xl
              font-medium
              transition-all
              backdrop-blur-lg
              ${
                isActive
                  ? "bg-white/60 text-indigo-600 shadow"
                  : "text-gray-700 hover:bg-white/40 hover:text-indigo-600"
              }
            `
              }
            >
              {item.icon}
              {item.label}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Footer */}
      <div className="text-xs text-gray-500">
        © {new Date().getFullYear()} StudyPlan
      </div>
    </aside>
  );
}
