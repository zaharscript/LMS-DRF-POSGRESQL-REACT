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

   const { theme, toggleTheme } = useTheme();
  
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
        flex flex-col justify-between dark:border-gray-700
  transition-colors
      "
    >
      {/* Logo */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800 mb-8 tracking-tight">
          Study<span className="text-indigo-600">Plan</span>
        </h1>

        <button
      onClick={toggleTheme}
      className="flex items-center gap-2 px-3 py-2 mt-4 rounded-lg
                 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600"
    >
      {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
      <span>{theme === "dark" ? "Light Mode" : "Dark Mode"}</span>
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
