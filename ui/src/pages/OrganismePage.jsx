import { Col, GridRow } from "../common/dsfr/fondamentaux";
import { useParams } from "react-router-dom";
import Alert from "../common/dsfr/elements/Alert";
import React, { createContext, useContext, useState } from "react";
import TitleLayout from "../common/layout/TitleLayout";
import ContentLayout from "../common/layout/ContentLayout";
import { useFetch } from "../common/hooks/useFetch";
import Fiche from "../organismes/fiche/Fiche";

export const OrganismeContext = createContext(null);

export function OrganismeTitle() {
  let { organisme } = useContext(OrganismeContext);

  return <span>{organisme.enseigne || organisme.raison_sociale}</span>;
}

export default function OrganismePage() {
  let { siret } = useParams();
  let [{ data: organisme, loading, error }, setData] = useFetch(`/api/v1/organismes/${siret}`);
  let [message, setMessage] = useState(null);
  function autoCloseMessage() {
    let timeout = setTimeout(() => {
      clearTimeout(timeout);
      setMessage(null);
    }, 5000);
  }

  async function updateOrganisme(organisme, options = {}) {
    if (options.message) {
      setMessage(options.message);
      autoCloseMessage();
    }
    await setData(organisme);
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
    <OrganismeContext.Provider value={{ organisme, updateOrganisme }}>
      <TitleLayout title={<OrganismeTitle />} message={message} back={"Retour à la liste"} />
      <ContentLayout>
        <Fiche organisme={organisme} />
      </ContentLayout>
    </OrganismeContext.Provider>
  );
}
