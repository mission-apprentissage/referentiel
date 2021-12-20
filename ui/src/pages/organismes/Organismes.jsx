import { Col, Container, GridRow } from "../../common/dsfr/fondamentaux";
import { Tab, TabPanel, Tabs } from "../../common/dsfr/elements/Tabs";
import AcademieSelector from "./fragments/AcademieSelector";
import { useSearch } from "../../common/search/useSearch";
import Spinner from "../../common/Spinner";
import SearchForm from "./fragments/SearchForm";
import OrganismeList from "./fragments/OrganismeList";
import Filters from "./fragments/Filters";
import { DepartementsFilter, NdaFilter, TypeFilter } from "./fragments/Filter";
import useFilAriane from "../../common/ariane/useFilAriane";

export default function Organismes() {
  let [{ data, loading, error }, search] = useSearch({ ordre: "desc", page: 1, items_par_page: 25 });
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
                        <Filters search={search}>
                          <DepartementsFilter />
                          <TypeFilter />
                          <NdaFilter />
                        </Filters>
                      </Col>
                      <Col modifiers={"9"}>
                        <Spinner error={error} loading={loading} />
                        <OrganismeList organismes={data.organismes} pagination={data.pagination} />
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
