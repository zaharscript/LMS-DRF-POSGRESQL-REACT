// src/pages/DashboardPage.jsx
import { useState } from "react";
import CourseList from "../components/CourseList";
import NewCourseModal from "../components/NewCourseModal";
import Sidebar from "../components/Sidebar";
import RightPanel from "../components/RightPanel";
import { CourseAPI } from "../api";

export default function DashboardPage() {
  const [isNewCourseOpen, setIsNewCourseOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  // Create Course Handler
  const handleCreateCourse = async (courseData) => {
    try {
      await CourseAPI.create(courseData);  // <--- FIXED API
      setRefreshKey((prev) => prev + 1);  // refresh course list
      setIsNewCourseOpen(false);          // close modal
    } catch (error) {
      console.error("Failed to create course:", error);
      alert("Failed to create the course.");
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors">

      {/* LEFT SIDEBAR */}
      <Sidebar />

      {/* CENTER CONTENT */}
      <main className="flex-1 p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
            My Courses
          </h1>

          <button
            onClick={() => setIsNewCourseOpen(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg 
                       hover:bg-blue-700 transition"
          >
            + New Course
          </button>
        </div>

        {/* Course List */}
        <CourseList refreshKey={refreshKey} />
      </main>

      {/* RIGHT PANEL */}
      <RightPanel />

      {/* New Course Modal */}
      <NewCourseModal
        isOpen={isNewCourseOpen}
        onClose={() => setIsNewCourseOpen(false)}
        onCreate={handleCreateCourse}
      />
    </div>
  );
}
