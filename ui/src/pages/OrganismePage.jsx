import { Col, GridRow } from "../common/dsfr/fondamentaux";
import { useNavigate, useParams } from "react-router-dom";
import Alert from "../common/dsfr/elements/Alert";
import React, { useContext, useState } from "react";
import TitleLayout, { Back } from "../common/layout/TitleLayout";
import ContentLayout from "../common/layout/ContentLayout";
import { useFetch } from "../common/hooks/useFetch";
import Fiche from "../organismes/fiche/Fiche";
import RaisonSociale from "../organismes/common/RaisonSociale";
import OrganismeProvider, { OrganismeContext } from "../organismes/OrganismeProvider";
import { SearchContext } from "../common/SearchProvider";
import { buildUrl } from "../common/utils";
import Page from "../common/Page";

export function OrganismeTitle() {
  const { organisme } = useContext(OrganismeContext);

  return <RaisonSociale organisme={organisme} />;
}

export default function OrganismePage() {
  const { siret } = useParams();
  const { search } = useContext(SearchContext);
  const navigate = useNavigate();
  const [{ data: organisme, loading, error }, setData] = useFetch(`/api/v1/organismes/${siret}`);
  const [message, setMessage] = useState(null);

  function onChange(organisme, options = {}) {
    if (options.message) {
      setMessage(options.message);
      autoCloseMessage();
    }
    setData(organisme);
  }

  function autoCloseMessage() {
    const timeout = setTimeout(() => {
      clearTimeout(timeout);
      setMessage(null);
    }, 5000);
  }

  if (error) {
    return (
      <GridRow className={"fr-pb-3w"}>
        <Col>
          <Alert modifiers={"error"} title={"Une erreur survenue"}>
            Impossible de récupérer les informations liées à cet organisme
          </Alert>
        </Col>
      </GridRow>
    );
  }

  if (loading) {
    return (
      <GridRow className={"fr-pb-3w"}>
        <Col>En cours de chargement...</Col>
      </GridRow>
    );
  }

  return (
    <Page>
      <OrganismeProvider organisme={organisme} onChange={onChange}>
        <TitleLayout
          title={<OrganismeTitle />}
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
