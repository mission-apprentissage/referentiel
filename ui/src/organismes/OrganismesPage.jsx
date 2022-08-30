import React from "react";
import { Tab, TabPanel } from "../common/dsfr/elements/Tabs.jsx";
import AcademieSelector from "../common/organismes/selectors/AcademieSelector.jsx";
import { useSearch } from "../common/hooks/useSearch.js";
import SearchForm from "../common/organismes/liste/SearchForm.jsx";
import OrganismeList from "../common/organismes/liste/OrganismeList.jsx";
import Filters from "../common/organismes/filtres/Filters.jsx";
import TitleLayout from "../common/layout/TitleLayout.jsx";
import Results from "../common/Results.jsx";
import WideTabs from "../common/dsfr/custom/WideTabs.jsx";
import ContentLayout from "../common/layout/ContentLayout.jsx";
import NatureFilter from "../common/organismes/filtres/NatureFilter.jsx";
import DatagouvFilter from "../common/organismes/filtres/DatagouvFilter.jsx";
import DepartementsFilter from "../common/organismes/filtres/DepartementsFilter.jsx";
import UAIFilter from "../common/organismes/filtres/UAIFilter.jsx";
import Page from "../common/Page.jsx";
import { useQuery } from "../common/hooks/useQuery.js";

export default function OrganismesPage() {
  const { response, search, refine } = useSearch({ ordre: "desc", page: 1, items_par_page: 25 });
  const { query } = useQuery();

  return (
    <Page>
      <TitleLayout
        title={"Référentiel national"}
        selector={<AcademieSelector academie={query.academies} onChange={(code) => refine({ academies: code })} />}
      />
      <ContentLayout>
        <WideTabs
          tabs={[
            {
              tab: <Tab>Liste</Tab>,
              panel: (
                <TabPanel>
                  <Results
                    search={
                      <SearchForm
                        onSubmit={(form) => search({ page: 1, text: form.text, academies: query.academies })}
                      />
                    }
                    filters={
                      <Filters onChange={(filters) => refine({ ...filters })}>
                        <DepartementsFilter />
                        <NatureFilter />
                        <DatagouvFilter />
                        <UAIFilter />
                      </Filters>
                    }
                    results={<OrganismeList response={response} />}
                  />
                </TabPanel>
              ),
            },
          ]}
        />
      </ContentLayout>
    </Page>
  );
}
