import { useState } from "react";
import TopicsAccordion from "./TopicsAccordion";

export default function SectionAccordion({
  sections,
  onEditSection,
  onDeleteSection,
  onAddTopic,
  onEditTopic,
  onDeleteTopic,
}) {
  const [openIndex, setOpenIndex] = useState(null);

  const toggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="w-full mt-4">
      {sections.map((sec, index) => (
        <div
          key={sec.id}
          className="border border-gray-300 rounded-2xl mb-3 overflow-hidden"
        >
          {/* Section Header */}
          <button
            onClick={() => toggle(index)}
            className="w-full flex justify-between items-center px-4 py-3 bg-gray-100 hover:bg-gray-200 transition"
          >
            <span className="text-lg font-semibold">{sec.title}</span>
            <span className="text-xl">{openIndex === index ? "−" : "+"}</span>
          </button>

          {/* Section Body */}
          {openIndex === index && (
            <div className="p-4 bg-white border-t border-gray-300">
              {/* Section Controls */}
              <div className="flex gap-4 mb-3">
                <button
                  onClick={() => onEditSection(sec)}
                  className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Edit Section
                </button>

                <button
                  onClick={() => onDeleteSection(sec.id)}
                  className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Delete Section
                </button>

                <button
                  onClick={() => onAddTopic(sec.id)}
                  className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                >
                  + Add Topic
                </button>
              </div>

              {/* Topics */}
              <h4 className="text-xl font-bold mb-2">Topics</h4>

              {sec.topics.length > 0 ? (
                <TopicsAccordion
                  topics={sec.topics}
                  sectionId={sec.id}
                  onEditTopic={onEditTopic}
                  onDeleteTopic={onDeleteTopic}
                />
              ) : (
                <p className="text-gray-500">No topics in this section.</p>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
