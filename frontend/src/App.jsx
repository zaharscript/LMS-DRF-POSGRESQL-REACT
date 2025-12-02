import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainLayout from "./layout/MainLayout";
import DashboardPage from "./pages/DashboardPage";
import CourseDetails from "./pages/CourseDetails";

function App() {
  return (
    <Router>
      <MainLayout>
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/course/:id" element={<CourseDetails />} />
        </Routes>
      </MainLayout>
    </Router>
  );
}

export default App;
