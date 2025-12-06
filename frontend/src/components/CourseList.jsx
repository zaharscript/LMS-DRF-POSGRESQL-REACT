// src/components/CourseList.jsx
import { useEffect, useState } from "react";
import { CourseAPI } from "../api";
import { useNavigate } from "react-router-dom";

export default function CourseList({ refreshKey }) {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      try {
        const res = await CourseAPI.list();
        if (!cancelled) setCourses(res.data || []);
      } catch (err) {
        console.error("Failed to load courses", err);
        if (!cancelled) setCourses([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => (cancelled = true);
  }, [refreshKey]);

  if (loading) return <p className="p-4 text-gray-500">Loading courses...</p>;
  if (!courses.length) return <p className="p-4 text-gray-500">No courses yet.</p>;

  return (
    <div className="space-y-4">
      {courses.map((c) => (
        <div
          key={c.id}
          className="p-4 bg-white shadow rounded hover:shadow-md transition cursor-pointer"
          onClick={() => navigate(`/course/${c.id}`)}
        >
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-semibold text-lg">{c.title}</h3>
              <p className="text-sm text-gray-600">{c.instructor}</p>
              {c.provider && <p className="text-xs text-gray-400 mt-1">Provider: {c.provider}</p>}
            </div>
            <div className="text-sm text-gray-500">{/* optional small UI */}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
