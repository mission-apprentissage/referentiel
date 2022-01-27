import React, { useEffect, useState } from "react";
import UAIValidator from "./uai/UAISelector";
import Natures from "../common/Natures";
import Siret from "../common/Siret";
import { Box } from "../../common/Flexbox";
import LinkButton from "../../common/dsfr/custom/LinkButton";
import { useModal } from "../../common/dsfr/common/useModal";
import DatagouvModal from "./DatagouvModal";
import Field from "../../common/Field";

export default function ImmatriculationTab({ organisme }) {
  let adresse = organisme.adresse?.label || `${organisme.adresse?.code_postal} ${organisme.adresse?.localite}`;
  let [showDatagouvModal, setShowDatagouvModal] = useState(false);
  let datagouvModal = useModal();
  useEffect(() => {
    showDatagouvModal && datagouvModal.open();
  });

  return (
    <>
      <Box justify={"between"}>
        <h6>Immatriculation</h6>
        {organisme.uai_potentiels.length === 0 && (
          <>
            <LinkButton modifiers={"icon-right"} icons={"arrow-right-line"} onClick={() => setShowDatagouvModal(true)}>
              Afficher les données de la Liste publique des Organismes de Formations
            </LinkButton>
            {showDatagouvModal && <DatagouvModal modal={datagouvModal} siret={organisme.siret} />}
          </>
        )}
      </Box>
      <Box direction={"column"}>
        <Field label={"UAI"} value={organisme.uai}>
          <UAIValidator className="fr-ml-3v" organisme={organisme} />
        </Field>
        <Field label={"Nature"} value={<Natures organisme={organisme} />} />
        <Field label={"SIREN"} value={organisme.siret.substr(0, 9)} />
        <Field
          label={"SIRET"}
          className={"fr-mr-1w xfr-display-inline-block"}
          value={<Siret siret={organisme.siret} />}
        />
        <Field
          className={"xfr-display-inline-block"}
          value={organisme.etat_administratif === "actif" ? "en activité" : "fermé"}
        />
        <Field label={"NDA"} value={organisme.numero_declaration_activite} />
        <Field label={"Certifié Qualiopi"} value={organisme.qualiopi ? "Oui" : "Non"} />
      </Box>
      <Box direction={"column"} className={"fr-mt-5w"}>
        <Field label={"Enseigne"} value={organisme.enseigne} />
        <Field label={"Raison sociale"} value={organisme.raison_sociale} />
        <Field label={"Adresse"} value={adresse} />
        <Field label={"Région"} value={organisme.adresse?.region?.nom} />
        <Field label={"Académie"} value={organisme.adresse?.academie?.nom} />
      </Box>
    </>
  );
}
