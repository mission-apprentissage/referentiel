import React from "react";
import { BrowserRouter as Router, Navigate, Outlet, Route, Routes } from "react-router-dom";
import OrganismePage from "./organismes/OrganismePage.jsx";
import Layout from "./common/layout/Layout";
import DesignPage from "./DesignPage.jsx";
import OrganismesPage from "./organismes/OrganismesPage.jsx";
import LoginPage from "./LoginPage.jsx";
import ConnexionPage from "./ConnexionPage.jsx";
import TableauDeBordPage from "./tableau-de-bord/TableauDeBordPage.jsx";
import ValidationPage from "./tableau-de-bord/ValidationPage.jsx";
import AuthShield from "./common/AuthShield";
import AccueilPage from "./accueil/AccueilPage.jsx";
import ConstructionPage from "./ConstructionPage.jsx";
import DataProvider from "./common/DataProvider";
import ApiProvider from "./common/ApiProvider";
import StatsPage from "./stats/StatsPage.jsx";
import SearchProvider from "./common/SearchProvider";
import ModificationsPage from "./ModificationsPage.jsx";
import CorrectionsPage from "./CorrectionsPage.jsx";
import { useScrollToTop } from "./common/hooks/useScrollToTop.js";
import { UserProvider } from "./common/UserProvider.jsx";

function Providers({ children }) {
  useScrollToTop();

  return (
    <ApiProvider>
      <UserProvider>
        <DataProvider>
          <SearchProvider>{children}</SearchProvider>
        </DataProvider>
      </UserProvider>
    </ApiProvider>
  );
}

function App() {
  return (
    <div className="App">
      <Router>
        <Providers>
          <Routes>
            <Route element={<Layout children={<Outlet />} />}>
              <Route path="/" element={<AccueilPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/connexion" element={<ConnexionPage />} />
              <Route path="/organismes" element={<OrganismesPage />} />
              <Route path="/organismes/:siret">
                <Route path="" element={<OrganismePage />} />
                <Route path=":tab" element={<OrganismePage />} />
              </Route>
              <Route element={<AuthShield />}>
                <Route path="/tableau-de-bord" element={<TableauDeBordPage />} />
                <Route path="/tableau-de-bord/validation" element={<Navigate replace to="/" />} />
                <Route path="/tableau-de-bord/validation/:criteria" element={<ValidationPage />} />
                <Route path="/tableau-de-bord/validation/:criteria/:siret">
                  <Route path="" element={<OrganismePage />} />
                  <Route path=":tab" element={<OrganismePage />} />
                </Route>
              </Route>
              <Route path="/dsfr" element={<DesignPage />} />
              <Route path="/stats" element={<StatsPage />} />
              <Route path="/corrections" element={<CorrectionsPage />} />
              <Route path="/modifications" element={<ModificationsPage />} />
              <Route path="/construction">
                <Route path="" element={<ConstructionPage />} />
                <Route path=":tab" element={<ConstructionPage />} />
              </Route>
              <Route path="*" element={<Navigate to="/connexion" />} />
            </Route>
          </Routes>
        </Providers>
      </Router>
    </div>
  );
}

export default App;
