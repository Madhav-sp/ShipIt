import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";

import LandingPage from "./pages/LandingPage";
import ProjectsDashboard from "./pages/ProjectsDashboard";
import ProjectDetail from "./pages/ProjectDetail";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/dashboard" element={<ProjectsDashboard />} />
          <Route path="/projects/:id" element={<ProjectDetail />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;