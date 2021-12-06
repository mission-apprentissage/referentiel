import { Col, Container, GridRow } from "../../common/components/dsfr/fondamentaux";
import { Tab, TabPanel, Tabs } from "../../common/components/dsfr/elements/Tabs";
import ListeNationale from "./tabs/ListeNationale";

export default function Organismes() {
  return (
    <Container>
      <GridRow className={"fr-pb-3w"}>
        <Col>
          <Tabs
            tabs={[
              {
                tab: <Tab>Liste</Tab>,
                panel: (
                  <TabPanel>
                    <ListeNationale />
                  </TabPanel>
                ),
              },
              { tab: <Tab disabled>Guide Réglementaire</Tab>, panel: <TabPanel>-</TabPanel> },
            ]}
          />{" "}
        </Col>
      </GridRow>
    </Container>
  );
}
