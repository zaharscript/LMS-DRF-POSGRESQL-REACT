// src/components/TopicsAccordion.jsx
import { useState } from "react";
import { Pencil, Trash2 } from "lucide-react";

export default function TopicsAccordion({
  topics,
  onToggleComplete,
  onEditTopic,
  onDeleteTopic,
}) {
  const [openIndex, setOpenIndex] = useState(null);

  const toggle = (i) => {
    setOpenIndex(openIndex === i ? null : i);
  };

  return (
    <div className="space-y-2">
      {topics.map((topic, i) => (
        <div
          key={topic.id}
          className="border rounded-lg bg-gray-50 overflow-hidden"
        >
          {/* --- Topic Header Row --- */}
          <div className="flex items-center justify-between px-4 py-2">
            
            {/* LEFT : checkbox + title */}
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={topic.completed}
                onClick={(e) => e.stopPropagation()}   // ★ FIX
                onChange={() => onToggleComplete(topic.id)}
                className="cursor-pointer"
              />

              <span
                onClick={() => toggle(i)}
                className={`cursor-pointer ${
                  topic.completed ? "line-through text-gray-500" : ""
                }`}
              >
                {topic.title}
              </span>
            </div>

            {/* RIGHT : edit + delete icons */}
            <div className="flex items-center gap-3">
              <Pencil
                size={20}
                className="text-blue-600 cursor-pointer hover:text-blue-800"
                onClick={(e) => {
                  e.stopPropagation();   // ★ FIX
                  onEditTopic(topic);
                }}
              />

              <Trash2
                size={20}
                className="text-red-600 cursor-pointer hover:text-red-800"
                onClick={(e) => {
                  e.stopPropagation();   // ★ FIX
                  onDeleteTopic(topic.id);
                }}
              />

              {/* Expand / Collapse icon */}
              <span
                onClick={(e) => {
                  e.stopPropagation();
                  toggle(i);
                }}
                className="cursor-pointer text-gray-600"
              >
                {openIndex === i ? "−" : "+"}
              </span>
            </div>
          </div>

          {/* --- Accordion Content --- */}
          {openIndex === i && (
            <div className="px-4 py-3 border-t bg-white text-sm text-gray-600">
              No additional details yet.
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
