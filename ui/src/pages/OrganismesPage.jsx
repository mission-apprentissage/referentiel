import { Tab, TabPanel } from "../common/dsfr/elements/Tabs";
import AcademieSelector from "../organismes/selectors/AcademieSelector";
import { useSearch } from "../common/hooks/useSearch";
import SearchForm from "../organismes/liste/SearchForm";
import OrganismeList from "../organismes/liste/OrganismeList";
import Filters from "../organismes/liste/Filters";
import { DepartementsFilter, IdentiteFilter, NatureFilter, NdaFilter } from "../organismes/liste/Filter";
import LayoutTitle from "../common/layout/LayoutTitle";
import Results from "../common/layout/Results";
import WideTabs from "../common/dsfr/custom/WideTabs";
import LayoutContent from "../common/layout/LayoutContent";

export default function OrganismesPage() {
  let [response, search] = useSearch({ ordre: "desc", page: 1, items_par_page: 25 });

  return (
    <>
      <LayoutTitle
        title={"Référentiel national"}
        selector={<AcademieSelector onChange={(code) => search({ academies: code })} />}
      />
      <LayoutContent>
        <WideTabs
          tabs={[
            {
              tab: <Tab>Liste</Tab>,
              panel: (
                <TabPanel>
                  <Results
                    search={<SearchForm onSubmit={(form) => search({ page: 1, text: form.text })} />}
                    filters={
                      <Filters onChange={(filters) => search({ ...filters })}>
                        <DepartementsFilter />
                        <NatureFilter />
                        <NdaFilter />
                        <IdentiteFilter />
                      </Filters>
                    }
                    results={<OrganismeList response={response} />}
                  />
                </TabPanel>
              ),
            },
            { tab: <Tab disabled>Lexique</Tab>, panel: <TabPanel>-</TabPanel> },
            { tab: <Tab disabled>Guide Réglementaire</Tab>, panel: <TabPanel>-</TabPanel> },
          ]}
        />
      </LayoutContent>
    </>
  );
}
