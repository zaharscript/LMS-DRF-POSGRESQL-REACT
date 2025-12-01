import { useState } from "react";

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
    <div>
      {topics.map((topic, i) => (
        <div
          key={topic.id}
          className="border rounded-lg mb-2 overflow-hidden bg-gray-50"
        >
          <button
            onClick={() => toggle(i)}
            className="w-full flex justify-between px-4 py-2"
          >
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={topic.completed}
                onChange={() => onToggleComplete(topic.id)}
              />
              <span
                className={`${
                  topic.completed ? "line-through text-gray-500" : ""
                }`}
              >
                {topic.title}
              </span>
            </div>

            <span>{openIndex === i ? "−" : "+"}</span>
          </button>

          {openIndex === i && (
            <div className="px-4 py-3 bg-white border-t">
              <button
                onClick={() => onEditTopic(topic)}
                className="px-3 py-1 mr-2 bg-blue-600 text-white rounded"
              >
                Edit
              </button>
              <button
                onClick={() => onDeleteTopic(topic.id)}
                className="px-3 py-1 bg-red-600 text-white rounded"
              >
                Delete
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
