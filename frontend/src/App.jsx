import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainLayout from "./layout/MainLayout";
import DashboardPage from "./pages/DashboardPage";
import CourseDetails from "./pages/CourseDetails";
import { ThemeProvider } from "./context/ThemeContext";

function App() {
  return (
    <ThemeProvider>
      <Router>
        <MainLayout>
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/course/:id" element={<CourseDetails />} />
          </Routes>
        </MainLayout>
      </Router>
    </ThemeProvider>
  );
}

export default App;
