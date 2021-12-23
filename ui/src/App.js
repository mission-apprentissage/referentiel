import React from "react";
import { BrowserRouter as Router, Navigate, Outlet, Route, Routes } from "react-router-dom";
import "@gouvfr/dsfr/dist/dsfr/dsfr.css";
import Organisme from "./pages/organisme/Organisme";
import Layout from "./common/layout/Layout";
import DesignPage from "./pages/DesignPage";
import Organismes from "./pages/organismes/Organismes";
import Login from "./pages/LoginPage";
import AuthProvider from "./common/auth/AuthProvider";
import TableauDeBord from "./pages/validation/TableauDeBord";
import Validation from "./pages/validation/Validation";
import DataProvider from "./common/data/DataProvider";

function App() {
  return (
    <div className="App">
      <DataProvider>
        <Router>
          <Routes>
            <Route path="/dsfr" element={<DesignPage />} />
          </Routes>
          <Routes>
            <Route element={<Layout children={<Outlet />} />}>
              <Route path="/login" element={<Login />} />
              <Route element={<AuthProvider children={<Outlet />} />}>
                <Route path="/" element={<TableauDeBord />} />
                <Route path="/validation" element={<Navigate replace to="/" />} />
                <Route path="/validation/:validationStatus" element={<Validation />} />
                <Route path="/validation/:validationStatus/:siret" element={<Organisme />} />
                <Route path="/organismes" element={<Organismes />} />
                <Route path="/organismes/:siret" element={<Organisme />} />
              </Route>
            </Route>
          </Routes>
        </Router>
      </DataProvider>
    </div>
  );
}

export default App;
