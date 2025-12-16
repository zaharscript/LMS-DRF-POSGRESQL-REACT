// src/components/Sidebar.jsx
import {
  Home,
  BookOpen,
  Bookmark,
  User,
  Settings,
  Menu,
  Sun,
  Moon,
  X,
} from "lucide-react";
import { NavLink } from "react-router-dom";
import { useState } from "react";
import useTheme from "../hooks/useTheme";
import sidebarBg from "../assets/sidebar-bg.jpg";

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
      {/* MOBILE TOP BAR */}
      <div className="md:hidden flex items-center justify-between px-4 py-3 bg-white dark:bg-gray-900 shadow">
        <h1 className="text-xl font-bold">
          Study<span className="text-indigo-600">Plan</span>
        </h1>
        <button onClick={() => setIsOpen(true)}>
          <Menu size={26} className="text-gray-700 dark:text-gray-300" />
        </button>
      </div>

      {/* SIDEBAR */}
      <aside
        className={`
          fixed md:static top-0 left-0 h-full md:h-[88vh] w-64
          rounded-none md:rounded-2xl overflow-hidden
          transition-transform duration-300
          ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
      >
        {/* BACKGROUND IMAGE */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${sidebarBg})` }}
        />

        {/* GRADIENT OVERLAY */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/60 to-black/80" />

        {/* SOFT GLOW */}
        <div className="absolute inset-0 ring-1 ring-indigo-400/20 shadow-[0_0_40px_rgba(99,102,241,0.15)]" />

        {/* CONTENT */}
        <div className="relative h-full flex flex-col justify-between p-6 backdrop-blur-sm text-white">
          {/* CLOSE (MOBILE) */}
          <button
            className="md:hidden absolute top-4 right-4 p-2 bg-black/40 rounded-lg"
            onClick={() => setIsOpen(false)}
          >
            <X size={20} />
          </button>

          {/* TOP */}
          <div>
            <h1 className="hidden md:block text-2xl font-bold mb-8 tracking-tight drop-shadow-lg">
              Study<span className="text-indigo-400">Plan</span>
            </h1>

            {/* THEME TOGGLE */}
            <button
              onClick={toggleTheme}
              className="
                flex items-center gap-2 px-3 py-2 mb-6 rounded-lg
                bg-white/15 hover:bg-white/25
                transition backdrop-blur-md
              "
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
                      group flex items-center gap-3 px-4 py-2 rounded-xl
                      font-medium backdrop-blur-md transition-all
                      ${
                        isActive
                          ? "bg-white/35 text-indigo-300 shadow-lg"
                          : "text-gray-200 hover:bg-white/20 hover:text-white"
                      }
                    `
                  }
                >
                  <span className="group-hover:scale-110 transition-transform">
                    {item.icon}
                  </span>
                  {item.label}
                </NavLink>
              ))}
            </nav>
          </div>

          {/* FOOTER */}
          <div className="text-xs text-gray-300 drop-shadow">
            © {new Date().getFullYear()} StudyPlan
          </div>
        </div>
      </aside>
    </>
  );
}
