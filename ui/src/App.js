import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "@gouvfr/dsfr/dist/dsfr/dsfr.css";
import Organisme from "./pages/organisme/Organisme";
import Layout from "./common/components/Layout";
import DesignPage from "./pages/DesignPage";
import Organismes from "./pages/organismes/Organismes";

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/ds" element={<DesignPage />} />
        </Routes>
        <Layout>
          <Routes>
            <Route path="/organismes/" element={<Organismes />} />
            <Route path="/organismes/:siret" element={<Organisme />} />
          </Routes>
        </Layout>
      </Router>
    </div>
  );
}

export default App;
