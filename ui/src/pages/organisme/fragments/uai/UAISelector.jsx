import React from "react";
import { useModal } from "../../../../common/dsfr/common/useModal";
import LinkButton from "../../../../common/dsfr/custom/LinkButton";
import ValidationTag from "../../../../common/ValidationTag";
import { UAISelectorModal } from "./UAISelectorModal";
import { Button } from "../../../../common/dsfr/elements/Button";
import { getValidationType } from "../../../validation/fragments/validation";

const actions = {
  A_VALIDER: {
    actionName: "Choisir l'UAI",
    label: "à valider",
    legend: "Quelle UAI souhaitez-vous utiliser pour immatriculer cet organisme de formation ?",
    ActionButton: function ({ label, onClick, children }) {
      return (
        <div className={"fr-mt-3w"}>
          <Button modifiers={"sm icon-left"} icons={"edit-line"} onClick={onClick}>
            {label}
          </Button>
          {children}
        </div>
      );
    },
  },
  A_RENSEIGNER: {
    actionName: "Renseigner une UAI",
    label: "à renseigner",
    legend: "Quelle UAI souhaitez-vous utiliser pour immatriculer cet organisme de formation ?",
    ActionButton: function ({ label, onClick, children }) {
      return (
        <>
          <a
            title="consulter la fiche Data.gouv"
            href="https://www.data.gouv.fr/fr/datasets/liste-publique-des-organismes-de-formation-l-6351-7-1-du-code-du-travail/"
            target="_blank"
            rel="noopener noreferrer"
            className="fr-text--sm"
          >
            consulter la fiche Data.gouv
          </a>
          <div className={"fr-mt-3w"}>
            <Button modifiers={"sm icon-left"} icons={"edit-line"} onClick={onClick}>
              {label}
            </Button>
            {children}
          </div>
        </>
      );
    },
  },
  VALIDE: {
    actionName: "Modifier l'UAI",
    label: "validée",
    legend: "Par quelle UAI souhaitez-vous remplacer l’UAI validée ?",
    ActionButton: function ({ label, onClick, children }) {
      return (
        <>
          <LinkButton modifiers={"sm icon-left"} icons={"edit-line"} onClick={onClick}>
            {label}
          </LinkButton>
          {children}
        </>
      );
    },
  },
};

export default function UAIValidator({ organisme, ...rest }) {
  let modal = useModal();
  let validationType = getValidationType(organisme);
  let action = actions[validationType];
  let { label, ActionButton } = action;

  return (
    <div style={{ display: "inline" }} {...rest}>
      <ValidationTag type={validationType} label={label} className="fr-mr-3v" />
      <ActionButton label={action.actionName} onClick={() => modal.open()}>
        <UAISelectorModal organisme={organisme} modal={modal} action={action} />
      </ActionButton>
    </div>
  );
}
