import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import AnnuairePage from "./pages/AnnuairePage";
import EtablissementPage from "./pages/EtablissementPage";
import "tabler-react/dist/Tabler.css";
import AnomaliesPage from "./pages/AnomaliesPage";
import StatsPage from "./pages/StatsPage";
import ScrollToTop from "./common/components/ScrollToTop";

function App() {
  return (
    <div className="App">
      <Router>
        <ScrollToTop />
        <Switch>
          <Route exact path="/" component={AnnuairePage} />
          <Route exact path="/anomalies" component={AnomaliesPage} />
          <Route exact path="/stats" component={StatsPage} />
          <Route exact path="/etablissements/:siret" component={EtablissementPage} />
        </Switch>
      </Router>
    </div>
  );
}

export default App;
