import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

export default function CourseList() {
  const [courses, setCourses] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    try {
      const res = await api.get("courses/");
      setCourses(res.data || []);
    } catch (err) {
      console.error("Failed to load courses:", err);
      setCourses([]);
    }
  };

  if (!courses.length)
    return <p className="text-gray-500 p-4">No courses yet.</p>;

  return (
    <div className="space-y-4">
      {courses.map((course) => (
        <div
          key={course.id}
          onClick={() => navigate(`/course/${course.id}`)}
          className="p-4 bg-white rounded-xl shadow cursor-pointer hover:shadow-md transition"
        >
          <h3 className="font-semibold">{course.title}</h3>
          <p className="text-sm text-gray-600">{course.instructor}</p>
        </div>
      ))}
    </div>
  );
}
