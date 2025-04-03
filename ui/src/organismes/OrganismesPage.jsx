/**
 *
 */

import AcademieSelector from '../common/organismes/selectors/AcademieSelector';
import { useSearch } from '../common/hooks';
import SearchForm from '../common/organismes/liste/SearchForm';
import OrganismeList from '../common/organismes/liste/OrganismeList';
import {
  AcademiesFilter, DatagouvFilter, DepartementsFilter, Filters, NatureFilter, QualiopiFilter, SiretFilter, UAIFilter
} from '../common/organismes/filtres';
import { ContentLayout, TitleLayout } from '../common/layout';
import Results from '../common/Results';
import Page from '../common/Page';
import { useQuery } from '../common/hooks';


export default function OrganismesPage () {
  const { response, search, refine } = useSearch({ ordre: 'desc', page: 1, items_par_page: 25 });
  const { query } = useQuery();

  return (
    <Page>
      <TitleLayout
        title={'Référentiel national'}
        selector={<AcademieSelector academie={query.academies} onChange={(code) => refine({ academies: code })} />}
      />
      <ContentLayout>
        <Results
          search={<SearchForm onSubmit={(form) => search({ page: 1, text: form.text, academies: query.academies })} />}
          filters={
            <Filters onChange={(filters) => refine({ ...filters })}>
              <AcademiesFilter />
              <DepartementsFilter />
              <NatureFilter />
              <DatagouvFilter />
              <QualiopiFilter />
              <UAIFilter />
              <SiretFilter />
            </Filters>
          }
          results={<OrganismeList response={response} />}
        />
      </ContentLayout>
    </Page>
  );
}
