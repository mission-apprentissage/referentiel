import React from "react";
import { BrowserRouter as Router, Navigate, Outlet, Route, Routes } from "react-router-dom";
import "@gouvfr/dsfr/dist/dsfr/dsfr.css";
import OrganismePage from "./pages/OrganismePage";
import Layout from "./common/layout/Layout";
import DesignPage from "./pages/DesignPage";
import OrganismesPage from "./pages/OrganismesPage";
import Login from "./pages/LoginPage";
import TableauDeBordPage from "./pages/TableauDeBordPage";
import ValidationPage from "./pages/ValidationPage";
import useData, { DataContext } from "./common/hooks/useData";
import AuthRoutes from "./common/AuthRoutes";

function App() {
  let data = useData();

  return (
    <div className="App">
      <DataContext.Provider value={data}>
        <Router>
          <Routes>
            <Route path="/dsfr" element={<DesignPage />} />
          </Routes>
          <Routes>
            <Route element={<Layout children={<Outlet />} />}>
              <Route path="/login" element={<Login />} />
              <Route element={<AuthRoutes />}>
                <Route path="/" element={<TableauDeBordPage />} />
                <Route path="/validation" element={<Navigate replace to="/" />} />
                <Route path="/validation/:type" element={<ValidationPage />} />
                <Route path="/validation/:type/:siret" element={<OrganismePage />} />
                <Route path="/organismes" element={<OrganismesPage />} />
                <Route path="/organismes/:siret" element={<OrganismePage />} />
              </Route>
            </Route>
          </Routes>
        </Router>
      </DataContext.Provider>
    </div>
  );
}

export default App;
