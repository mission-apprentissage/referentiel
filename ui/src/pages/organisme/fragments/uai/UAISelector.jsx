import React from "react";
import { useModal } from "../../../../common/dsfr/common/useModal";
import LinkButton from "../../../../common/dsfr/custom/LinkButton";
import ValidationTag from "../../../../common/ValidationTag";
import { UAISelectorModal } from "./UAISelectorModal";
import { Button } from "../../../../common/dsfr/elements/Button";

const actions = {
  A_VALIDER: {
    actionName: "Choisir l'UAI",
    label: "à valider",
    legend: "Quelle UAI souhaitez-vous utiliser pour immatriculer cet OF-CFA ?",
    render: function (organisme, modal) {
      return (
        <div className={"fr-mt-3w"}>
          <Button modifiers={"sm icon-left"} icons={"edit-line"} onClick={() => modal.open()}>
            {this.actionName}
          </Button>
          <UAISelectorModal modal={modal} organisme={organisme} action={this} />
        </div>
      );
    },
  },
  A_RENSEIGNER: {
    actionName: "Renseigner une UAI",
    label: "à renseigner",
    legend: "Quelle UAI souhaitez-vous utiliser pour immatriculer cet OF-CFA ?",
    render: function (organisme, modal) {
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
            <Button modifiers={"sm icon-left"} icons={"edit-line"} onClick={() => modal.open()}>
              {this.actionName}
            </Button>
            <UAISelectorModal modal={modal} organisme={organisme} action={this} />
          </div>
        </>
      );
    },
  },
  VALIDE: {
    actionName: "Modifier l'UAI",
    label: "validée",
    legend: "Par quelle UAI souhaitez-vous remplacer l’UAI validée ?",
    render: function (organisme, modal) {
      return (
        <>
          <LinkButton modifiers={"sm icon-left"} icons={"edit-line"} onClick={() => modal.open()}>
            {this.actionName}
          </LinkButton>
          <UAISelectorModal modal={modal} organisme={organisme} action={this} />
        </>
      );
    },
  },
};

export default function UAIValidator({ organisme, ...rest }) {
  let modal = useModal();
  let validation = organisme._meta.validation;
  let action = actions[validation];

  return (
    <div style={{ display: "inline" }} {...rest}>
      <ValidationTag type={validation} label={action.label} className="fr-mr-3v" />
      {action.render(organisme, modal)}
    </div>
  );
}
