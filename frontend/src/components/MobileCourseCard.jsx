import { useEffect, useState } from "react";

export default function MobileCourseCard({ course, onClick }) {
  const [loaded, setLoaded] = useState(false);

  const imageUrl = `https://picsum.photos/seed/${course.title}-${course.id}/800/400`;

  useEffect(() => {
    const img = new Image();
    img.src = imageUrl;
    img.onload = () => setLoaded(true);
  }, [imageUrl]);

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-xl overflow-hidden shadow active:scale-98 transition"
    >
      <div
        className={`
          h-36 bg-cover bg-center transition-all duration-700
          ${loaded ? "blur-0 scale-100" : "blur-md scale-110"}
        `}
        style={{ backgroundImage: `url(${imageUrl})` }}
      >
        <div className="h-full bg-gradient-to-t from-black/70 to-transparent p-4 flex items-end">
          <h3 className="text-white font-semibold text-sm leading-snug">
            {course.title}
          </h3>
        </div>
      </div>

      <div className="p-4">
        <p className="text-sm text-gray-600">{course.instructor}</p>
        <p className="text-xs text-gray-400">{course.provider}</p>

        <div className="mt-3">
          <div className="flex justify-between text-xs mb-1">
            <span className="text-gray-500">Progress</span>
            <span className="text-indigo-600 font-semibold">
              {course.progress}%
            </span>
          </div>
          <div className="h-1.5 bg-gray-200 rounded">
            <div
              className="h-full bg-indigo-500 rounded"
              style={{ width: `${course.progress}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
