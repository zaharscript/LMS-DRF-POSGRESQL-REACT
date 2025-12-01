// src/CourseDetails.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "./api";

import SectionAccordion from "./components/SectionAccordion";
import EditSectionModal from "./components/EditSectionModal";
import EditTopicModal from "./components/EditTopicModal";
import NewSectionModal from "./components/NewSectionModal";
import NewTopicModal from "./components/NewTopicModal";

export default function CourseDetails() {
  const { courseId } = useParams(); // ✓ Get URL param
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);

  // Modals
  const [isEditSectionOpen, setIsEditSectionOpen] = useState(false);
  const [isEditTopicOpen, setIsEditTopicOpen] = useState(false);
  const [isNewSectionOpen, setIsNewSectionOpen] = useState(false);
  const [isNewTopicOpen, setIsNewTopicOpen] = useState(false);

  const [selectedSection, setSelectedSection] = useState(null);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [targetSectionId, setTargetSectionId] = useState(null);

  // Load course
  useEffect(() => {
    loadCourse();
  }, [courseId]);

  const loadCourse = async () => {
    try {
      const res = await api.get(`courses/${courseId}/`);
      setCourse(res.data);
    } catch (err) {
      console.error("Failed to load course:", err);
    }
  };

  if (!course) return <p className="p-6">Loading...</p>;

  // ----- CRUD operations -----

  const createSection = async (title) => {
    await api.post("sections/", { title, course: course.id });
    loadCourse();
  };

  const createTopic = async (title) => {
    await api.post("topics/", { title, section: targetSectionId });
    loadCourse();
  };

  const deleteSection = async (id) => {
    if (!confirm("Delete this section?")) return;
    await api.delete(`sections/${id}/`);
    loadCourse();
  };

  const deleteTopic = async (id) => {
    if (!confirm("Delete this topic?")) return;
    await api.delete(`topics/${id}/`);
    loadCourse();
  };

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

  return (
    <div className="p-6 max-w-3xl mx-auto">
      {/* Back button */}
      <button
        onClick={() => navigate("/dashboard")}
        className="text-blue-600 mb-4 hover:underline"
      >
        ← Back to Dashboard
      </button>

      <h2 className="text-3xl font-bold">{course.title}</h2>
      <p className="text-gray-600">Instructor: {course.instructor}</p>
      <p className="text-gray-600">Date Joined: {course.date_joined}</p>

      <button
        onClick={() => setIsNewSectionOpen(true)}
        className="mt-6 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
      >
        + Add New Section
      </button>

      <h3 className="text-2xl mt-6 mb-2 font-semibold">Sections</h3>

      <SectionAccordion
        sections={course.sections}
        onEditSection={openEditSection}
        onDeleteSection={deleteSection}
        onAddTopic={openNewTopic}
        onEditTopic={openEditTopic}
        onDeleteTopic={deleteTopic}
      />

      {/* Modals */}
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
          onClose={() => setIsEditSectionOpen(false)}
          section={selectedSection}
          onSave={async (data) => {
            await api.patch(`sections/${data.id}/`, { title: data.title });
            loadCourse();
          }}
        />
      )}

      {selectedTopic && (
        <EditTopicModal
          open={isEditTopicOpen}
          onClose={() => setIsEditTopicOpen(false)}
          topic={selectedTopic}
          onSave={async (data) => {
            await api.patch(`topics/${data.id}/`, {
              title: data.title,
              description: data.description,
            });
            loadCourse();
          }}
        />
      )}
    </div>
  );
}
