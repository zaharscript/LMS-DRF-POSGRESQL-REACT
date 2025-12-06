// src/components/TopicsAccordion.jsx
import { useState } from "react";

export default function TopicsAccordion({
  topics = [],
  onToggleComplete,
  onEditTopic,
  onDeleteTopic,
}) {
  const [openIndex, setOpenIndex] = useState(null);
  const toggle = (i) => setOpenIndex(openIndex === i ? null : i);

  return (
    <div className="space-y-2">
      {topics.map((topic, i) => (
        <div key={topic.id} className="border rounded-lg overflow-hidden bg-gray-50">
          <button onClick={() => toggle(i)} className="w-full flex items-center justify-between px-4 py-2">
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={!!topic.completed}
                onChange={(e) => { e.stopPropagation(); onToggleComplete?.(topic); }}
                className="w-4 h-4"
              />
              <span className={`${topic.completed ? "line-through text-gray-500" : ""}`}>{topic.title}</span>
            </div>

            <div>{openIndex === i ? "−" : "+"}</div>
          </button>

          {openIndex === i && (
            <div className="px-4 py-3 bg-white border-t flex gap-2">
              <button onClick={() => onEditTopic?.(topic)} className="px-3 py-1 bg-blue-600 text-white rounded">Edit</button>
              <button onClick={() => onDeleteTopic?.(topic.id)} className="px-3 py-1 bg-red-600 text-white rounded">Delete</button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
