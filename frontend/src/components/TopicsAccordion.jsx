import { useState } from "react";
import { Pencil, Trash2, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function TopicsAccordion({
  topics,
  onToggleComplete,
  onEditTopic,
  onDeleteTopic,
}) {
  // Track one open topic by its id
  const [openTopicId, setOpenTopicId] = useState(null);

  const toggleOpen = (id) => {
    setOpenTopicId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="space-y-2">
      {topics.map((topic) => {
        const isOpen = openTopicId === topic.id;
        return (
          <div
            key={topic.id}
            className="border rounded-lg bg-white shadow-sm hover:shadow transition"
          >
            {/* ---------- ROW HEADER ---------- */}
            <div className="flex items-center justify-between px-4 py-2">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={topic.completed}
                  onChange={(e) => {
                    e.stopPropagation();
                    onToggleComplete(topic);
                  }}
                  className="w-4 h-4 cursor-pointer"
                />
                <span
                  onClick={() => toggleOpen(topic.id)}
                  className={`text-sm cursor-pointer ${
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
                  onClick={() => toggleOpen(topic.id)}
                  className={`w-5 h-5 transition cursor-pointer ${
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
