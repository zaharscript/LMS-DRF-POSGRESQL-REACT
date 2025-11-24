import { useState } from "react";

export default function TopicsAccordion({
  topics,
  onEditTopic,
  onDeleteTopic,
  onAddTopic, // NEW callback from SectionAccordion
  sectionId, // NEW: identifies parent section
}) {
  const [openIndex, setOpenIndex] = useState(null);

  const toggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="w-full mt-3">
      {/* Add Topic Button */}
      <button
        onClick={() => onAddTopic(sectionId)}
        className="mb-3 px-3 py-1 bg-violet-600 text-white  hover:bg-violet-700"
      >
        ✏️ Added Topic
      </button>

      {topics.map((topic, index) => (
        <div
          key={topic.id}
          className="border border-gray-300 rounded-xl mb-2 overflow-hidden"
        >
          {/* Topic Header */}
          <button
            onClick={() => toggle(index)}
            className="w-full flex justify-between items-center px-4 py-2 bg-gray-100 hover:bg-gray-200"
          >
            <span className="text-lg">{topic.title}</span>
            <span className="text-xl">{openIndex === index ? "−" : "+"}</span>
          </button>

          {/* Topic Content Area */}
          {openIndex === index && (
            <div className="px-4 py-3 bg-white border-t border-gray-300">
              <div className="flex gap-3">
                <button
                  onClick={() => onEditTopic(topic)}
                  className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Edit
                </button>

                <button
                  onClick={() => onDeleteTopic(topic.id)}
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
