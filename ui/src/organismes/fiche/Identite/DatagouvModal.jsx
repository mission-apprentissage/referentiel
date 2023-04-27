import { Button, ButtonGroup } from "../../../common/dsfr/elements/Button.jsx";
import Modal, { modalSizeModifiers } from "../../../common/dsfr/elements/Modal.jsx";
import BlueBox from "../../../common/BlueBox.jsx";
import { useFetch } from "../../../common/hooks/useFetch.js";
import Spinner from "../../../common/Spinner.jsx";
import { flattenObject } from "../../../common/utils.js";
import { Box } from "../../../common/Flexbox.jsx";
import Field from "../../../common/Field.jsx";
import React from "react";

export default function DatagouvModal({ modal, siret }) {
  const [{ data: organisme, loading, error }] = useFetch(`/api/v1/datagouv/${siret}`, {});
  const flatten = flattenObject(organisme);
  const asShortKey = (key) => key.split(".")[key.split(".").length - 1];

  return (
    <Modal
      title={"UAI"}
      modal={modal}
      modifiers={modalSizeModifiers.lg}
      closeModal={modal.close}
      content={
        <>
          <h1 className="fr-modal__title">
            <span className="fr-fi-arrow-right-line fr-fi--lg">
              Données de la Liste publique des Organismes de Formation (data.gouv)
            </span>
          </h1>

          <BlueBox>
            <Box justify={"between"} align={"start"}>
              <Box direction={"column"}>
                {loading || error ? (
                  <Spinner loading={loading} error={error} />
                ) : (
                  Object.keys(flatten).map((key, index) => {
                    return <Field key={index} label={asShortKey(key)} value={flatten[key]} />;
                  })
                )}
              </Box>

              <a
                title="consulter la fiche Data.gouv"
                href="ui/src/organismes/fiche/Identite/DatagouvModal.jsx"
                target="_blank"
                rel="noopener noreferrer"
                className="fr-text--sm"
              >
                consulter la fiche Data.gouv
              </a>
            </Box>
          </BlueBox>
        </>
      }
      footer={
        <ButtonGroup modifiers={"inline right"}>
          <Button onClick={() => modal.close()}>Fermer</Button>
        </ButtonGroup>
      }
    />
  );
}
