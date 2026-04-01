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
  const [importing, setImporting] = useState(false);

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

  // Delete course
  const handleDeleteCourse = async () => {
    if (!confirm("Delete this course?\nThis action cannot be undone.")) return;

    try {
      await CourseAPI.delete(course.id);
      navigate("/");
    } catch (err) {
      console.error("Failed to delete course:", err);
      alert("Failed to delete course.");
    }
  };

  // Toggle topic completion (fast toggle)
  const handleToggleTopic = async (topic) => {
    await TopicAPI.update(topic.id, {
      title: topic.title,
      is_completed: !topic.is_completed,
      section: topic.section,
    });
    await load();
  };

  // Syllabus Import
  const handleImportSyllabus = async () => {
    const url = prompt("Enter W3Schools tutorial URL (e.g., https://www.w3schools.com/dsa/dsa_intro.php):");
    if (!url) return;

    setImporting(true);
    try {
      const res = await CourseAPI.importSyllabus(course.id, url);
      setCourse(res.data);
      alert("Syllabus imported successfully!");
    } catch (err) {
      console.error("Import failed:", err);
      alert(err.response?.data?.error || "Failed to import syllabus.");
    } finally {
      setImporting(false);
    }
  };

  if (loading) return <p className="p-6 text-gray-900 dark:text-gray-100">Loading...</p>;
  if (!course) return <p className="p-6 text-gray-900 dark:text-gray-100">Course not found.</p>;

  return (
    <div className="p-6 max-w-4xl mx-auto text-gray-900 dark:text-gray-100">
      <button
        onClick={() => navigate("/")}
        className="text-blue-600 dark:text-blue-400 mb-4 hover:underline flex items-center gap-1"
      >
        ← Back to Dashboard
      </button>

      <div className="mb-6 flex justify-between items-start gap-4">
        <div>
          <h1 className="text-3xl font-bold">{course.title}</h1>
          <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            {course.instructor} {course.provider ? `• ${course.provider}` : ""}{" "}
            • Joined on {course.date_joined}
          </div>
        </div>

        <button
          onClick={handleDeleteCourse}
          className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition"
        >
          Delete Course
        </button>
      </div>

      <div className="flex flex-wrap gap-3 mb-8">
        <button
          onClick={() => setIsNewSectionOpen(true)}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
        >
          + Add Section
        </button>
        <button
          onClick={() => {
            setTargetSectionId(course.sections?.[0]?.id || null);
            setIsNewTopicOpen(true);
          }}
          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
        >
          + Add Topic
        </button>
        <button
          onClick={handleImportSyllabus}
          disabled={importing}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition disabled:opacity-50"
        >
          {importing ? "Importing..." : "⚡ Import from W3Schools"}
        </button>
      </div>

      <SectionAccordion
        sections={course.sections || []}
        onAddTopic={(sectionId) => {
          setTargetSectionId(sectionId);
          setIsNewTopicOpen(true);
        }}
        onEditSection={(section) => {
          setSelectedSection(section);
          setIsEditSectionOpen(true);
        }}
        onDeleteSection={(sectionId) => handleDeleteSection(sectionId)}
        onEditTopic={(topic) => {
          setSelectedTopic(topic);
          setIsEditTopicOpen(true);
        }}
        onDeleteTopic={(topicId) => handleDeleteTopic(topicId)}
        onToggleTopic={handleToggleTopic}
        refresh={load}
      />

      {/* Modals */}
      <NewSectionModal
        isOpen={isNewSectionOpen}
        onClose={() => setIsNewSectionOpen(false)}
        onCreate={async (title) => {
          await handleCreateSection(title);
          setIsNewSectionOpen(false);
        }}
      />

      <NewTopicModal
        isOpen={isNewTopicOpen}
        sectionId={targetSectionId}
        onClose={() => setIsNewTopicOpen(false)}
        onCreate={async (sectionId, title) => {
          await handleCreateTopic(sectionId, title);
          setIsNewTopicOpen(false);
        }}
      />

      {selectedSection && (
        <EditSectionModal
          open={isEditSectionOpen}
          section={selectedSection}
          onClose={() => {
            setIsEditSectionOpen(false);
            setSelectedSection(null);
          }}
          onSave={async (data) => {
            await handleUpdateSection(data.id, { title: data.title });
            setIsEditSectionOpen(false);
            setSelectedSection(null);
          }}
        />
      )}

      {selectedTopic && (
        <EditTopicModal
          open={isEditTopicOpen}
          topic={selectedTopic}
          onClose={() => {
            setIsEditTopicOpen(false);
            setSelectedTopic(null);
          }}
          onSave={async (data) => {
            await handleUpdateTopic(data.id, {
              title: data.title,
              description: data.description || "",
            });
            setIsEditTopicOpen(false);
            setSelectedTopic(null);
          }}
        />
      )}
    </div>
  );
}
