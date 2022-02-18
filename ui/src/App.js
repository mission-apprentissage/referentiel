import React from "react";
import { BrowserRouter as Router, Navigate, Outlet, Route, Routes } from "react-router-dom";
import OrganismePage from "./pages/OrganismePage";
import Layout from "./common/layout/Layout";
import DesignPage from "./pages/DesignPage";
import OrganismesPage from "./pages/OrganismesPage";
import LoginPage from "./pages/LoginPage";
import TableauDeBordPage from "./pages/TableauDeBordPage";
import ValidationPage from "./pages/ValidationPage";
import AuthShield from "./common/AuthShield";
import AccueilPage from "./pages/AccueilPage";
import ConstructionPage from "./pages/ConstructionPage";
import DataProvider from "./common/DataProvider";
import ApiProvider from "./common/ApiProvider";

function App() {
  return (
    <div className="App">
      <ApiProvider>
        <DataProvider>
          <Router>
            <Routes>
              <Route path="/dsfr" element={<DesignPage />} />
            </Routes>
            <Routes>
              <Route element={<Layout children={<Outlet />} />}>
                <Route path="/" element={<AccueilPage />} />
                <Route path="/construction" element={<ConstructionPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/organismes" element={<OrganismesPage />} />
                <Route path="/organismes/:siret">
                  <Route path="" element={<OrganismePage />} />
                  <Route path=":tab" element={<OrganismePage />} />
                </Route>
                <Route element={<AuthShield />}>
                  <Route path="/tableau-de-bord" element={<TableauDeBordPage />} />
                  <Route path="/validation" element={<Navigate replace to="/" />} />
                  <Route path="/validation/:type" element={<ValidationPage />} />
                  <Route path="/validation/:type/:siret">
                    <Route path="" element={<OrganismePage />} />
                    <Route path=":tab" element={<OrganismePage />} />
                  </Route>
                </Route>
                <Route path="*" element={<Navigate to="/login" />} />
              </Route>
            </Routes>
          </Router>
        </DataProvider>
      </ApiProvider>
    </div>
  );
}

export default App;
