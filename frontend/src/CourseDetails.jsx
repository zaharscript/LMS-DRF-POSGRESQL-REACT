import { useEffect, useState } from "react";
import api from "./api";

// Components
import SectionAccordion from "./components/SectionAccordion";
import EditSectionModal from "./components/EditSectionModal";
import EditTopicModal from "./components/EditTopicModal";
import NewSectionModal from "./components/NewSectionModal";
import NewTopicModal from "./components/NewTopicModal";

export default function CourseDetails({ courseId, onBack }) {
  const [course, setCourse] = useState(null);

  // Isolated sections state (needed for instant checkbox updates)
  const [sections, setSections] = useState([]);

  // Modal states
  const [isEditSectionOpen, setIsEditSectionOpen] = useState(false);
  const [isEditTopicOpen, setIsEditTopicOpen] = useState(false);
  const [isNewSectionOpen, setIsNewSectionOpen] = useState(false);
  const [isNewTopicOpen, setIsNewTopicOpen] = useState(false);

  // Selected items
  const [selectedSection, setSelectedSection] = useState(null);
  const [selectedTopic, setSelectedTopic] = useState(null);

  // For creating new topic → must know the section ID
  const [targetSectionId, setTargetSectionId] = useState(null);

  // -------------------------------
  // Load the course on mount
  // -------------------------------
  useEffect(() => {
    loadCourse();
  }, [courseId]);

  const loadCourse = () => {
    api.get(`courses/${courseId}/`).then((res) => {
      setCourse(res.data);
      setSections(res.data.sections); // Keep "sections" usable by accordions
    });
  };

  if (!course) return <p>Loading...</p>;

  // -------------------------------
  // CREATE SECTION
  // -------------------------------
  const createSection = (title) => {
    api
      .post("sections/", { title, course: course.id })
      .then(() => loadCourse());
  };

  // -------------------------------
  // CREATE TOPIC
  // -------------------------------
  const createTopic = (title) => {
    api
      .post("topics/", { title, section: targetSectionId })
      .then(() => loadCourse());
  };

  // -------------------------------
  // DELETE SECTION
  // -------------------------------
  const deleteSection = (sectionId) => {
    if (!confirm("Delete this section?")) return;
    api.delete(`sections/${sectionId}/`).then(() => loadCourse());
  };

  // -------------------------------
  // DELETE TOPIC
  // -------------------------------
  const deleteTopic = (topicId) => {
    if (!confirm("Delete this topic?")) return;
    api.delete(`topics/${topicId}/`).then(() => loadCourse());
  };

  // -------------------------------
  // Open Edit Section Modal
  // -------------------------------
  const openEditSection = (section) => {
    setSelectedSection(section);
    setIsEditSectionOpen(true);
  };

  // -------------------------------
  // Open Edit Topic Modal
  // -------------------------------
  const openEditTopic = (topic) => {
    setSelectedTopic(topic);
    setIsEditTopicOpen(true);
  };

  // -------------------------------
  // Open NEW Topic Modal
  // -------------------------------
  const openNewTopic = (sectionId) => {
    setTargetSectionId(sectionId);
    setIsNewTopicOpen(true);
  };

  // -------------------------------
  // Save Edited Section
  // -------------------------------
  const saveEditedSection = async (updated) => {
    try {
      await api.patch(`sections/${updated.id}/`, {
        title: updated.title,
      });
      setIsEditSectionOpen(false);
      setSelectedSection(null);
      loadCourse();
    } catch (err) {
      alert("Failed to save section");
    }
  };

  // -------------------------------
  // Save Edited Topic
  // -------------------------------
  const saveEditedTopic = async (updated) => {
    try {
      await api.patch(`topics/${updated.id}/`, {
        title: updated.title,
        description: updated.description || "",
      });
      setIsEditTopicOpen(false);
      setSelectedTopic(null);
      loadCourse();
    } catch (err) {
      alert("Failed to save topic");
    }
  };

  const toggleTopicCompletion = async (topic, sectionId) => {
    const response = await api.patch(`topics/${topic.id}/`, {
      title: topic.title,
      completed: !topic.completed,
      section: sectionId,
    });

    // Update UI instantly without reload
    setSections((prev) =>
      prev.map((s) =>
        s.id === sectionId
          ? {
              ...s,
              topics: s.topics.map((t) =>
                t.id === topic.id ? response.data : t
              ),
            }
          : s
      )
    );
  };

  // ===========================================================
  // RENDER PAGE
  // ===========================================================
  return (
    <div className="p-6 max-w-3xl mx-auto">
      {/* Back Button */}
      <button onClick={onBack} className="mb-6 text-blue-600 hover:underline">
        ← Back
      </button>

      {/* Course Info */}
      <h1 className="text-4xl font-bold mb-2">{course.title}</h1>
      <p className="text-gray-700">Instructor: {course.instructor}</p>
      <p className="text-gray-700">Provider: {course.provider}</p>
      <p className="text-gray-700">Date Joined: {course.date_joined}</p>

      {/* Add New Section */}
      <button
        onClick={() => setIsNewSectionOpen(true)}
        className="mt-6 px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700"
      >
        + Add New Section
      </button>

      {/* Sections */}
      <h3 className="text-2xl font-semibold mt-6 mb-2">Sections</h3>

      <SectionAccordion
        sections={sections}
        setSections={setSections}
        onEditSection={openEditSection}
        onDeleteSection={deleteSection}
        onAddTopic={openNewTopic}
        onEditTopic={openEditTopic}
        onDeleteTopic={deleteTopic}
        onToggleTopic={toggleTopicCompletion}
      />

      {/* ============ MODALS ============ */}

      <NewSectionModal
        isOpen={isNewSectionOpen}
        onClose={() => setIsNewSectionOpen(false)}
        onCreate={createSection}
      />

      <NewTopicModal
        isOpen={isNewTopicOpen}
        onClose={() => setIsNewTopicOpen(false)}
        onCreate={createTopic}
      />

      {selectedSection && (
        <EditSectionModal
          open={isEditSectionOpen}
          onClose={() => {
            setIsEditSectionOpen(false);
            setSelectedSection(null);
          }}
          section={selectedSection}
          onSave={saveEditedSection}
        />
      )}

      {selectedTopic && (
        <EditTopicModal
          open={isEditTopicOpen}
          onClose={() => {
            setIsEditTopicOpen(false);
            setSelectedTopic(null);
          }}
          topic={selectedTopic}
          onSave={saveEditedTopic}
        />
      )}
    </div>
  );
}
