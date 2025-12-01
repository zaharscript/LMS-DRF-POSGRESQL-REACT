// src/components/CourseList.jsx
import { useNavigate } from "react-router-dom";

export default function CourseList({ courses, selectedCourseId }) {
  const navigate = useNavigate();

  return (
    <ul className="divide-y">
      {courses.map((course) => (
        <li
          key={course.id}
          onClick={() => navigate(`/course/${course.id}`)}
          className={`p-4 cursor-pointer hover:bg-gray-100 ${
            selectedCourseId === course.id ? "bg-indigo-50" : ""
          }`}
        >
          <div className="font-semibold text-lg">{course.title}</div>
          <div className="text-gray-500 text-sm">{course.instructor}</div>
        </li>
      ))}
    </ul>
  );
}
