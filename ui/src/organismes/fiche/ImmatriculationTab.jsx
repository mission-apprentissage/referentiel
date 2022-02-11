import React, { useContext, useEffect, useState } from "react";
import UAIValidator from "./uai/UAISelector";
import Natures from "../common/Natures";
import Siret from "../common/Siret";
import { Box } from "../../common/Flexbox";
import LinkButton from "../../common/dsfr/custom/LinkButton";
import { useModal } from "../../common/dsfr/common/useModal";
import DatagouvModal from "./DatagouvModal";
import Field from "../../common/Field";
import { AuthContext } from "../../common/AuthRoutes";
import { Col, GridRow } from "../../common/dsfr/fondamentaux";
import { DateTime } from "luxon";
import styled from "styled-components";

const referentielsMapper = {
  "catalogue-etablissements": "Catalogue de formation",
  datagouv: "Liste publique des organismes de formation",
  "sifa-ramsese": "SIFA",
};

const Meta = styled("div")`
  font-size: 0.75rem;
`;

export default function ImmatriculationTab({ organisme }) {
  let [auth] = useContext(AuthContext);
  let [showDatagouvModal, setShowDatagouvModal] = useState(false);
  let adresse = organisme.adresse;
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
      <GridRow>
        <Col modifiers={"12 sm-8"}>
          <Box direction={"column"}>
            <Field label={"UAI"} value={organisme.uai}>
              {adresse && adresse[auth.type].code === auth.code && (
                <UAIValidator className="fr-ml-3v" organisme={organisme} />
              )}
            </Field>
            <Field label={"Nature"} value={<Natures organisme={organisme} />} />
            <Field label={"SIREN"} value={organisme.siret.substring(0, 9)} />
            <Field
              label={"SIRET"}
              value={
                <Siret organisme={organisme}>
                  <span className={"fr-ml-1w"}>
                    {organisme.etat_administratif === "actif" ? "en activité" : "fermé"}
                  </span>
                </Siret>
              }
            />
            <Field label={"NDA"} value={organisme.numero_declaration_activite} />
            <Field label={"Certifié Qualiopi"} value={organisme.qualiopi ? "Oui" : "Non"} />
          </Box>
          <Box direction={"column"} className={"fr-mt-5w"}>
            <Field label={"Enseigne"} value={organisme.enseigne} />
            <Field label={"Raison sociale"} value={organisme.raison_sociale} />
            <Field label={"Réseaux"} value={organisme.reseaux.join(" ,")} />
            <Field label={"Adresse"} value={adresse?.label || `${adresse?.code_postal} ${adresse?.localite}`} />
            <Field label={"Région"} value={adresse?.region?.nom} />
            <Field label={"Académie"} value={adresse?.academie?.nom} />
          </Box>
        </Col>
        <Col modifiers={"sm-4"} className={"xfr-display-xs-none xfr-display-sm-block"}>
          <Meta>
            Date d’import de l’organisme :{" "}
            {DateTime.fromISO(organisme._meta.import_date).setLocale("fr").toFormat("dd/MM/yyyy")}
          </Meta>
          <Meta>Source : {organisme.referentiels.map((r) => referentielsMapper[r]).join(",")}</Meta>
        </Col>
      </GridRow>
    </>
  );
}
