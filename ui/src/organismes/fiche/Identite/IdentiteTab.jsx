import React, { useContext } from "react";
import { Box } from "../../../common/Flexbox";
import LinkButton from "../../../common/dsfr/custom/LinkButton";
import { useModal } from "../../../common/dsfr/common/useModal";
import DatagouvModal from "./DatagouvModal";
import { Col, GridRow } from "../../../common/dsfr/fondamentaux";
import Field from "../../../common/Field";
import UAIValidator from "./uai/UAISelector";
import Nature from "../../common/Nature";
import Siret from "../../common/Siret";
import { DateTime } from "luxon";
import styled from "styled-components";
import Adresse from "../../common/Adresse";
import { ApiContext } from "../../../common/ApiProvider";
import definitions from "../../../common/definitions.json";

const referentielsMapper = {
  "catalogue-etablissements": "Catalogue de formation",
  datagouv: "Liste publique des organismes de formation",
  "sifa-ramsese": "SIFA",
};

const Meta = styled("div")`
  font-size: 0.75rem;
`;

export default function IdentiteTab({ organisme }) {
  let datagouvModal = useModal();
  let { auth, isAnonymous } = useContext(ApiContext);
  let showValidator = !isAnonymous() && organisme.adresse && organisme.adresse[auth.type].code === auth.code;

  return (
    <>
      <Box justify={"between"}>
        <h6>Identité</h6>
        {organisme.referentiels.includes("datagouv") && organisme.uai_potentiels.length === 0 && (
          <>
            <LinkButton modifiers={"icon-right"} icons={"arrow-right-line"} onClick={() => datagouvModal.open()}>
              Afficher les données de la Liste publique des Organismes de Formations
            </LinkButton>
            {<DatagouvModal modal={datagouvModal} siret={organisme.siret} />}
          </>
        )}
      </Box>
      <GridRow>
        <Col modifiers={"12 sm-8"}>
          <Box direction={"column"}>
            <Field label={"UAI"} value={organisme.uai} tooltip={definitions.organisme}>
              {showValidator && <UAIValidator className="fr-ml-3v" organisme={organisme} />}
            </Field>
            <Field label={"Nature"} value={<Nature organisme={organisme} />} tooltip={definitions.nature} />
            <Field label={"SIREN"} value={organisme.siret.substring(0, 9)} tooltip={definitions.siren} />
            <Field label={"SIRET"} value={<Siret organisme={organisme} />} tooltip={definitions.siret} />
            <Field label={"NDA"} value={organisme.numero_declaration_activite} tooltip={definitions.nda} />
            <Field
              label={"Certifié Qualiopi"}
              value={organisme.qualiopi ? "Oui" : "Non"}
              tooltip={definitions.qualiopi}
            />
          </Box>
          <Box direction={"column"} className={"fr-mt-5w"}>
            <Field label={"Enseigne"} value={organisme.enseigne} tooltip={definitions.enseigne} />
            <Field label={"Raison sociale"} value={organisme.raison_sociale} tooltip={definitions.raison_sociale} />
            <Field label={"Réseaux"} value={organisme.reseaux.join(" ,")} tooltip={definitions.reseau} />
            <Field label={"Adresse"} value={<Adresse organisme={organisme} />} tooltip={definitions.adresse} />
            <Field label={"Région"} value={organisme.adresse?.region?.nom} tooltip={definitions.region} />
            <Field label={"Académie"} value={organisme.adresse?.academie?.nom} tooltip={definitions.academie} />
          </Box>
        </Col>
        <Col modifiers={"sm-4"} className={"xfr-display-xs-none xfr-display-sm-block"} style={{ textAlign: "right" }}>
          <Meta>
            Date d’import de l’organisme :{" "}
            {DateTime.fromISO(organisme._meta.date_import).setLocale("fr").toFormat("dd/MM/yyyy")}
          </Meta>
          <Meta>Source : {organisme.referentiels.map((r) => referentielsMapper[r]).join(", ")}</Meta>
        </Col>
      </GridRow>
    </>
  );
}
