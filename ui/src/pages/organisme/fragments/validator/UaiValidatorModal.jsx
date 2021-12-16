import React, { useContext } from "react";
import { OrganismeContext } from "../../Organisme";
import { Field, Form, Formik } from "formik";
import Modal from "../../../../common/components/dsfr/elements/Modal";
import Fieldset from "../../../../common/components/dsfr/elements/Fieldset";
import { asFormValidation } from "../../../../common/formikUtils";
import Radio from "../../../../common/components/dsfr/elements/Radio";
import { RadioWithInput } from "./RadioWithInput";
import { Button, ButtonGroup } from "../../../../common/components/dsfr/elements/Button";
import styled from "styled-components";

const BlueBox = styled("div")`
  border: 1px solid var(--border-active-blue-france);
  padding: 1.5rem;
  margin-top: 1rem;
  margin-bottom: 3rem;
`;

export function UaiValidatorModal({ modal, organisme, validation }) {
  let { validateUAI, setOrganisme } = useContext(OrganismeContext);

  async function onSubmit(values, actions) {
    validateUAI(values.uai === "custom" ? values.custom : values.uai)
      .then((updated) => {
        actions.setSubmitting(false);
        modal.close();
        setOrganisme(updated);
      })
      .catch(() => {
        actions.setErrors({ uai: "L'uai saisie est invalide" });
      });
  }

  return (
    <Formik initialValues={{ uai: organisme.uai, custom: "" }} onSubmit={onSubmit}>
      {({ values, touched, errors }) => {
        return (
          <Form>
            <Modal
              title={"UAI"}
              modal={modal}
              content={
                <>
                  <h1 className="fr-modal__title">
                    <span className="fr-fi-arrow-right-line fr-fi--lg">{validation.actionName}</span>
                  </h1>
                  <BlueBox>
                    <Fieldset legend={validation.legend} validation={asFormValidation(touched, errors, "uai")}>
                      {organisme.uais.map(({ uai, sources }, index) => {
                        return (
                          <Field
                            as={Radio}
                            key={index}
                            name="uai"
                            label={uai}
                            value={uai}
                            checked={values.uai === uai}
                            hint={`Sources: ${sources.join(" ,")}`}
                          />
                        );
                      })}
                      <RadioWithInput name={"uai"} checked={values.uai === "custom"} />
                    </Fieldset>
                  </BlueBox>
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
          </Form>
        );
      }}
    </Formik>
  );
}
