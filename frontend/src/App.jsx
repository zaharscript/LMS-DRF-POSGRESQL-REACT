import { useEffect, useState } from "react";
import api from "./api";
import CourseDetails from "./CourseDetails";

export default function App() {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);

  useEffect(() => {
    api.get("courses/").then((res) => setCourses(res.data));
  }, []);

  if (selectedCourse) {
    return (
      <CourseDetails
        courseId={selectedCourse}
        onBack={() => setSelectedCourse(null)}
      />
    );
  }

  return (
    <div style={{ padding: "20px" }}>
      {/* Tailwind test line */}
      <div className="bg-blue-500 text-white p-10 text-3xl">
        Tailwind colors finally working!
      </div>

      <h1>LMS Dashboard</h1>

      {courses.length === 0 ? (
        <p>No courses yet...</p>
      ) : (
        <ul>
          {courses.map((course) => (
            <li
              key={course.id}
              onClick={() => setSelectedCourse(course.id)}
              style={{ cursor: "pointer", marginBottom: "10px" }}
            >
              <strong>{course.title}</strong> — {course.instructor}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
