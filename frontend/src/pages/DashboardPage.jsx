// src/pages/DashboardPage.jsx
import { useState } from "react";
import CourseList from "../components/CourseList";
import NewCourseModal from "../components/NewCourseModal";
import Sidebar from "../components/Sidebar";
import RightPanel from "../components/RightPanel";
import api from "../api";

export default function DashboardPage() {
  const [isNewCourseOpen, setIsNewCourseOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  // Create Course Handler
  const handleCreateCourse = async (courseData) => {
    try {
      await api.post("/courses/", courseData); // <-- correct API path
      setRefreshKey((prev) => prev + 1); // reload CourseList
      setIsNewCourseOpen(false);
    } catch (error) {
      console.error("Failed to create course:", error);
      alert("Failed to create the course.");
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* LEFT SIDEBAR */}

      {/* CENTER */}
      <main className="flex-1 p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">My Courses</h1>

          <button
            onClick={() => setIsNewCourseOpen(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            + New Course
          </button>
        </div>

        {/* Course List */}
        <CourseList refreshKey={refreshKey} />
      </main>

      {/* RIGHT PANEL */}
      <RightPanel />

      {/* REGISTER NEW COURSE MODAL */}
      <NewCourseModal
        isOpen={isNewCourseOpen}
        onClose={() => setIsNewCourseOpen(false)}
        onCreate={handleCreateCourse}
      />
    </div>
  );
}
