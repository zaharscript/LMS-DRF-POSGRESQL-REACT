// src/pages/CourseDetails.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import api from "../api";

import MainLayout from "../layout/MainLayout";
import RightPanel from "../components/RightPanel";

import SectionAccordion from "../components/SectionAccordion";
import EditSectionModal from "../components/EditSectionModal";
import EditTopicModal from "../components/EditTopicModal";
import NewSectionModal from "../components/NewSectionModal";
import NewTopicModal from "../components/NewTopicModal";

export default function CourseDetails() {
  const { id } = useParams(); // must match route /course/:id
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

  // Load course on mount
  useEffect(() => {
    loadCourse();
  }, [id]);

  const loadCourse = async () => {
    try {
      const res = await api.get(`courses/${id}/`);
      setCourse(res.data);
    } catch (err) {
      console.error("Failed to load course:", err);
    }
  };

  if (!course) {
    return (
      <MainLayout>
        <p className="p-6 text-gray-600">Loading...</p>
      </MainLayout>
    );
  }

  // ----------- CRUD Actions -----------

  const createSection = async (title) => {
    await api.post("sections/", { title, course: course.id });
    loadCourse();
  };

  const createTopic = async (title) => {
    await api.post("topics/", { title, section: targetSectionId });
    loadCourse();
  };

  const deleteSection = async (sid) => {
    if (!confirm("Delete this section?")) return;
    await api.delete(`sections/${sid}/`);
    loadCourse();
  };

  const deleteTopic = async (tid) => {
    if (!confirm("Delete this topic?")) return;
    await api.delete(`topics/${tid}/`);
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
    <MainLayout
      rightPanel={<RightPanel course={course} onRefresh={loadCourse} />}
    >
      <button
        onClick={() => navigate("/")}
        className="text-indigo-600 mb-4 hover:underline"
      >
        ← Back to Dashboard
      </button>

      <h2 className="text-3xl font-bold">{course.title}</h2>
      <p className="text-gray-600">Instructor: {course.instructor}</p>

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
        refresh={loadCourse}
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
    </MainLayout>
  );
}
