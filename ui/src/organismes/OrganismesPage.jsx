import AcademieSelector from '../common/organismes/selectors/AcademieSelector';
import { useSearch } from '../common/hooks/useSearch';
import SearchForm from '../common/organismes/liste/SearchForm';
import OrganismeList from '../common/organismes/liste/OrganismeList';
import Filters from '../common/organismes/filtres/Filters';
import TitleLayout from '../common/layout/TitleLayout';
import Results from '../common/Results';
import ContentLayout from '../common/layout/ContentLayout';
import NatureFilter from '../common/organismes/filtres/NatureFilter';
import DatagouvFilter from '../common/organismes/filtres/DatagouvFilter';
import DepartementsFilter from '../common/organismes/filtres/DepartementsFilter';
import UAIFilter from '../common/organismes/filtres/UAIFilter';
import Page from '../common/Page';
import { useQuery } from '../common/hooks/useQuery';
import AcademiesFilter from '../common/organismes/filtres/AcademiesFilter';
import QualiopiFilter from '../common/organismes/filtres/QualiopiFilter';
import SiretFilter from '../common/organismes/filtres/SiretFilter';

export default function OrganismesPage() {
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
