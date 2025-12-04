import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import { CourseAPI, SectionAPI, TopicAPI } from "../api";
import SectionAccordion from "../components/SectionAccordion";

export default function CourseDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);

  useEffect(() => {
    load();
  }, [id]);

  const load = async () => {
    try {
      const res = await CourseAPI.retrieve(id);
      setCourse(res.data);
    } catch (err) {
      console.error("Failed load course:", err);
    }
  };

  const addSection = async (title) => {
    await SectionAPI.create({ title, course: course.id });
    load();
  };

  const addTopic = async (secId, title) => {
    await TopicAPI.create({ title, section: secId });
    load();
  };

  const updateSection = async (id, data) => {
    await SectionAPI.update(id, data);
    load();
  };

  const updateTopic = async (id, data) => {
    await TopicAPI.update(id, data);
    load();
  };

  const deleteSection = async (id) => {
    await SectionAPI.delete(id);
    load();
  };

  const deleteTopic = async (id) => {
    await TopicAPI.delete(id);
    load();
  };

  if (!course) return <p className="p-6">Loading...</p>;

  return (
    <div className="p-6">
      <button onClick={() => navigate("/")} className="text-blue-600">
        ← Back
      </button>

      <h1 className="text-3xl font-bold mt-4">{course.title}</h1>

      <SectionAccordion
        sections={course.sections}
        onAddSection={addSection}
        onAddTopic={addTopic}
        onEditSection={updateSection}
        onEditTopic={updateTopic}
        onDeleteSection={deleteSection}
        onDeleteTopic={deleteTopic}
        refresh={load}
      />
    </div>
  );
}
