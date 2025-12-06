// src/components/TopicsAccordion.jsx
import { useState } from "react";
import { Edit3, Trash2 } from "lucide-react";

export default function TopicsAccordion({
  topics,
  onToggleComplete,
  onEditTopic,
  onDeleteTopic,
}) {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleAccordion = (i) => {
    setOpenIndex(openIndex === i ? null : i);
  };

  return (
    <div className="mt-2 space-y-2">
      {topics.map((topic, i) => (
        <div
          key={topic.id}
          className="border rounded-xl bg-gray-50 overflow-hidden"
        >
          {/* HEADER ROW */}
          <div className="flex items-center justify-between px-4 py-3">

            {/* LEFT SIDE: checkbox + title */}
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={topic.completed}
                onChange={() => onToggleComplete(topic.id)}
                className="cursor-pointer"
              />

              <span
                className={`${
                  topic.completed
                    ? "line-through text-gray-500"
                    : "text-gray-800"
                }`}
              >
                {topic.title}
              </span>
            </div>

            {/* RIGHT SIDE: ICONS + ACCORDION TOGGLE */}
            <div className="flex items-center gap-3">

              {/* EDIT ICON */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onEditTopic(topic);
                }}
                className="p-1 hover:bg-gray-200 rounded"
                title="Edit"
              >
                <Edit3 className="w-5 h-5 text-blue-600" />
              </button>

              {/* DELETE ICON */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteTopic(topic.id);
                }}
                className="p-1 hover:bg-gray-200 rounded"
                title="Delete"
              >
                <Trash2 className="w-5 h-5 text-red-600" />
              </button>

              {/* ACCORDION TOGGLE BUTTON */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleAccordion(i);
                }}
                className="text-xl font-bold px-2"
              >
                {openIndex === i ? "−" : "+"}
              </button>
            </div>
          </div>

          {/* ACCORDION BODY */}
          {openIndex === i && (
            <div className="px-4 pb-4 text-sm text-gray-600 border-t bg-white">
              <p>No extra details yet…</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
