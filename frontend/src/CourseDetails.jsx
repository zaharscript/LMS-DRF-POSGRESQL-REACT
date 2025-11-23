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

  // --- Modal States ---
  const [isEditSectionOpen, setIsEditSectionOpen] = useState(false);
  const [isEditTopicOpen, setIsEditTopicOpen] = useState(false);
  const [isNewSectionOpen, setIsNewSectionOpen] = useState(false);
  const [isNewTopicOpen, setIsNewTopicOpen] = useState(false);

  const [selectedSection, setSelectedSection] = useState(null);
  const [selectedTopic, setSelectedTopic] = useState(null);

  // For NEW topic → needs to know which section it belongs to
  const [targetSectionId, setTargetSectionId] = useState(null);

  // Load course details
  useEffect(() => {
    loadCourse();
  }, [courseId]);

  const loadCourse = () => {
    api.get(`courses/${courseId}/`).then((res) => setCourse(res.data));
  };

  if (!course) return <p>Loading...</p>;

  // ========== CREATE SECTION ==========
  const createSection = (title) => {
    api
      .post("sections/", { title, course: course.id })
      .then(() => loadCourse());
  };

  // ========== CREATE TOPIC ==========
  const createTopic = (title) => {
    api
      .post("topics/", { title, section: targetSectionId })
      .then(() => loadCourse());
  };

  // ========== DELETE SECTION ==========
  const deleteSection = (sectionId) => {
    if (!confirm("Delete this section?")) return;
    api.delete(`sections/${sectionId}/`).then(() => loadCourse());
  };

  // ========== DELETE TOPIC ==========
  const deleteTopic = (topicId) => {
    if (!confirm("Delete this topic?")) return;
    api.delete(`topics/${topicId}/`).then(() => loadCourse());
  };

  // ========== OPEN EDIT SECTION ==========
  const openEditSection = (section) => {
    setSelectedSection(section);
    setIsEditSectionOpen(true);
  };

  // ========== OPEN EDIT TOPIC ==========
  const openEditTopic = (topic) => {
    setSelectedTopic(topic);
    setIsEditTopicOpen(true);
  };

  // ========== OPEN NEW TOPIC MODAL ==========
  const openNewTopic = (sectionId) => {
    setTargetSectionId(sectionId);
    setIsNewTopicOpen(true);
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      {/* Back Button */}
      <button onClick={onBack} className="mb-6 text-blue-600 hover:underline">
        ← Back
      </button>

      {/* Course Info */}
      <h2 className="text-3xl font-bold">{course.title}</h2>
      <p className="text-gray-700">Instructor: {course.instructor}</p>
      <p className="text-gray-700">Date Joined: {course.date_joined}</p>

      {/* Add Section Button */}
      <button
        onClick={() => setIsNewSectionOpen(true)}
        className="mt-6 px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700"
      >
        + Add New Section
      </button>

      {/* Sections Accordion */}
      <h3 className="text-2xl font-semibold mt-6 mb-2">Sections</h3>

      <SectionAccordion
        sections={course.sections}
        onDeleteSection={deleteSection}
        onEditSection={openEditSection}
        onAddTopic={openNewTopic}
        onEditTopic={openEditTopic}
        onDeleteTopic={deleteTopic}
      />

      {/* =================== MODALS =================== */}

      {/* NEW SECTION */}
      <NewSectionModal
        isOpen={isNewSectionOpen}
        onClose={() => setIsNewSectionOpen(false)}
        onCreate={createSection}
      />

      {/* NEW TOPIC */}
      <NewTopicModal
        isOpen={isNewTopicOpen}
        onClose={() => setIsNewTopicOpen(false)}
        onCreate={createTopic}
      />

      {/* EDIT SECTION */}
      {selectedSection && (
        <EditSectionModal
          isOpen={isEditSectionOpen}
          onClose={() => setIsEditSectionOpen(false)}
          section={selectedSection}
          onUpdated={loadCourse}
        />
      )}

      {/* EDIT TOPIC */}
      {selectedTopic && (
        <EditTopicModal
          isOpen={isEditTopicOpen}
          onClose={() => setIsEditTopicOpen(false)}
          topic={selectedTopic}
          onUpdated={loadCourse}
        />
      )}
    </div>
  );
}
