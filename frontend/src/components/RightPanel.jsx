// src/components/RightPanel.jsx
import { BarChart2, Edit3, Trash2 } from "lucide-react";

export default function RightPanel({ course, onRefresh }) {
  if (!course) {
    return (
      <div className="bg-white rounded-2xl shadow p-4">
        <div className="text-sm text-gray-500">
          Select a course to see details
        </div>
      </div>
    );
  }

  const totalTopics =
    course.sections?.reduce((sum, s) => sum + (s.topics?.length || 0), 0) || 0;
  const completedTopics =
    course.sections?.reduce(
      (sum, s) => sum + (s.topics?.filter((t) => t.completed).length || 0),
      0
    ) || 0;
  const percent = totalTopics
    ? Math.round((completedTopics / totalTopics) * 100)
    : 0;

  return (
    <div className="sticky top-6 bg-white rounded-2xl shadow p-5">
      <div className="flex items-start justify-between">
        <div>
          <h4 className="text-lg font-semibold">{course.title}</h4>
          <div className="text-sm text-gray-500">
            Instructor: {course.instructor}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button title="Edit Course" className="p-2 hover:bg-gray-100 rounded">
            <Edit3 className="w-4 h-4" />
          </button>
          <button
            title="Delete Course"
            className="p-2 hover:bg-gray-100 rounded"
          >
            <Trash2 className="w-4 h-4 text-red-600" />
          </button>
        </div>
      </div>

      <div className="mt-4">
        <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
          <div>Overall Progress</div>
          <div className="font-medium">
            {completedTopics}/{totalTopics}
          </div>
        </div>
        <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
          <div className="h-2 bg-indigo-600" style={{ width: `${percent}%` }} />
        </div>
        <div className="text-xs text-gray-500 mt-2">{percent}% complete</div>
      </div>

      <div className="mt-4 border-t pt-4">
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
          <BarChart2 className="w-4 h-4" /> Stats
        </div>

        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span>Sections</span>
            <span className="font-medium">{course.sections?.length || 0}</span>
          </div>
          <div className="flex justify-between">
            <span>Topics</span>
            <span className="font-medium">{totalTopics}</span>
          </div>
          <div className="flex justify-between">
            <span>Completed</span>
            <span className="font-medium">{completedTopics}</span>
          </div>
        </div>
      </div>

      <div className="mt-4">
        <button
          onClick={onRefresh}
          className="w-full px-3 py-2 bg-indigo-600 text-white rounded"
        >
          Refresh
        </button>
      </div>
    </div>
  );
}
