import { BrowserRouter, Routes, Route } from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import Deployment from "./pages/Deployment";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={<Dashboard />}
        />

        <Route
          path="/deployments"
          element={<Deployment />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;