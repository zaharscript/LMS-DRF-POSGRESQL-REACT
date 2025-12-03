import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../api";

import SectionAccordion from "../components/SectionAccordion";
import EditSectionModal from "../components/EditSectionModal";
import EditTopicModal from "../components/EditTopicModal";
import NewSectionModal from "../components/NewSectionModal";
import NewTopicModal from "../components/NewTopicModal";

export default function CourseDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);

  const [openEditSection, setOpenEditSection] = useState(false);
  const [openEditTopic, setOpenEditTopic] = useState(false);
  const [openNewSection, setOpenNewSection] = useState(false);
  const [openNewTopic, setOpenNewTopic] = useState(false);

  const [selectedSection, setSelectedSection] = useState(null);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [targetSectionId, setTargetSectionId] = useState(null);

  useEffect(() => {
    loadCourse();
  }, [id]);

  const loadCourse = async () => {
    try {
      const res = await api.get(`courses/${id}/`);
      setCourse(res.data);
    } catch (err) {
      console.error("Error fetching course:", err);
    }
  };

  // CRUD
  const createSection = async (title) => {
    await api.post("sections/", { title, course: id });
    loadCourse();
  };

  const createTopic = async (title) => {
    await api.post("topics/", { title, section: targetSectionId });
    loadCourse();
  };

  const deleteSection = async (sid) => {
    await api.delete(`sections/${sid}/`);
    loadCourse();
  };

  const deleteTopic = async (tid) => {
    await api.delete(`topics/${tid}/`);
    loadCourse();
  };

  if (!course) return <p className="p-6">Loading...</p>;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <button onClick={() => navigate("/")} className="text-blue-600 mb-4">
        ← Back to Dashboard
      </button>

      <h2 className="text-3xl font-bold">{course.title}</h2>
      <p className="text-gray-600">Instructor: {course.instructor}</p>

      <button
        onClick={() => setOpenNewSection(true)}
        className="mt-6 px-4 py-2 bg-green-600 text-white rounded"
      >
        + Add Section
      </button>

      <SectionAccordion
        sections={course.sections}
        onEditSection={(s) => {
          setSelectedSection(s);
          setOpenEditSection(true);
        }}
        onDeleteSection={deleteSection}
        onAddTopic={(sid) => {
          setTargetSectionId(sid);
          setOpenNewTopic(true);
        }}
        onEditTopic={(t) => {
          setSelectedTopic(t);
          setOpenEditTopic(true);
        }}
        onDeleteTopic={deleteTopic}
        refresh={loadCourse}
      />

      {/* Modals */}
      <NewSectionModal
        isOpen={openNewSection}
        onClose={() => setOpenNewSection(false)}
        onCreate={createSection}
      />

      <NewTopicModal
        isOpen={openNewTopic}
        onClose={() => setOpenNewTopic(false)}
        onCreate={createTopic}
      />

      {selectedSection && (
        <EditSectionModal
          open={openEditSection}
          onClose={() => setOpenEditSection(false)}
          section={selectedSection}
          onSave={async (data) => {
            await api.patch(`sections/${data.id}/`, { title: data.title });
            loadCourse();
          }}
        />
      )}

      {selectedTopic && (
        <EditTopicModal
          open={openEditTopic}
          onClose={() => setOpenEditTopic(false)}
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
