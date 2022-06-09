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
import StatsPage from "./pages/StatsPage";
import SearchProvider from "./common/SearchProvider";
import ModificationsPage from "./pages/ModificationsPage";
import CorrectionsPage from "./pages/CorrectionsPage.jsx";

function App() {
  return (
    <div className="App">
      <Router>
        <ApiProvider>
          <DataProvider>
            <SearchProvider>
              <Routes>
                <Route path="/dsfr" element={<DesignPage />} />
                <Route element={<Layout children={<Outlet />} />}>
                  <Route path="/" element={<AccueilPage />} />
                  <Route path="/construction">
                    <Route path="" element={<ConstructionPage />} />
                    <Route path=":tab" element={<ConstructionPage />} />
                  </Route>
                  <Route path="/modifications" element={<ModificationsPage />} />
                  <Route path="/corrections" element={<CorrectionsPage />} />
                  <Route path="/stats" element={<StatsPage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/organismes" element={<OrganismesPage />} />
                  <Route path="/organismes/:siret">
                    <Route path="" element={<OrganismePage />} />
                    <Route path=":tab" element={<OrganismePage />} />
                  </Route>
                  <Route element={<AuthShield />}>
                    <Route path="/tableau-de-bord" element={<TableauDeBordPage />} />
                    <Route path="/tableau-de-bord/validation" element={<Navigate replace to="/" />} />
                    <Route path="/tableau-de-bord/validation/:type" element={<ValidationPage />} />
                    <Route path="/tableau-de-bord/validation/:type/:siret">
                      <Route path="" element={<OrganismePage />} />
                      <Route path=":tab" element={<OrganismePage />} />
                    </Route>
                  </Route>
                  <Route path="*" element={<Navigate to="/login" />} />
                </Route>
              </Routes>
            </SearchProvider>
          </DataProvider>
        </ApiProvider>
      </Router>
    </div>
  );
}

export default App;
