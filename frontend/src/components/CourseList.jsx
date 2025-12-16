// src/components/CourseList.jsx
import { useEffect, useState, useMemo } from "react";
import { CourseAPI } from "../api";
import { useNavigate } from "react-router-dom";

/**
 * Generate a stable Unsplash image URL using course title
 * - source.unsplash.com does NOT require an API key
 * - sig ensures different images for different courses
 */
function getCourseImage(title, id) {
  const keyword = encodeURIComponent(title || "learning");
  return `https://source.unsplash.com/800x400/?${keyword}&sig=${id}`;
}

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
  if (!courses.length)
    return <p className="p-4 text-gray-500">No courses yet.</p>;

  return (
    <div className="space-y-4 p-3 transition-colors">
      {courses.map((c) => {
        const bgImage = getCourseImage(c.title, c.id);

        return (
          <div
            key={c.id}
            onClick={() => navigate(`/course/${c.id}`)}
            className="relative rounded-lg overflow-hidden shadow hover:shadow-lg cursor-pointer transition"
          >
            {/* Image */}
            <div
              className="h-40 bg-cover bg-center relative z-0"
              style={{ backgroundImage: `url(${bgImage})` }}
            />

            {/* Overlay (ONLY over image) */}
            <div className="absolute top-0 left-0 right-0 h-40 bg-black/40 z-10" />

            {/* Content */}
            <div className="absolute inset-0 z-20 p-4 flex flex-col justify-end text-white">
              <h3 className="font-semibold text-lg">{c.title}</h3>
              <p className="text-sm opacity-90">{c.instructor}</p>
              {c.provider && (
                <p className="text-xs opacity-75 mt-1">
                  Provider: {c.provider}
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
