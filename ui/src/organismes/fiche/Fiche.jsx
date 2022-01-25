import React from "react";
import { Tab, TabPanel } from "../../common/dsfr/elements/Tabs";
import { Immatriculation } from "./tabs/Immatriculation";
import { Relations } from "./tabs/Relations";
import WideTabs from "../../common/dsfr/custom/WideTabs";

export default function Fiche({ organisme }) {
  return (
    <WideTabs
      className={"fr-mb-3w"}
      tabs={[
        {
          tab: <Tab>Identité</Tab>,
          panel: (
            <TabPanel>
              <Immatriculation organisme={organisme} />
            </TabPanel>
          ),
        },
        {
          tab: <Tab disabled={organisme.relations.length === 0}>Relations</Tab>,
          panel: (
            <TabPanel>
              <Relations organisme={organisme} />
            </TabPanel>
          ),
        },
      ]}
    />
  );
}
