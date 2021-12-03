import { Col, Container, GridRow } from "../../common/components/dsfr/fondamentaux";
import { useParams } from "react-router-dom";
import { useFetch } from "../../common/hooks/useFetch";
import Alert from "../../common/components/dsfr/elements/Alert";
import { Tab, TabPanel, Tabs } from "../../common/components/dsfr/elements/Tabs";
import React from "react";
import { Immatriculation } from "./Immatriculation";
import { Presentation } from "./Presentation";

export default function OrganismePage() {
  let { siret } = useParams();
  let [organisme, loading, error] = useFetch(`/api/v1/etablissements/${siret}`);

  if (error) {
    return (
      <GridRow className={"fr-pb-3w"}>
        <Col>
          <Alert modifiers={"error"} title={"Une erreur survenue"}>
            Impossible de récupérer les informations liées à cet établissement
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
    <Container>
      <GridRow className={"fr-pb-3w"}>
        <Col>
          <Presentation organisme={organisme} />
        </Col>
      </GridRow>
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
  );
}
