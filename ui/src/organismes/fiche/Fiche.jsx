import React from "react";
import { Tab, TabPanel } from "../../common/dsfr/elements/Tabs";
import ImmatriculationTab from "./ImmatriculationTab";
import RelationsTab from "./RelationsTab";
import WideTabs from "../../common/dsfr/custom/WideTabs";
import { useNavigate, useParams } from "react-router-dom";

export default function Fiche({ organisme }) {
  let navigate = useNavigate();
  let { tab } = useParams();

  return (
    <WideTabs
      className={"fr-mb-3w"}
      tabs={[
        {
          tab: (
            <Tab selected={!tab || tab === "identite"} onClick={() => navigate("../identite")}>
              Identité
            </Tab>
          ),
          panel: (
            <TabPanel>
              <ImmatriculationTab organisme={organisme} />
            </TabPanel>
          ),
        },
        {
          tab: (
            <Tab
              disabled={organisme.relations.length === 0}
              selected={tab === "relations"}
              onClick={() => navigate("../relations")}
            >
              Relations
            </Tab>
          ),
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
