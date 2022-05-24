import React from "react";
import { Tab, TabPanel } from "../common/dsfr/elements/Tabs";
import AcademieSelector from "../organismes/selectors/AcademieSelector";
import { useSearch } from "../common/hooks/useSearch";
import SearchForm from "../organismes/liste/SearchForm";
import OrganismeList from "../organismes/liste/OrganismeList";
import Filters from "../organismes/filtres/Filters";
import TitleLayout from "../common/layout/TitleLayout";
import Results from "../common/Results";
import WideTabs from "../common/dsfr/custom/WideTabs";
import ContentLayout from "../common/layout/ContentLayout";
import NatureFilter from "../organismes/filtres/NatureFilter";
import DatagouvFilter from "../organismes/filtres/DatagouvFilter";
import DepartementsFilter from "../organismes/filtres/DepartementsFilter";
import UAIFilter from "../organismes/filtres/UAIFilter";
import Page from "../common/Page";
import { useQuery } from "../common/hooks/useQuery";

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
