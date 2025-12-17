import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";
import MainLayout from "./layout/MainLayout";
import DashboardPage from "./pages/DashboardPage";
import MobileDashboard from "./pages/MobileDashboard";
import CourseDetails from "./pages/CourseDetails";
import { ThemeProvider } from "./context/ThemeContext";

function App() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return (
    <ThemeProvider>
      <Router>
        <Routes>
          {/* DASHBOARD */}
          <Route
            path="/"
            element={
              isMobile ? (
                <MobileDashboard />
              ) : (
                <MainLayout>
                  <DashboardPage />
                </MainLayout>
              )
            }
          />

          {/* COURSE DETAILS (shared layout) */}
          <Route
            path="/course/:id"
            element={
              <MainLayout>
                <CourseDetails />
              </MainLayout>
            }
          />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
