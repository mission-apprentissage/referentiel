import { Button, ButtonGroup } from "../../../common/dsfr/elements/Button";
import Modal, { modalSizeModifiers } from "../../../common/dsfr/elements/Modal";
import BlueBox from "../../../common/BlueBox";
import React from "react";
import { Box } from "../../../common/Flexbox";
import Field from "../../../common/Field";
import Nature from "../../common/Nature";
import Siret from "../../common/Siret";
import RaisonSociale from "../../common/RaisonSociale";
import definitions from "../../../common/definitions.json";
import LinkButton from "../../../common/dsfr/custom/LinkButton";
import { useNavigate } from "react-router-dom";

export default function RelationModal({ modal, organisme }) {
  let navigate = useNavigate();

  return (
    <Modal
      title={"UAI"}
      modal={modal}
      modifiers={modalSizeModifiers.lg}
      content={
        organisme ? (
          <>
            <h1 className="fr-modal__title">
              <RaisonSociale organisme={organisme} />
            </h1>

            <BlueBox>
              <Box justify={"between"}>
                <Box direction={"column"}>
                  <Field label={"UAI"} value={organisme.uai} tooltip={definitions.uai} />
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
                <div>
                  <LinkButton
                    modifiers={"sm icon-right"}
                    icons={"arrow-right-line"}
                    onClick={() => {
                      modal.close();
                      navigate(`/organismes/${organisme.siret}`);
                    }}
                  >
                    Consulter la fiche
                  </LinkButton>
                </div>
              </Box>

              <Box direction={"column"} className={"fr-mt-5w"}>
                <Field label={"Enseigne"} value={organisme.enseigne} tooltip={definitions.enseigne} />
                <Field label={"Raison sociale"} value={organisme.raison_sociale} tooltip={definitions.raison_sociale} />
                <Field label={"Réseaux"} value={organisme.reseaux.join(" ,")} tooltip={definitions.reseaux} />
                <Field
                  label={"Adresse"}
                  value={organisme.adresse?.label || `${organisme.adresse?.code_postal} ${organisme.adresse?.localite}`}
                  tooltip={definitions.adresse}
                />
                <Field label={"Région"} value={organisme.adresse?.region?.nom} tooltip={definitions.region} />
                <Field label={"Académie"} value={organisme.adresse?.academie?.nom} tooltip={definitions.academie} />
              </Box>
            </BlueBox>
          </>
        ) : (
          <div />
        )
      }
      footer={
        <ButtonGroup modifiers={"inline right"}>
          <Button onClick={() => modal.close()}>Fermer</Button>
        </ButtonGroup>
      }
    />
  );
}
