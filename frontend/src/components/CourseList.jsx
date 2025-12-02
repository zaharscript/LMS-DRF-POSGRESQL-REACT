import { useEffect, useState } from "react";
import api from "../api";
import { motion } from "framer-motion";
import { BookOpen, Users, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function CourseList(refreshKey) {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchCourses({}) {
      try {
        const res = await api.get("/lms/courses/");
        setCourses(res.data || []);
      } catch (err) {
        console.error("Error loading courses:", err);
        setCourses([]);
      } finally {
        setLoading(false);
      }
    }
    fetchCourses();
  }, [refreshKey]);

  if (loading) {
    return (
      <p className="text-gray-500 text-center mt-10">Loading your courses...</p>
    );
  }

  return (
    <div className="p-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">My Courses</h2>
          <p className="text-gray-500 text-sm">Continue where you left off</p>
        </div>

        <button
          onClick={() => navigate("/new-course")}
          className="px-4 py-2 bg-indigo-600 text-white rounded-xl shadow hover:bg-indigo-700 transition"
        >
          + New Course
        </button>
      </div>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {courses.map((course, i) => {
          const totalTopics =
            course.sections?.reduce(
              (sum, s) => sum + (s.topics?.length || 0),
              0
            ) ?? 0;

          const completedTopics =
            course.sections?.reduce(
              (sum, s) =>
                sum + (s.topics?.filter((t) => t.completed).length || 0),
              0
            ) ?? 0;

          const percent = totalTopics
            ? Math.round((completedTopics / totalTopics) * 100)
            : 0;

          return (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              onClick={() => navigate(`/course/${course.id}`)}
              className="
                cursor-pointer
                p-5 rounded-2xl
                bg-white/60 
                backdrop-blur-xl
                shadow-md 
                hover:shadow-xl 
                border border-white/40
                transition
              "
            >
              {/* Icon */}
              <div className="flex items-center gap-3 mb-3">
                <div className="p-3 rounded-xl bg-indigo-100">
                  <BookOpen className="text-indigo-700" />
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    {course.title}
                  </h3>
                  <p className="text-sm text-gray-500">
                    Instructor: {course.instructor}
                  </p>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mt-3">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Progress</span>
                  <span>{percent}%</span>
                </div>

                <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden mt-1">
                  <div
                    className="h-2 bg-indigo-600 rounded-full"
                    style={{ width: `${percent}%` }}
                  />
                </div>

                <p className="text-xs text-gray-500 mt-2">
                  {completedTopics}/{totalTopics} topics completed
                </p>
              </div>

              {/* Footer */}
              <div className="mt-4 flex justify-between items-center text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <Users size={16} className="text-gray-500" />
                  {course.sections?.length || 0} sections
                </div>

                <ArrowRight size={18} className="text-indigo-700" />
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
