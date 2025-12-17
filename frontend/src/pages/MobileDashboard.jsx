import { useEffect, useState } from "react";
import { CourseAPI } from "../api";
import MobileHeader from "../components/MobileHeader";
import MobileMenu from "../components/MobileMenu";
import MobileCourseCard from "../components/MobileCourseCard";
import { useNavigate } from "react-router-dom";

export default function MobileDashboard() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [courses, setCourses] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    CourseAPI.list().then((res) => {
      setCourses(res.data || []);
    });
  }, []);

  return (
    <>
      <MobileHeader onMenuToggle={() => setMenuOpen(true)} />
      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />

      <div className="p-4 space-y-4 md:hidden">
        {courses.map((c) => (
          <MobileCourseCard
            key={c.id}
            course={c}
            onClick={() => navigate(`/course/${c.id}`)}
          />
        ))}
      </div>
    </>
  );
}
