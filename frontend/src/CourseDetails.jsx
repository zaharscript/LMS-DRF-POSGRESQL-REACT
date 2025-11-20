import { useEffect, useState } from "react";
import api from "./api";

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

      <h2>{course.title}</h2>
      <p>Instructor: {course.instructor}</p>
      <p>Date: {course.date_joined}</p>

      <h3>Sections</h3>
      {course.sections.length === 0 ? (
        <p>No sections yet...</p>
      ) : (
        <ul>
          {course.sections.map((sec) => (
            <li key={sec.id}>
              <strong>{sec.title}</strong>
              <ul>
                {sec.topics.map((t) => (
                  <li key={t.id}>
                    {t.title} {t.completed ? "✔" : "❌"}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
