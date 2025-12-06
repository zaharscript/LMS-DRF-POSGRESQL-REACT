// src/components/SectionAccordion.jsx
import { useState } from "react";
import TopicsAccordion from "./TopicsAccordion";

export default function SectionAccordion({
  sections = [],
  onAddTopic,
  onEditSection,
  onDeleteSection,
  onEditTopic,
  onDeleteTopic,
  onToggleTopic,
  refresh,
}) {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleSection = (i) => setOpenIndex(openIndex === i ? null : i);

  return (
    <div className="mt-6 space-y-4">
      {sections.map((sec, idx) => {
        const total = sec.topics?.length || 0;
        const completed = sec.topics?.filter((t) => t.completed).length || 0;
        const pct = total === 0 ? 0 : Math.round((completed / total) * 100);

        return (
          <div key={sec.id} className="border rounded-xl bg-white overflow-hidden">
            <button onClick={() => toggleSection(idx)} className="w-full flex justify-between items-center px-4 py-3 bg-gray-100">
              <div>
                <div className="font-semibold">{sec.title}</div>
                <div className="text-xs text-gray-500 mt-1">{completed}/{total} topics • {pct}%</div>
              </div>
              <div className="text-xl">{openIndex === idx ? "−" : "+"}</div>
            </button>

            <div className="px-4 pt-3 pb-4">
              <div className="h-2 bg-gray-200 rounded overflow-hidden">
                <div className="h-2 bg-indigo-600" style={{ width: `${pct}%` }} />
              </div>
            </div>

            {openIndex === idx && (
              <div className="p-4 border-t">
                <div className="flex gap-3 mb-3">
                  <button onClick={() => onEditSection?.(sec)} className="px-3 py-1 bg-blue-600 text-white rounded">Edit</button>
                  <button onClick={() => onDeleteSection?.(sec.id)} className="px-3 py-1 bg-red-600 text-white rounded">Delete</button>
                  <button onClick={() => onAddTopic?.(sec.id)} className="px-3 py-1 bg-green-600 text-white rounded">+ Add Topic</button>
                </div>

                <TopicsAccordion
                  topics={sec.topics || []}
                  onToggleComplete={(topic) => onToggleTopic?.(topic)}
                  onEditTopic={(topic) => onEditTopic?.(topic)}
                  onDeleteTopic={(topicId) => onDeleteTopic?.(topicId)}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
