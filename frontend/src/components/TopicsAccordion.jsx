import { useState } from "react";
import { Pencil, Trash2, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function TopicsAccordion({
  topics,
  onToggleComplete,
  onEditTopic,
  onDeleteTopic,
}) {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <div className="space-y-2">
      {topics.map((topic, i) => {
        const isOpen = openIndex === i;

        return (
          <div
            key={topic.id}
            className="border rounded-lg bg-white shadow-sm hover:shadow transition"
          >
            {/* ---------- ROW HEADER ---------- */}
            <div
              className="flex items-center justify-between px-4 py-2 cursor-pointer"
              onClick={() => setOpenIndex(isOpen ? null : i)}
            >
              <div className="flex items-center gap-3">
                {/* Checkbox MUST STOP CLICK BUBBLING */}
                <input
                  type="checkbox"
                  checked={topic.completed}
                  onChange={(e) => {
                    e.stopPropagation(); // FIX #1
                    onToggleComplete(topic.id);
                  }}
                 onChange={(e) => { e.stopPropagation(); onToggleComplete?.(topic); }} // FIX #2
                  className="w-4 h-4"
                />

                <span
                  className={`text-sm ${
                    topic.completed ? "line-through text-gray-500" : ""
                  }`}
                >
                  {topic.title}
                </span>
              </div>

              <div className="flex items-center gap-3">
                {/* Edit */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onEditTopic(topic);
                  }}
                  className="p-1 hover:bg-blue-50 rounded"
                >
                  <Pencil className="w-5 h-5 text-blue-600" />
                </button>

                {/* Delete */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteTopic(topic.id);
                  }}
                  className="p-1 hover:bg-red-50 rounded"
                >
                  <Trash2 className="w-5 h-5 text-red-600" />
                </button>

                {/* Toggle arrow */}
                <ChevronDown
                  className={`w-5 h-5 transition ${
                    isOpen ? "rotate-180" : ""
                  }`}
                />
              </div>
            </div>

            {/* ---------- COLLAPSIBLE DESCRIPTION ---------- */}
            <AnimatePresence>
              {isOpen && topic.description && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="px-4 pb-3 text-sm text-gray-600 bg-gray-50 border-t"
                >
                  {topic.description}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
