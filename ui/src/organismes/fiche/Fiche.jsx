import React from "react";
import { Tab, TabPanel } from "../../common/dsfr/elements/Tabs";
import ImmatriculationTab from "./tabs/ImmatriculationTab";
import RelationsTab from "./tabs/RelationsTab";
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
              <ImmatriculationTab organisme={organisme} />
            </TabPanel>
          ),
        },
        {
          tab: <Tab disabled={organisme.relations.length === 0}>Relations</Tab>,
          panel: (
            <TabPanel>
              <RelationsTab organisme={organisme} />
            </TabPanel>
          ),
        },
      ]}
    />
  );
}
