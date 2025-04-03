import { BrowserRouter as Router, Navigate, Outlet, Route, Routes } from 'react-router-dom';
import OrganismePage from './organismes/OrganismePage';
import { Layout } from './common/layout';
import DesignPage from './DesignPage';
import OrganismesPage from './organismes/OrganismesPage';
import ConnexionPage from './ConnexionPage';
import TableauDeBordPage from './tableau-de-bord/TableauDeBordPage';
import ValidationPage from './tableau-de-bord/ValidationPage';
import AuthShield from './common/AuthShield';
import AccueilPage from './accueil/AccueilPage';
import ConstructionPage from './ConstructionPage';
import DataProvider from './common/DataProvider';
import ApiProvider from './common/ApiProvider';
import StatsPage from './stats/StatsPage';
import SearchProvider from './common/SearchProvider';
import ModificationsPage from './ModificationsPage';
import CorrectionsPage from './CorrectionsPage';
import SuiviModificationsPage from './SuiviModificationsPage';
import { useScrollToTop } from './common/hooks/useScrollToTop';
import { UserProvider } from './common/UserProvider';
import ContactPage from './accueil/ContactPage';
import MentionsLegalesPages from './MentionsLegalesPage';
import DonneesPersonnellesPages from './DonneesPersonnellesPages';

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
              <Route path="/connexion" element={<ConnexionPage />} />
              <Route path="/contact" element={<ContactPage />} />
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
                <Route path="/suivi-modifications" element={<SuiviModificationsPage />} />
              </Route>
              <Route path="/dsfr" element={<DesignPage />} />
              <Route path="/stats" element={<StatsPage />} />
              <Route path="/corrections" element={<CorrectionsPage />} />
              <Route path="/modifications" element={<ModificationsPage />} />
              <Route path="/mentions-legales" element={<MentionsLegalesPages />} />
              <Route path="/donnees-personnelles" element={<DonneesPersonnellesPages />} />
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
