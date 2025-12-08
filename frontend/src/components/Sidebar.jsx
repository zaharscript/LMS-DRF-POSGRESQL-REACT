// src/components/Sidebar.jsx
import { Home, BookOpen, Bookmark, User, Settings, Menu } from "lucide-react";
import { NavLink } from "react-router-dom";
import { Sun, Moon, X } from "lucide-react";
import useTheme from "../hooks/useTheme";
import { useState } from "react";

export default function Sidebar() {
  const { theme, toggleTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  const menu = [
    { label: "Dashboard", icon: <Home size={20} />, href: "/" },
    { label: "My Courses", icon: <BookOpen size={20} />, href: "/" },
    { label: "Saved", icon: <Bookmark size={20} />, href: "/" },
    { label: "Profile", icon: <User size={20} />, href: "/" },
    { label: "Settings", icon: <Settings size={20} />, href: "/" },
  ];

  return (
    <>
      {/* Mobile top bar */}
      <div className="md:hidden flex items-center justify-between px-4 py-3 bg-white dark:bg-gray-900 shadow">
        <h1 className="text-xl font-bold">
          Study<span className="text-indigo-600">Plan</span>
        </h1>

        <button onClick={() => setIsOpen(true)}>
          <Menu size={26} className="text-gray-700 dark:text-gray-300" />
        </button>
      </div>

      {/* SIDEBAR PANEL */}
      <aside
        className={`
          fixed md:static top-0 left-0 h-full md:h-[88vh] w-64 
          backdrop-blur-xl bg-white/20 dark:bg-gray-800/40 
          border border-white/30 dark:border-gray-700 
          shadow-xl rounded-none md:rounded-2xl 
          p-6 flex flex-col justify-between 
          transition-transform duration-300
          ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
      >
        {/* Close button for mobile */}
        <button
          className="md:hidden absolute top-4 right-4 p-2 bg-white/40 dark:bg-gray-700 rounded-lg"
          onClick={() => setIsOpen(false)}
        >
          <X size={20} />
        </button>

        {/* Logo */}
        <div>
          <h1 className="hidden md:block text-2xl font-bold text-gray-800 dark:text-gray-100 mb-8 tracking-tight">
            Study<span className="text-indigo-500">Plan</span>
          </h1>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="flex items-center gap-2 px-3 py-2 mb-6 rounded-lg
                     bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 
                     dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200"
          >
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
            <span>{theme === "dark" ? "Light Mode" : "Dark Mode"}</span>
          </button>

          {/* MENU */}
          <nav className="flex flex-col gap-3">
            {menu.map((item) => (
              <NavLink
                key={item.label}
                to={item.href}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  `
                flex items-center gap-3 px-4 py-2 rounded-xl font-medium
                transition-all backdrop-blur-lg
                ${
                  isActive
                    ? "bg-white/60 dark:bg-gray-700 text-indigo-600 shadow"
                    : "text-gray-700 dark:text-gray-300 hover:bg-white/40 dark:hover:bg-gray-700 hover:text-indigo-600"
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
        <div className="text-xs text-gray-500 dark:text-gray-400 mt-8">
          © {new Date().getFullYear()} StudyPlan
        </div>
      </aside>
    </>
  );
}
