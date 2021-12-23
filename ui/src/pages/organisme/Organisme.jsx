import { Col, Container, GridRow } from "../../common/dsfr/fondamentaux";
import { useParams } from "react-router-dom";
import Alert from "../../common/dsfr/elements/Alert";
import { Tab, TabPanel, Tabs } from "../../common/dsfr/elements/Tabs";
import React, { useContext } from "react";
import { Immatriculation } from "./tabs/Immatriculation";
import useOrganisme from "../../common/hooks/useOrganisme";
import MainTitle from "../../common/layout/MainTitle";
import Reseaux from "./fragments/Reseaux";

export const OrganismeContext = React.createContext(null);

export function OrganismeTitle() {
  let { organisme } = useContext(OrganismeContext);

  return <span>{organisme.raison_sociale}</span>;
}

export default function Organisme() {
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
      <MainTitle title={<OrganismeTitle />}>
        <Reseaux organisme={organisme} />
      </MainTitle>

      <Container>
        <GridRow className={"fr-pb-3w"}>
          <Col>
            <Tabs
              tabs={[
                {
                  tab: <Tab>Identité</Tab>,
                  panel: (
                    <TabPanel>
                      <Immatriculation organisme={organisme} />
                    </TabPanel>
                  ),
                },
                { tab: <Tab disabled>Lieux de formations</Tab>, panel: <TabPanel>-</TabPanel> },
                { tab: <Tab disabled>Relations de sous traitances</Tab>, panel: <TabPanel>-</TabPanel> },
                { tab: <Tab disabled>Relations administratives</Tab>, panel: <TabPanel>-</TabPanel> },
              ]}
            />{" "}
          </Col>
        </GridRow>
      </Container>
    </OrganismeContext.Provider>
  );
}
