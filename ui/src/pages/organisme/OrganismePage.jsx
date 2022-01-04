import { Col, Container, GridRow } from "../../common/dsfr/fondamentaux";
import { useParams } from "react-router-dom";
import Alert from "../../common/dsfr/elements/Alert";
import { Tab, TabPanel } from "../../common/dsfr/elements/Tabs";
import React, { useContext } from "react";
import { Immatriculation } from "./tabs/Immatriculation";
import useOrganisme from "../../common/hooks/useOrganisme";
import PageTitle from "../../common/page/PageTitle";
import Reseaux from "./fragments/Reseaux";
import WideTabs from "../../common/dsfr/custom/WideTabs";

export const OrganismeContext = React.createContext(null);

export function OrganismeTitle() {
  let { organisme } = useContext(OrganismeContext);

  return <span>{organisme.raison_sociale}</span>;
}

export default function OrganismePage() {
  let { siret } = useParams();
  let [{ organisme, loading, error }, actions] = useOrganisme(siret);

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
    <OrganismeContext.Provider value={{ organisme, actions }}>
      <PageTitle title={<OrganismeTitle />}>
        <Reseaux organisme={organisme} />
      </PageTitle>
      <WideTabs
        className={"fr-mb-3w"}
        tabs={[
          {
            tab: <Tab>Identité</Tab>,
            panel: (
              <TabPanel>
                <Container>
                  <Immatriculation organisme={organisme} />
                </Container>
              </TabPanel>
            ),
          },
          { tab: <Tab disabled>Lieux de formations</Tab>, panel: <TabPanel>-</TabPanel> },
          { tab: <Tab disabled>Relations de sous traitances</Tab>, panel: <TabPanel>-</TabPanel> },
          { tab: <Tab disabled>Relations administratives</Tab>, panel: <TabPanel>-</TabPanel> },
        ]}
      />
    </OrganismeContext.Provider>
  );
}
