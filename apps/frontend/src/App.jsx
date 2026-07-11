import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { Toaster } from "sonner";

import LandingPage from "./pages/LandingPage";
import DashboardLayout from "./layouts/DashboardLayout";
import ProjectsDashboard from "./pages/ProjectsDashboard";
import ProjectDetail from "./pages/ProjectDetail";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Landing page — standalone, no sidebar/topbar */}
          <Route path="/" element={<LandingPage />} />

          {/* Dashboard — wrapped in DashboardLayout with sidebar/topbar */}
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard" element={<ProjectsDashboard />} />
            <Route path="/projects/:id" element={<ProjectDetail />} />
          </Route>
        </Routes>
      </BrowserRouter>

      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: "#18181B",
            border: "1px solid rgba(255,255,255,0.08)",
            color: "#FAFAFA",
            fontSize: "13px",
          },
        }}
      />
    </AuthProvider>
  );
}

export default App;