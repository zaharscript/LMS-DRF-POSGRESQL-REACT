// src/pages/Dashboard.jsx
import { useEffect, useState } from "react";
import api from "../api";
import Sidebar from "../components/Sidebar";
import CourseList from "../components/CourseList";
import RightPanel from "../components/RightPanel";

export default function Dashboard() {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [query, setQuery] = useState("");

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    try {
      const res = await api.get("courses/");
      setCourses(res.data || []);
      if (!selectedCourse && res.data && res.data.length)
        setSelectedCourse(res.data[0]);
    } catch (err) {
      console.error("Failed to load courses:", err);
    }
  };

  const onSelectCourse = async (course) => {
    // optionally fetch fresh course detail
    try {
      const res = await api.get(`courses/${course.id}/`);
      setSelectedCourse(res.data);
    } catch (err) {
      console.error("Failed fetch course details:", err);
      setSelectedCourse(course);
    }
  };

  const filtered = courses.filter(
    (c) =>
      c.title.toLowerCase().includes(query.toLowerCase()) ||
      (c.instructor || "").toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white p-6">
      <div className="max-w-[1400px] mx-auto grid grid-cols-12 gap-6">
        {/* Sidebar (left) */}
        <aside className="col-span-12 lg:col-span-3">
          <Sidebar />
        </aside>

        {/* Main content (center) */}
        <main className="col-span-12 lg:col-span-6">
          <div className="bg-white rounded-2xl shadow px-6 py-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-2xl font-bold">Course Dashboard</h2>
                <p className="text-sm text-gray-500">
                  Manage your courses, sections, and topics
                </p>
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="search"
                  placeholder="Search courses or instructor..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
                />
              </div>
            </div>

            <CourseList
              courses={filtered}
              onSelectCourse={onSelectCourse}
              selectedCourseId={selectedCourse?.id}
              onRefresh={loadCourses}
            />
          </div>
        </main>

        {/* Right panel (detail) */}
        <aside className="col-span-12 lg:col-span-3">
          <RightPanel course={selectedCourse} onRefresh={loadCourses} />
        </aside>
      </div>
    </div>
  );
}
