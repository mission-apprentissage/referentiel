import { useContext } from 'react';
import { DateTime } from 'luxon';

import TitleLayout from './common/layout/TitleLayout.jsx';
import ContentLayout from './common/layout/ContentLayout.jsx';
import Page from './common/Page.jsx';
import { UserContext } from './common/UserProvider.jsx';
import ApiPagination from './common/ApiPagination.jsx';
import { useSearch } from './common/hooks/useSearch.js';
import { Box } from './common/Flexbox.jsx';

function formatDate(date) {
  return DateTime.fromISO(date).setLocale('fr').toLocaleString({
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function SuiviModificationsPage() {
  const [userContext] = useContext(UserContext);

  const { response } = useSearch(
    { ordre: 'desc', page: 1, items_par_page: 25 },
    { path: '/modifications', entity: 'modifications' },
    userContext.token
  );
  const pagination = response?.data?.pagination;

  if (!response.data.modifications.length) return null;

  return (
    <Page>
      <TitleLayout title={'Suivi des modifications'} />
      <ContentLayout>
        <Box align="center" direction="column" width="100%">
          <div class="fr-table">
            <table>
              <thead>
                <tr>
                  <th scope="col">SIRET</th> <th scope="col">Date</th> <th scope="col">Auteur</th>
                  <th scope="col">Email</th>
                  <th scope="col">Original</th> <th scope="col">Nouveau</th>
                </tr>
              </thead>
              <tbody>
                {response.data.modifications.map((modification, index) => {
                  return (
                    <tr key={index}>
                      <td>{modification?.siret}</td> <td>{formatDate(modification?.date)}</td>
                      <td>{modification?.auteur}</td>
                      <td>{modification?.email}</td>
                      <td>{modification.original?.uai}</td> <td>{modification.changements?.uai}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <ApiPagination pagination={pagination} />
        </Box>
      </ContentLayout>
    </Page>
  );
}
