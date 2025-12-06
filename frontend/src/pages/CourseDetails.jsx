// src/pages/CourseDetails.jsx
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { CourseAPI, SectionAPI, TopicAPI } from "../api";
import SectionAccordion from "../components/SectionAccordion";
import NewSectionModal from "../components/NewSectionModal";
import NewTopicModal from "../components/NewTopicModal";
import EditSectionModal from "../components/EditSectionModal";
import EditTopicModal from "../components/EditTopicModal";

export default function CourseDetails() {
  const { id } = useParams(); // expects route: /course/:id
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);

  // modal state
  const [isNewSectionOpen, setIsNewSectionOpen] = useState(false);
  const [isNewTopicOpen, setIsNewTopicOpen] = useState(false);
  const [isEditSectionOpen, setIsEditSectionOpen] = useState(false);
  const [isEditTopicOpen, setIsEditTopicOpen] = useState(false);

  const [targetSectionId, setTargetSectionId] = useState(null);
  const [selectedSection, setSelectedSection] = useState(null);
  const [selectedTopic, setSelectedTopic] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const res = await CourseAPI.retrieve(id);
      setCourse(res.data);
    } catch (err) {
      console.error("Failed load course:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [id]);

  // CRUD helpers
  const handleCreateSection = async (title) => {
    await SectionAPI.create({ title, course: course.id });
    await load();
  };

  const handleCreateTopic = async (sectionId, title) => {
    await TopicAPI.create({ title, section: sectionId });
    await load();
  };

  const handleUpdateSection = async (sectionId, data) => {
    await SectionAPI.update(sectionId, data);
    await load();
  };

  const handleUpdateTopic = async (topicId, data) => {
    await TopicAPI.update(topicId, data);
    await load();
  };

  const handleDeleteSection = async (sectionId) => {
    if (!confirm("Delete this section?")) return;
    await SectionAPI.delete(sectionId);
    await load();
  };

  const handleDeleteTopic = async (topicId) => {
    if (!confirm("Delete this topic?")) return;
    await TopicAPI.delete(topicId);
    await load();
  };

  // Toggle topic completion (fast toggle)
  const handleToggleTopic = async (topic) => {
    await TopicAPI.update(topic.id, {
      title: topic.title,
      completed: !topic.completed,
      section: topic.section,
    });
    await load();
  };

  if (loading) return <p className="p-6">Loading...</p>;
  if (!course) return <p className="p-6">Course not found.</p>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <button onClick={() => navigate("/")} className="text-blue-600 mb-4 hover:underline">
        ← Back
      </button>

      <div className="mb-4">
        <h1 className="text-3xl font-bold">{course.title}</h1>
        <div className="text-sm text-gray-600">
          {course.instructor} {course.provider ? `• ${course.provider}` : ""} • {course.date_joined}
        </div>
      </div>

      <div className="flex gap-3 mb-6">
        <button onClick={() => setIsNewSectionOpen(true)} className="px-4 py-2 bg-green-600 text-white rounded">+ Add Section</button>
        <button onClick={() => { setTargetSectionId(course.sections?.[0]?.id || null); setIsNewTopicOpen(true); }} className="px-4 py-2 bg-purple-600 text-white rounded">+ Add Topic</button>
      </div>

      <SectionAccordion
        sections={course.sections || []}
        onAddTopic={(sectionId) => { setTargetSectionId(sectionId); setIsNewTopicOpen(true); }}
        onEditSection={(section) => { setSelectedSection(section); setIsEditSectionOpen(true); }}
        onDeleteSection={(sectionId) => handleDeleteSection(sectionId)}
        onEditTopic={(topic) => { setSelectedTopic(topic); setIsEditTopicOpen(true); }}
        onDeleteTopic={(topicId) => handleDeleteTopic(topicId)}
        onToggleTopic={handleToggleTopic}
        refresh={load}
      />

      {/* Modals */}
      <NewSectionModal
        isOpen={isNewSectionOpen}
        onClose={() => setIsNewSectionOpen(false)}
        onCreate={async (title) => { await handleCreateSection(title); setIsNewSectionOpen(false); }}
      />

      <NewTopicModal
        isOpen={isNewTopicOpen}
        sectionId={targetSectionId}
        onClose={() => setIsNewTopicOpen(false)}
        onCreate={async (sectionId, title) => { await handleCreateTopic(sectionId, title); setIsNewTopicOpen(false); }}
      />

      {selectedSection && (
        <EditSectionModal
          open={isEditSectionOpen}
          section={selectedSection}
          onClose={() => { setIsEditSectionOpen(false); setSelectedSection(null); }}
          onSave={async (data) => { await handleUpdateSection(data.id, { title: data.title }); setIsEditSectionOpen(false); setSelectedSection(null); }}
        />
      )}

      {selectedTopic && (
        <EditTopicModal
          open={isEditTopicOpen}
          topic={selectedTopic}
          onClose={() => { setIsEditTopicOpen(false); setSelectedTopic(null); }}
          onSave={async (data) => { await handleUpdateTopic(data.id, { title: data.title, description: data.description || "" }); setIsEditTopicOpen(false); setSelectedTopic(null); }}
        />
      )}
    </div>
  );
}
