// App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import CourseDetails from "./CourseDetails";

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Dashboard (default page) */}
        <Route path="/" element={<Dashboard />} />

        {/* Course details page */}
        <Route path="/course/:id" element={<CourseDetails />} />
      </Routes>
    </Router>
  );
}
