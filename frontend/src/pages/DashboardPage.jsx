import { useEffect, useState } from "react";
import CourseList from "../components/CourseList";
import NewCourseModal from "../components/NewCourseModal";
import DashboardOverview from "../components/DashboardOverview";
import { CourseAPI } from "../api";

export default function DashboardPage() {
  const [isNewCourseOpen, setIsNewCourseOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  /* Load courses once and when refreshed */
  useEffect(() => {
    let cancelled = false;

    async function loadCourses() {
      setLoading(true);
      try {
        const res = await CourseAPI.list();
        if (!cancelled) setCourses(res.data || []);
      } catch (err) {
        console.error("Failed to load courses:", err);
        if (!cancelled) setCourses([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadCourses();
    return () => (cancelled = true);
  }, [refreshKey]);

  /* Create Course Handler */
  const handleCreateCourse = async (courseData) => {
    try {
      await CourseAPI.create(courseData);
      setRefreshKey((prev) => prev + 1); // trigger reload
      setIsNewCourseOpen(false);
    } catch (error) {
      console.error("Failed to create course:", error);
      alert("Failed to create the course.");
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors">
      {/* CENTER CONTENT */}
      <main className="flex-1 p-6 text-gray-900 dark:text-gray-100">
        {/* HEADER */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
            My Courses
          </h1>

          <button
            onClick={() => setIsNewCourseOpen(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg 
                       hover:bg-blue-700 transition
                       dark:bg-blue-500 dark:hover:bg-blue-600"
          >
            + New Course
          </button>
        </div>

        {/* DASHBOARD OVERVIEW */}
        {!loading && (
          <DashboardOverview
            courses={courses}
            user={{ name: "Alex Smith", streak: 15 }}
          />
        )}

        {/* COURSE LIST */}
        <CourseList refreshKey={refreshKey} />
      </main>

      {/* NEW COURSE MODAL */}
      <NewCourseModal
        isOpen={isNewCourseOpen}
        onClose={() => setIsNewCourseOpen(false)}
        onCreate={handleCreateCourse}
      />
    </div>
  );
}
