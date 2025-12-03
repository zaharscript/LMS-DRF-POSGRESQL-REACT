import { useState } from "react";
import api from "../api";
import TopicsAccordion from "./TopicsAccordion";

export default function SectionAccordion({
  sections,
  onEditSection,
  onDeleteSection,
  onAddTopic,
  onEditTopic,
  onDeleteTopic,
  refresh,
}) {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleTopicCompletion = async (topicId) => {
    const section = sections.find((s) =>
      s.topics.some((t) => t.id === topicId)
    );
    const topic = section.topics.find((t) => t.id === topicId);

    await api.patch(`topics/${topicId}/`, {
      title: topic.title,
      completed: !topic.completed,
      section: section.id,
    });

    refresh();
  };

  return (
    <div className="mt-6">
      {sections.map((sec, i) => {
        const total = sec.topics.length;
        const completed = sec.topics.filter((t) => t.completed).length;
        const pct = total ? Math.round((completed / total) * 100) : 0;

        return (
          <div key={sec.id} className="border rounded-xl mb-4 bg-white">
            <button
              className="w-full flex justify-between px-4 py-3 bg-gray-100"
              onClick={() => setOpenIndex(openIndex === i ? null : i)}
            >
              <span className="font-semibold">{sec.title}</span>
              <span>{openIndex === i ? "−" : "+"}</span>
            </button>

            {/* Progress */}
            <div className="px-4 py-2">
              <div className="h-2 bg-gray-300 rounded">
                <div
                  className="h-2 bg-indigo-600 rounded"
                  style={{ width: `${pct}%` }}
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {completed}/{total} — {pct}%
              </p>
            </div>

            {/* Topics */}
            {openIndex === i && (
              <div className="p-4 border-t">
                <button
                  onClick={() => onEditSection(sec)}
                  className="px-3 py-1 bg-blue-600 text-white rounded mr-2"
                >
                  Edit
                </button>
                <button
                  onClick={() => onDeleteSection(sec.id)}
                  className="px-3 py-1 bg-red-600 text-white rounded mr-2"
                >
                  Delete
                </button>
                <button
                  onClick={() => onAddTopic(sec.id)}
                  className="px-3 py-1 bg-green-600 text-white rounded"
                >
                  + Add Topic
                </button>

                <TopicsAccordion
                  topics={sec.topics}
                  onToggleComplete={toggleTopicCompletion}
                  onEditTopic={onEditTopic}
                  onDeleteTopic={onDeleteTopic}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
