import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "@gouvfr/dsfr/dist/dsfr/dsfr.css";
import OrganismePage from "./pages/organismes/OrganismePage";
import Layout from "./common/components/Layout";
import DesignPage from "./pages/DesignPage";

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/ds" element={<DesignPage />} />
        </Routes>
        <Layout>
          <Routes>
            <Route path="/organismes/:siret" element={<OrganismePage />} />
          </Routes>
        </Layout>
      </Router>
    </div>
  );
}

export default App;
