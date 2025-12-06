// src/components/TopicsAccordion.jsx
import { Edit, Trash2 } from "lucide-react";

export default function TopicsAccordion({
  topics,
  onToggleComplete,
  onEditTopic,
  onDeleteTopic,
}) {
  return (
    <div className="space-y-2">
      {topics.map((topic) => (
        <div
          key={topic.id}
          className="flex items-center justify-between p-3 bg-white border rounded-lg shadow-sm"
        >
          {/* Left: Checkbox + Topic Title */}
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={topic.completed}
              onChange={() => onToggleComplete(topic.id)}
              className="w-4 h-4"
            />

            <span
              className={`text-sm ${
                topic.completed ? "line-through text-gray-500" : "text-gray-800"
              }`}
            >
              {topic.title}
            </span>
          </div>

          {/* Right: Edit + Delete icons */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => onEditTopic(topic)}
              className="p-2 hover:bg-blue-100 rounded-full transition"
              title="Edit Topic"
            >
              <Edit className="w-5 h-5 text-blue-600" />
            </button>

            <button
              onClick={() => onDeleteTopic(topic.id)}
              className="p-2 hover:bg-red-100 rounded-full transition"
              title="Delete Topic"
            >
              <Trash2 className="w-5 h-5 text-red-600" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
