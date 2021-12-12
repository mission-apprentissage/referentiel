import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "@gouvfr/dsfr/dist/dsfr/dsfr.css";
import Organisme from "./pages/organisme/Organisme";
import LayoutRoute from "./common/components/routes/LayoutRoute";
import DesignPage from "./pages/DesignPage";
import Organismes from "./pages/organismes/Organismes";
import Login from "./pages/LoginPage";
import AuthRoute from "./common/components/routes/AuthRoute";

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/dsfr" element={<DesignPage />} />
        </Routes>
        <Routes>
          <Route element={<LayoutRoute />}>
            <Route path="/login" element={<Login />} />
            <Route element={<AuthRoute />}>
              <Route path="/" element={<Organismes />} />
              <Route path="/organismes" element={<Organismes />} />
              <Route path="/organismes/:siret" element={<Organisme />} />
            </Route>
          </Route>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
