import React from "react";
import { useModal } from "../../../../common/components/dsfr/common/useModal";
import LinkButton from "../../../../common/components/dsfr/custom/LinkButton";
import ValidationTag from "./ValidationTag";
import { UaiValidatorModal } from "./UaiValidatorModal";
import { Button } from "../../../../common/components/dsfr/elements/Button";

const actions = {
  A_VALIDER: {
    type: "A_VALIDER",
    label: "à valider",
    icon: "error-warning-fill",
    legend: "Quelle UAI souhaitez-vous utiliser pour immatriculer cet OF-CFA ?",
    actionName: "Choisir l'UAI",
    showAction: function (organisme, modal) {
      return (
        <div className={"fr-mt-3w"}>
          <Button modifiers={"sm icon-left"} icons={"edit-line"} onClick={() => modal.open()}>
            {this.actionName}
          </Button>
          <UaiValidatorModal modal={modal} organisme={organisme} validation={this} />
        </div>
      );
    },
  },
  INCONNUE: {
    type: "INCONNUE",
    label: "inconnue",
    icon: "error-warning-fill",
    legend: "",
    actionName: "",
    showAction: function () {
      return (
        <a
          title="consulter la fiche Data.gouv"
          href="https://www.data.gouv.fr/fr/datasets/liste-publique-des-organismes-de-formation-l-6351-7-1-du-code-du-travail/"
          target="_blank"
          rel="noopener noreferrer"
          className="fr-text--sm"
        >
          consulter la fiche Data.gouv
        </a>
      );
    },
  },
  VALIDEE: {
    type: "VALIDEE",
    label: "validée",
    icon: "checkbox-circle-fill",
    legend: "Par quelle UAI souhaitez-vous remplacer l’UAI validée ?",
    actionName: "Modifier l'UAI",
    showAction: function (organisme, modal) {
      return (
        <>
          <LinkButton modifiers={"sm icon-left"} icons={"edit-line"} onClick={() => modal.open()}>
            {this.actionName}
          </LinkButton>
          <UaiValidatorModal modal={modal} organisme={organisme} validation={this} />
        </>
      );
    },
  },
};

export default function UAIValidator({ organisme, ...rest }) {
  let modal = useModal();
  let validation = actions[organisme._meta.validation];

  return (
    <div style={{ display: "inline" }} {...rest}>
      <ValidationTag validation={validation} className="fr-mr-3v" />
      {validation.showAction(organisme, modal)}
    </div>
  );
}
