// src/components/Sidebar.jsx
import {
  Home,
  BookOpen,
  MessageCircle,
  Settings,
  UserCircle,
} from "lucide-react";

export default function Sidebar() {
  return (
    <div className="sticky top-6">
      <div className="bg-white rounded-2xl shadow p-5">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-bold">Taskapp</h3>
            <p className="text-sm text-gray-500">Learning Management</p>
          </div>
        </div>

        <nav className="space-y-2">
          <a className="flex items-center gap-3 px-3 py-2 rounded-lg bg-indigo-50 text-indigo-700">
            <Home className="w-4 h-4" /> <span>Dashboard</span>
          </a>
          <a className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50 text-gray-700">
            <BookOpen className="w-4 h-4" /> <span>My Courses</span>
          </a>
          <a className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50 text-gray-700">
            <MessageCircle className="w-4 h-4" /> <span>Messages</span>
          </a>
          <a className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50 text-gray-700">
            <Settings className="w-4 h-4" /> <span>Settings</span>
          </a>
        </nav>

        <div className="border-t mt-6 pt-4">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-100 rounded-full p-1">
              <UserCircle className="w-8 h-8 text-indigo-600" />
            </div>
            <div>
              <div className="font-medium">You</div>
              <div className="text-sm text-gray-500">admin@example.com</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
