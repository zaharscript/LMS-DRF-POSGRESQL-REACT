import { TopicAPI } from "../api";
import TopicsAccordion from "./TopicsAccordion";

export default function SectionAccordion({
  sections,
  onAddSection,
  onAddTopic,
  onEditSection,
  onEditTopic,
  onDeleteSection,
  onDeleteTopic,
  refresh,
}) {
  const toggleTopic = async (topic) => {
    await TopicAPI.update(topic.id, {
      title: topic.title,
      completed: !topic.completed,
      section: topic.section,
    });
    refresh();
  };

  return (
    <div className="mt-6">
      {sections.map((sec) => (
        <div key={sec.id} className="border rounded p-4 mb-3 bg-white">
          <h3 className="font-bold text-lg mb-2">{sec.title}</h3>

          <TopicsAccordion
            topics={sec.topics}
            onToggleComplete={toggleTopic}
            onEditTopic={onEditTopic}
            onDeleteTopic={onDeleteTopic}
          />

          <button
            className="mt-3 text-sm px-3 py-1 bg-blue-600 text-white rounded"
            onClick={() => onAddTopic(sec.id)}
          >
            + Add Topic
          </button>
        </div>
      ))}
    </div>
  );
}
