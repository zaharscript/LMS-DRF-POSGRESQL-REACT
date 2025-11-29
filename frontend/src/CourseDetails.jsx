import { useEffect, useState } from "react";
import api from "./api";

// Components
import SectionAccordion from "./components/SectionAccordion";
import EditSectionModal from "./components/EditSectionModal";
import EditTopicModal from "./components/EditTopicModal";
import NewSectionModal from "./components/NewSectionModal";
import NewTopicModal from "./components/NewTopicModal";
import ProgressBar from "./components/ProgressBar";

export default function CourseDetails({ courseId, onBack }) {
  // ----------------- STATE -----------------
  const [course, setCourse] = useState(null);
  const [sections, setSections] = useState([]);

  const [isEditSectionOpen, setIsEditSectionOpen] = useState(false);
  const [isEditTopicOpen, setIsEditTopicOpen] = useState(false);
  const [isNewSectionOpen, setIsNewSectionOpen] = useState(false);
  const [isNewTopicOpen, setIsNewTopicOpen] = useState(false);

  const [selectedSection, setSelectedSection] = useState(null);
  const [selectedTopic, setSelectedTopic] = useState(null);

  const [targetSectionId, setTargetSectionId] = useState(null);

  // ----------------- LOAD COURSE -----------------
  useEffect(() => {
    loadCourse();
  }, [courseId]);

  const loadCourse = () => {
    api.get(`courses/${courseId}/`).then((res) => {
      setCourse(res.data);
      setSections(res.data.sections || []);
    });
  };

  if (!course) {
    return <p>Loading...</p>;
  }

  // ----------------- CREATE SECTION -----------------
  const createSection = (title) => {
    api.post("sections/", { title, course: course.id }).then(loadCourse);
  };

  // ----------------- CREATE TOPIC -----------------
  const createTopic = (title) => {
    api.post("topics/", { title, section: targetSectionId }).then(loadCourse);
  };

  // ----------------- DELETE SECTION -----------------
  const deleteSection = (sectionId) => {
    if (!confirm("Delete this section?")) return;
    api.delete(`sections/${sectionId}/`).then(loadCourse);
  };

  // ----------------- DELETE TOPIC -----------------
  const deleteTopic = (topicId) => {
    if (!confirm("Delete this topic?")) return;
    api.delete(`topics/${topicId}/`).then(loadCourse);
  };

  // ----------------- MODAL OPEN HANDLERS -----------------
  const openEditSection = (section) => {
    setSelectedSection(section);
    setIsEditSectionOpen(true);
  };

  const openEditTopic = (topic) => {
    setSelectedTopic(topic);
    setIsEditTopicOpen(true);
  };

  const openNewTopic = (sectionId) => {
    setTargetSectionId(sectionId);
    setIsNewTopicOpen(true);
  };

  // ----------------- EDIT SAVE HANDLERS -----------------
  const saveEditedSection = async (data) => {
    await api.patch(`sections/${data.id}/`, { title: data.title });
    setIsEditSectionOpen(false);
    setSelectedSection(null);
    loadCourse();
  };

  const saveEditedTopic = async (data) => {
    await api.patch(`topics/${data.id}/`, {
      title: data.title,
      completed: data.completed,
      section: data.section,
    });

    setIsEditTopicOpen(false);
    setSelectedTopic(null);
    loadCourse();
  };
  // ----------------- TOGGLE LOGIC -----------------

  const toggleTopicCompletion = async (topic, sectionId) => {
    const updated = {
      title: topic.title,
      completed: !topic.completed,
      section: sectionId,
    };

    await api.put(`topics/${topic.id}/`, updated);

    // Reload entire course or update local state
    loadCourse();
  };

  // ----------------- RENDER -----------------
  return (
    <div className="p-6 max-w-3xl mx-auto">
      <button onClick={onBack} className="mb-6 text-blue-600 hover:underline">
        ← Back
      </button>

      <h2 className="text-3xl font-bold">{course.title}</h2>
      {/* COURSE PROGRESS */}
      <div className="mt-4">
        <p className="text-sm text-gray-600 mb-1">Overall Progress</p>

        <ProgressBar
          percent={
            course.sections.length === 0
              ? 0
              : (() => {
                  const allTopics = course.sections.flatMap((s) => s.topics);
                  if (allTopics.length === 0) return 0;
                  const completed = allTopics.filter((t) => t.completed).length;
                  return (completed / allTopics.length) * 100;
                })()
          }
        />
      </div>

      <p className="text-gray-700">Instructor: {course.instructor}</p>
      <p className="text-gray-700">Date Joined: {course.date_joined}</p>

      <button
        onClick={() => setIsNewSectionOpen(true)}
        className="mt-6 px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700"
      >
        + Add New Section
      </button>

      <h3 className="text-2xl font-semibold mt-6 mb-2">Sections</h3>

      <SectionAccordion
        sections={sections}
        setSections={setSections}
        onDeleteSection={deleteSection}
        onEditSection={openEditSection}
        onAddTopic={openNewTopic}
        onEditTopic={openEditTopic}
        onDeleteTopic={deleteTopic}
        onToggleTopic={toggleTopicCompletion}
      />

      {/* ----- Modals ----- */}

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
