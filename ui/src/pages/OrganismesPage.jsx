import React from "react";
import { Tab, TabPanel } from "../common/dsfr/elements/Tabs";
import AcademieSelector from "../organismes/selectors/AcademieSelector";
import { useOrganismes } from "../common/hooks/useOrganismes";
import SearchForm from "../organismes/liste/SearchForm";
import OrganismeList from "../organismes/liste/OrganismeList";
import Filters from "../organismes/filtres/Filters";
import TitleLayout from "../common/layout/TitleLayout";
import Results from "../common/Results";
import WideTabs from "../common/dsfr/custom/WideTabs";
import ContentLayout from "../common/layout/ContentLayout";
import NatureFilter from "../organismes/filtres/NatureFilter";
import NdaFilter from "../organismes/filtres/NdaFilter";
import DepartementsFilter from "../organismes/filtres/DepartementsFilter";
import UAIFilter from "../organismes/filtres/UAIFilter";

export default function OrganismesPage() {
  let { response, search, refine } = useOrganismes({ ordre: "desc", page: 1, items_par_page: 25 });

  return (
    <>
      <TitleLayout
        title={"Référentiel national"}
        selector={<AcademieSelector onChange={(code) => refine({ academies: code })} />}
      />
      <ContentLayout>
        <WideTabs
          tabs={[
            {
              tab: <Tab>Liste</Tab>,
              panel: (
                <TabPanel>
                  <Results
                    search={<SearchForm onSubmit={(form) => search({ page: 1, text: form.text })} />}
                    filters={
                      <Filters onChange={(filters) => refine({ ...filters })}>
                        <DepartementsFilter />
                        <NatureFilter />
                        <NdaFilter />
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
    </>
  );
}
