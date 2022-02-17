import React from "react";
import { BrowserRouter as Router, Navigate, Outlet, Route, Routes } from "react-router-dom";
import OrganismePage from "./pages/OrganismePage";
import Layout from "./common/layout/Layout";
import DesignPage from "./pages/DesignPage";
import OrganismesPage from "./pages/OrganismesPage";
import LoginPage from "./pages/LoginPage";
import TableauDeBordPage from "./pages/TableauDeBordPage";
import ValidationPage from "./pages/ValidationPage";
import useData, { DataContext } from "./common/hooks/useData";
import AuthShield from "./common/AuthShield";
import { AuthContext, useAuth } from "./common/hooks/useAuth";
import AccueilPage from "./pages/AccueilPage";
import ConstructionPage from "./pages/ConstructionPage";

function App() {
  let data = useData();
  let auth = useAuth();

  return (
    <div className="App">
      <AuthContext.Provider value={auth}>
        <DataContext.Provider value={data}>
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
        </DataContext.Provider>
      </AuthContext.Provider>
    </div>
  );
}

export default App;
