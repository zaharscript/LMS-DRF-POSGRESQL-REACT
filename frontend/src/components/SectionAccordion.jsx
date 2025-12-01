import { useState } from "react";
import api from "../api";
import TopicsAccordion from "./TopicsAccordion";

export default function SectionAccordion({
  sections,
  onAddTopic,
  onEditSection,
  onDeleteSection,
  onEditTopic,
  onDeleteTopic,
  refresh,
}) {
  const [openIndex, setOpenIndex] = useState(null);

  const toggle = (i) => {
    setOpenIndex(openIndex === i ? null : i);
  };

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
      {sections.map((sec, index) => {
        const total = sec.topics.length;
        const completed = sec.topics.filter((t) => t.completed).length;
        const pct = total === 0 ? 0 : Math.round((completed / total) * 100);

        return (
          <div
            key={sec.id}
            className="border rounded-xl mb-3 overflow-hidden bg-white"
          >
            <button
              onClick={() => toggle(index)}
              className="w-full flex justify-between px-4 py-3 bg-gray-100"
            >
              <span className="font-semibold">{sec.title}</span>
              <span>{openIndex === index ? "−" : "+"}</span>
            </button>

            {/* Progress */}
            <div className="px-4 pt-2">
              <div className="h-2 bg-gray-300 rounded">
                <div
                  className="h-2 bg-purple-600 rounded"
                  style={{ width: `${pct}%` }}
                />
              </div>
              <p className="text-sm text-gray-500 mt-1">
                {completed}/{total} completed ({pct}%)
              </p>
            </div>

            {openIndex === index && (
              <div className="p-4 border-t">
                <div className="flex gap-3 mb-4">
                  <button
                    onClick={() => onEditSection(sec)}
                    className="px-3 py-1 bg-blue-600 text-white rounded"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => onDeleteSection(sec.id)}
                    className="px-3 py-1 bg-red-600 text-white rounded"
                  >
                    Delete
                  </button>

                  <button
                    onClick={() => onAddTopic(sec.id)}
                    className="px-3 py-1 bg-purple-600 text-white rounded"
                  >
                    + Add Topic
                  </button>
                </div>

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
