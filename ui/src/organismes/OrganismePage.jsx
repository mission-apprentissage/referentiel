/**
 *
 */

import { Col, GridRow } from '../common/dsfr/fondamentaux';
import { useNavigate, useParams } from 'react-router-dom';
import Alert from '../common/dsfr/elements/Alert';
import { useContext, useState } from 'react';
import { Back, ContentLayout, TitleLayout } from '../common/layout';
import { useFetch } from '../common/hooks';
import Fiche from './fiche/Fiche';
import RaisonSociale from '../common/organismes/RaisonSociale';
import OrganismeProvider, { OrganismeContext } from '../common/organismes/OrganismeProvider';
import { SearchContext } from '../common/SearchProvider';
import { buildUrl } from '../common/utils';
import Page from '../common/Page';
import config from '../config';


export default function OrganismePage () {

  const { siret } = useParams();
  const { search } = useContext(SearchContext);
  const navigate = useNavigate();
  const [{ data: organisme, loading, error }, setData] = useFetch(config.apiUrl + `/organismes/${siret}`);
  const [message, setMessage] = useState(null);

  function onChange (organisme, options = {}) {
    if (options.message) {
      setMessage(options.message);
      autoCloseMessage();
    }
    setData(organisme);
  }

  function autoCloseMessage () {
    const timeout = setTimeout(() => {
      clearTimeout(timeout);
      setMessage(null);
    }, 5000);
  }

  if (error) {
    return (
      <GridRow className={'fr-pb-3w'}>
        <Col>
          <Alert modifiers={'error'} title={'Une erreur survenue'}>
            Impossible de récupérer les informations liées à cet organisme
          </Alert>
        </Col>
      </GridRow>
    );
  }

  if (loading) {
    return (
      <GridRow className={'fr-pb-3w'}>
        <Col>En cours de chargement...</Col>
      </GridRow>
    );
  }

  return (
    <Page>
      <OrganismeProvider organisme={organisme} onChange={onChange}>
        <TitleLayout
          title={<OrganismeBreadcrumb />}
          message={message}
          back={<Back onClick={() => navigate(buildUrl(search.page, search.params))}>Retour à la liste</Back>}
        />
        <ContentLayout>
          <Fiche organisme={organisme} />
        </ContentLayout>
      </OrganismeProvider>
    </Page>
  );
}

export function OrganismeBreadcrumb () {
  const { organisme } = useContext(OrganismeContext);

  return <RaisonSociale organisme={organisme} />;
}
