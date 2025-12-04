import { useEffect, useState } from "react";
import { CourseAPI } from "../api";

export default function CourseList({ refreshKey }) {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await CourseAPI.list();
        setCourses(res.data || []);
      } catch (err) {
        console.error("Failed to load courses", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [refreshKey]);

  if (loading) return <p>Loading...</p>;
  if (!courses.length) return <p>No courses yet.</p>;

  return (
    <div className="space-y-4">
      {courses.map((c) => (
        <div key={c.id} className="p-4 bg-white shadow rounded">
          <h3 className="font-bold">{c.title}</h3>
          <p className="text-sm text-gray-500">{c.instructor}</p>
        </div>
      ))}
    </div>
  );
}
