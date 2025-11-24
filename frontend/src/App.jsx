import { useEffect, useState } from "react";
import api from "./api";
import CourseDetails from "./CourseDetails";
import NewCourseModal from "./components/NewCourseModal";

export default function App() {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [isCourseModalOpen, setIsCourseModalOpen] = useState(false);

  const loadCourses = () => {
    api.get("courses/").then((res) => setCourses(res.data));
  };

  useEffect(() => {
    loadCourses();
  }, []);

  const createCourse = (courseData) => {
    api.post("courses/", courseData).then(() => loadCourses());
  };

  if (selectedCourse) {
    return (
      <CourseDetails
        courseId={selectedCourse}
        onBack={() => setSelectedCourse(null)}
      />
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">LMS Dashboard</h1>

        <button
          onClick={() => setIsCourseModalOpen(true)}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          + Register New Course
        </button>
      </div>

      {/* Body */}
      {courses.length === 0 ? (
        <p className="text-gray-500">No courses yet...</p>
      ) : (
        <ul>
          {courses.map((course) => (
            <li
              key={course.id}
              onClick={() => setSelectedCourse(course.id)}
              className="cursor-pointer p-3 border-b hover:bg-gray-50"
            >
              <strong>{course.title}</strong> — {course.instructor}
            </li>
          ))}
        </ul>
      )}

      {/* Modal */}
      <NewCourseModal
        isOpen={isCourseModalOpen}
        onClose={() => setIsCourseModalOpen(false)}
        onCreate={createCourse}
      />
    </div>
  );
}
