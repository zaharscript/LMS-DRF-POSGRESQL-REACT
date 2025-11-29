import { useState, useEffect } from "react";

export default function TopicsAccordion({
  topics,
  sectionId,
  onEditTopic,
  onDeleteTopic,
  onToggleComplete,
  onAddTopic,
  onReorder, // optional - if you later add drag-and-drop
}) {
  const [openIndex, setOpenIndex] = useState(null);
  const [localTopics, setLocalTopics] = useState(topics || []);

  useEffect(() => {
    setLocalTopics(topics || []);
  }, [topics]);

  const toggle = (i) => setOpenIndex(openIndex === i ? null : i);

  return (
    <div className="w-full mt-3">
      {localTopics.map((topic, index) => (
        <div
          key={topic.id}
          className="border border-gray-300 rounded-xl mb-2 overflow-hidden bg-white"
        >
          <button
            onClick={() => toggle(index)}
            className="w-full flex justify-between items-center px-4 py-2 bg-gray-100 hover:bg-gray-200"
          >
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={!!topic.completed}
                onChange={(e) =>
                  onToggleComplete && onToggleComplete(topic, sectionId)
                }
                className="w-4 h-4"
              />
              <span
                className={`text-lg font-medium ${
                  topic.completed
                    ? "line-through text-gray-500"
                    : "text-gray-900"
                }`}
              >
                {topic.title}
              </span>
            </div>

            <span className="text-xl">{openIndex === index ? "−" : "+"}</span>
          </button>

          {openIndex === index && (
            <div className="px-4 py-3 bg-white border-t border-gray-300">
              <div className="flex gap-3">
                <button
                  onClick={() => onEditTopic && onEditTopic(topic)}
                  className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => onDeleteTopic && onDeleteTopic(topic.id)}
                  className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
