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
import PreviousSearchProvider from "./common/PreviousSearchProvider";

function App() {
  return (
    <div className="App">
      <Router>
        <ApiProvider>
          <DataProvider>
            <PreviousSearchProvider>
              <Routes>
                <Route path="/dsfr" element={<DesignPage />} />
              </Routes>
              <Routes>
                <Route element={<Layout children={<Outlet />} />}>
                  <Route path="/" element={<AccueilPage />} />
                  <Route path="/construction" element={<ConstructionPage />} />
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
            </PreviousSearchProvider>
          </DataProvider>
        </ApiProvider>
      </Router>
    </div>
  );
}

export default App;
