import { useState } from "react";
import Sidebar from "../components/Sidebar";
import RightPanel from "../components/RightPanel";
import CourseList from "../components/CourseList";
import NewCourseModal from "../components/NewCourseModal";
import api from "../api";

export default function DashboardPage() {
  const [isNewCourseOpen, setIsNewCourseOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleCreateCourse = async (courseData) => {
    try {
      await api.post("courses/", courseData);
      setRefreshKey((prev) => prev + 1); // triggers CourseList reload
    } catch (error) {
      console.error("Failed to create course:", error);
      alert("Failed to create course.");
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* LEFT SIDEBAR */}
      {/* <Sidebar /> */}

      {/* CENTER CONTENT */}
      <main className="flex-1 p-6">
        {/* Header + Create Button */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">My Courses</h1>

          <button
            onClick={() => setIsNewCourseOpen(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            + New Course
          </button>
        </div>

        {/* Course List (with refresh support) */}
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
