import { useState } from "react";

export default function TopicsAccordion({ topics }) {
  const [openIndex, setOpenIndex] = useState(null);

  const toggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="w-full mt-4">
      {topics.map((topic, index) => (
        <div
          key={topic.id}
          className="border border-gray-300 rounded-2xl mb-3 overflow-hidden"
        >
          {/* Header */}
          <button
            onClick={() => toggle(index)}
            className="w-full flex justify-between items-center px-4 py-3 bg-gray-100 hover:bg-gray-200 transition"
          >
            <span className="text-lg font-medium">{topic.title}</span>
            <span className="text-xl">{openIndex === index ? "−" : "+"}</span>
          </button>

          {/* Body */}
          {openIndex === index && (
            <div className="px-4 py-3 bg-white border-t border-gray-300">
              <p className="text-gray-700">{topic.description}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
