import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import EtablissementsPage from "./pages/EtablissementsPage";
import EtablissementPage from "./pages/EtablissementPage";
import "tabler-react/dist/Tabler.css";
import AnomaliesPage from "./pages/AnomaliesPage";
import StatsPage from "./pages/StatsPage";
import ScrollToTop from "./common/components/ScrollToTop";
import DesignPage from "./pages/DesignPage";
import "@gouvfr/dsfr/dist/dsfr/dsfr.css";

function App() {
  return (
    <div className="App">
      <Router>
        <ScrollToTop />
        <Switch>
          <Route exact path="/ds" component={DesignPage} />
          <Route exact path="/" component={EtablissementsPage} />
          <Route exact path="/anomalies" component={AnomaliesPage} />
          <Route exact path="/stats" component={StatsPage} />
          <Route exact path="/etablissements/:siret" component={EtablissementPage} />
        </Switch>
      </Router>
    </div>
  );
}

export default App;
