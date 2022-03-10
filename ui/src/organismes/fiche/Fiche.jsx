import React from "react";
import { Tab, TabPanel } from "../../common/dsfr/elements/Tabs";
import ImmatriculationTab from "./immatriculation/ImmatriculationTab";
import RelationsTab from "./relations/RelationsTab";
import WideTabs from "../../common/dsfr/custom/WideTabs";
import { useNavigate, useParams } from "react-router-dom";
import LieuxDeFormationTab from "./lieux/LieuxDeFormationTab";

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
        {
          tab: (
            <Tab
              disabled={organisme.lieux_de_formation.length === 0}
              selected={tab === "lieux"}
              onClick={() => navigate("../lieux")}
            >
              Lieux de formation
            </Tab>
          ),
          panel: (
            <TabPanel>
              <LieuxDeFormationTab organisme={organisme} />
            </TabPanel>
          ),
        },
      ]}
    />
  );
}
