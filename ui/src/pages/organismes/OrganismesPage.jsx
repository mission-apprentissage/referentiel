import { Tab, TabPanel } from "../../common/dsfr/elements/Tabs";
import AcademieSelector from "./fragments/AcademieSelector";
import { useSearch } from "../../common/hooks/useSearch";
import SearchForm from "./fragments/SearchForm";
import OrganismeList from "./fragments/OrganismeList";
import Filters from "./fragments/Filters";
import { DepartementsFilter, NdaFilter, TypeFilter } from "./fragments/Filter";
import PageTitle from "../../common/page/PageTitle";
import ResultsPageContent from "../../common/page/ResultsPageContent";
import WideTabs from "../../common/dsfr/custom/WideTabs";

export default function OrganismesPage() {
  let [results, search] = useSearch({ ordre: "desc", page: 1, items_par_page: 25 });

  return (
    <>
      <PageTitle selector={<AcademieSelector onChange={(code) => search({ academie: code })} />} />
      <WideTabs
        tabs={[
          {
            tab: <Tab>Liste</Tab>,
            panel: (
              <TabPanel>
                <ResultsPageContent
                  search={<SearchForm onSubmit={(form) => search({ page: 1, text: form.text })} />}
                  filters={
                    <Filters search={search}>
                      <DepartementsFilter />
                      <TypeFilter />
                      <NdaFilter />
                    </Filters>
                  }
                  results={<OrganismeList results={results} />}
                />
              </TabPanel>
            ),
          },
          { tab: <Tab disabled>Lexique</Tab>, panel: <TabPanel>-</TabPanel> },
          { tab: <Tab disabled>Guide Réglementaire</Tab>, panel: <TabPanel>-</TabPanel> },
        ]}
      />
    </>
  );
}
