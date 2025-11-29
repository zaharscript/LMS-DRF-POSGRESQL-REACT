import { useState } from "react";
import TopicsAccordion from "./TopicsAccordion";
import ProgressBar from "./ProgressBar";

export default function SectionAccordion({
  sections,
  setSections,
  onEditSection,
  onDeleteSection,
  onAddTopic,
  onEditTopic,
  onDeleteTopic,
  onToggleTopic,
  onMarkAllComplete,
}) {
  const [openIndex, setOpenIndex] = useState(null);
  const toggleSection = (i) => setOpenIndex(openIndex === i ? null : i);

  const calcProgress = (sec) => {
    const total = (sec.topics || []).length;
    const done = (sec.topics || []).filter((t) => t.completed).length;
    const percent = total ? Math.round((done / total) * 100) : 0;
    return { total, done, percent };
  };

  // Allow SectionAccordion to receive updated topics and update local sections
  const handleSetSectionTopics = (sectionId, newTopics) => {
    setSections((prev) =>
      prev.map((s) => (s.id === sectionId ? { ...s, topics: newTopics } : s))
    );
  };

  return (
    <div className="mt-4 space-y-4">
      {sections.map((sec, idx) => {
        const progress = calcProgress(sec);
        return (
          <div
            key={sec.id}
            className="border rounded-2xl overflow-hidden bg-white"
          >
            <div className="flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => toggleSection(idx)}
                  className="p-1 rounded hover:bg-gray-200"
                >
                  <span className="text-xl">
                    {openIndex === idx ? "−" : "+"}
                  </span>
                </button>
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-xl font-semibold">{sec.title}</h3>

                    {/* Section Progress */}
                    {sec.topics.length > 0 && (
                      <span className="text-sm text-gray-600">
                        {sec.topics.filter((t) => t.completed).length} /{" "}
                        {sec.topics.length}
                      </span>
                    )}
                  </div>

                  {/* Progress Bar */}
                  {sec.topics.length > 0 && (
                    <ProgressBar
                      percent={
                        (sec.topics.filter((t) => t.completed).length /
                          sec.topics.length) *
                        100
                      }
                    />
                  )}

                  <div className="text-sm text-gray-500">
                    {progress.done}/{progress.total} topics
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-40">
                  <div className="bg-gray-200 h-2 rounded-full overflow-hidden">
                    <div
                      className="h-2 bg-indigo-600 transition-all"
                      style={{ width: `${progress.percent}%` }}
                    />
                  </div>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onMarkAllComplete && onMarkAllComplete(sec.id);
                  }}
                  title="Mark all complete"
                  className="px-2 py-1 rounded hover:bg-gray-100 text-sm"
                >
                  Mark all
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onEditSection(sec);
                  }}
                  className="px-2 py-1 rounded hover:bg-gray-100 text-sm"
                >
                  Edit
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteSection(sec.id);
                  }}
                  className="px-2 py-1 rounded hover:bg-gray-100 text-sm text-red-600"
                >
                  Delete
                </button>
              </div>
            </div>

            {openIndex === idx && (
              <div className="p-4">
                <div className="flex justify-end mb-3">
                  <button
                    onClick={() => onAddTopic(sec.id)}
                    className="px-3 py-1 bg-violet-600 text-white rounded hover:bg-violet-700"
                  >
                    + Add Topic
                  </button>
                </div>

                <TopicsAccordion
                  topics={sec.topics || []}
                  sectionId={sec.id}
                  onEditTopic={onEditTopic}
                  onDeleteTopic={onDeleteTopic}
                  onToggleComplete={(topic) =>
                    onToggleTopic && onToggleTopic(topic, sec.id)
                  }
                  onReorder={(newTopics) =>
                    handleSetSectionTopics(sec.id, newTopics)
                  }
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
