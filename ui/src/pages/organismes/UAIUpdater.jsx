import React from "react";
import { Button, ButtonGroup } from "../../common/components/dsfr/elements/Button";
import cs from "classnames";
import { useModal } from "../../common/components/dsfr/common/useModal";
import Modal from "../../common/components/dsfr/elements/Modal";
import { Field, Formik } from "formik";
import Radio from "../../common/components/dsfr/elements/Radio";
import Fieldset from "../../common/components/dsfr/elements/Fieldset";
import styled from "styled-components";

const Active = styled("div")`
  border: 1px solid var(--border-active-blue-france);
  padding: 1.5rem;
  margin-top: 1rem;
  margin-bottom: 3rem;
`;

export default function UAIUpdater({ organisme, className }) {
  let modal = useModal();
  let actionName = organisme.uai ? "Modifier l'UAI" : "Sélectionner et valider l'UAI";

  return (
    <>
      <Button
        modifiers={"sm"}
        className={cs("fr-fi-edit-line fr-btn--icon-left", className)}
        onClick={() => modal.open()}
      >
        {actionName}
      </Button>
      <Formik
        initialValues={{ uai: organisme.uai }}
        onSubmit={(values, actions) => {
          alert(JSON.stringify(values, null, 2));
          actions.setSubmitting(false);
        }}
      >
        {({ handleSubmit, errors }) => (
          <Modal
            title={"UAI"}
            modal={modal}
            content={
              <>
                <h1 className="fr-modal__title">
                  <span className="fr-fi-arrow-right-line fr-fi--lg">{actionName}</span>
                </h1>
                <form onSubmit={handleSubmit}>
                  <Active>
                    <Fieldset
                      legend={"Par quelle UAI souhaitez-vous remplacer l’UAI validée ?"}
                      {...(errors ? { validation: errors.name } : {})}
                    >
                      {organisme.uais.map(({ uai, sources }, index) => {
                        return (
                          <Field
                            as={Radio}
                            key={index}
                            name="uai"
                            label={uai}
                            value={uai}
                            hint={`Sources: ${sources.join(" ,")}`}
                          />
                        );
                      })}
                    </Fieldset>
                  </Active>
                </form>
              </>
            }
            footer={
              <ButtonGroup modifiers={"inline right"}>
                <Button type={"button"} modifiers={"secondary"} onClick={modal.close}>
                  Cancel
                </Button>
                <Button type={"submit"}>Valider</Button>
              </ButtonGroup>
            }
          />
        )}
      </Formik>
    </>
  );
}
