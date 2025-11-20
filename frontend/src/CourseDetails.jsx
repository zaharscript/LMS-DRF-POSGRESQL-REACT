import { useEffect, useState } from "react";
import api from "./api";
import TopicsAccordion from "./components/TopicsAccordion";

export default function CourseDetails({ courseId, onBack }) {
  const [course, setCourse] = useState(null);

  useEffect(() => {
    api.get(`courses/${courseId}/`).then((res) => {
      setCourse(res.data);
    });
  }, [courseId]);

  if (!course) return <p>Loading...</p>;

  return (
    <div style={{ padding: "20px" }}>
      <button onClick={onBack}>← Back</button>

      <h2 className="text-3xl font-bold">{course.title}</h2>
      <p>Instructor: {course.instructor}</p>
      <p>Date: {course.date_joined}</p>

      <h3 className="text-2xl font-semibold mt-6">Sections</h3>

      {course.sections.length === 0 ? (
        <p className="text-gray-500">No sections yet...</p>
      ) : (
        <ul>
          {course.sections.map((sec) => (
            <li key={sec.id} className="mb-6">
              <strong className="text-xl">{sec.title}</strong>

              {sec.topics.length > 0 ? (
                <TopicsAccordion topics={sec.topics} />
              ) : (
                <p className="text-gray-500">No topics for this section.</p>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
