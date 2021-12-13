import React from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import "@gouvfr/dsfr/dist/dsfr/dsfr.css";
import Organisme from "./pages/organisme/Organisme";
import LayoutRoute from "./common/components/LayoutRoute";
import DesignPage from "./pages/DesignPage";
import Organismes from "./pages/organismes/Organismes";
import Login from "./pages/LoginPage";
import AuthRoute from "./common/components/AuthRoute";
import TableauDeBord from "./pages/validation/TableauDeBord";
import Validation from "./pages/validation/Validation";

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
              <Route path="/" element={<TableauDeBord />} />
              <Route path="/validation" element={<Navigate replace to="/" />} />
              <Route path="/validation/:validationStatus" element={<Validation />} />
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
