import { Col, Container, GridRow } from "../../common/components/dsfr/fondamentaux";
import { Tab, TabPanel, Tabs } from "../../common/components/dsfr/elements/Tabs";
import AcademieSelector from "./fragments/AcademieSelector";
import { useSearch } from "../../common/hooks/useSearch";
import Spinner from "../../common/components/Spinner";
import SearchForm from "./fragments/SearchForm";
import Filters from "./fragments/Filters";
import OrganismeList from "./fragments/OrganismeList";
import { useFilAriane } from "../../common/components/FilAriane";

export default function Organismes() {
  let [{ data, loading, error }, search] = useSearch({ anomalies: false, ordre: "desc", page: 1, items_par_page: 25 });
  useFilAriane([
    { label: "Accueil", to: "/" },
    { label: "Organismes", to: "/organismes" },
  ]);

  return (
    <Container>
      <GridRow className={"fr-pb-3w"}>
        <Col modifiers={"12 offset-md-8 md-4"}>
          <AcademieSelector onChange={(code) => search({ academie: code })} />
        </Col>
      </GridRow>
      <GridRow className={"fr-pb-3w"}>
        <Col>
          <Tabs
            tabs={[
              {
                tab: <Tab>Liste</Tab>,
                panel: (
                  <TabPanel>
                    <SearchForm search={search} />
                    <GridRow>
                      <Col modifiers={"3"} className={"fr-pr-5v"}>
                        <Filters search={search} filters={data.filtres} />
                      </Col>
                      <Col modifiers={"9"}>
                        <Spinner error={error} loading={loading} />
                        <OrganismeList etablissements={data.etablissements} pagination={data.pagination} />
                      </Col>
                    </GridRow>
                  </TabPanel>
                ),
              },
              { tab: <Tab disabled>Lexique</Tab>, panel: <TabPanel>-</TabPanel> },
              { tab: <Tab disabled>Guide Réglementaire</Tab>, panel: <TabPanel>-</TabPanel> },
            ]}
          />
        </Col>
      </GridRow>
    </Container>
  );
}
