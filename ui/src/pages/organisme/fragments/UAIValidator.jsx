import React, { useContext } from "react";
import { Button, ButtonGroup } from "../../../common/components/dsfr/elements/Button";
import { useModal } from "../../../common/components/dsfr/common/useModal";
import Modal from "../../../common/components/dsfr/elements/Modal";
import { Field, Form, Formik } from "formik";
import Radio from "../../../common/components/dsfr/elements/Radio";
import Fieldset from "../../../common/components/dsfr/elements/Fieldset";
import styled from "styled-components";
import { OrganismeContext } from "../Organisme";
import { Tag } from "../../../common/components/dsfr/elements/Tag";
import Input from "../../../common/components/dsfr/elements/Input";
import { asValidation, validators } from "../../../common/formikUtils";

const BlueBox = styled("div")`
  border: 1px solid var(--border-active-blue-france);
  padding: 1.5rem;
  margin-top: 1rem;
  margin-bottom: 3rem;
`;

export const ValidationTag = styled(({ organisme, ...rest }) => {
  let label = organisme.uai ? "Validé" : "À valider";
  let icon = `${organisme.uai ? "check-line" : "error-warning-line"}`;

  return (
    <Tag modifiers="sm icon-left" icons={icon} {...rest}>
      {label}
    </Tag>
  );
})`
  &.fr-fi-check-line::before {
    color: var(--text-default-success);
  }

  &.fr-fi-error-warning-line::before {
    color: var(--text-default-warning);
  }
`;

function CustomUAIField({ ...props }) {
  function validateInput(value) {
    //TODO add async call to check if uai is valid
    return !value
      ? null
      : validators.uai
          .validate(value)
          .then(() => null)
          .catch((e) => {
            return e.errors.join(" ,");
          });
  }

  return (
    <div>
      <Field as={Radio} label={"Autre"} value={"custom"} {...props} />
      {props.checked && (
        <Field name="custom" validate={validateInput}>
          {({ field, form }) => {
            let { touched, errors } = form;
            return <Input {...field} className={"fr-ml-2w"} validation={asValidation(touched, errors, "custom")} />;
          }}
        </Field>
      )}
    </div>
  );
}

export default function UAIValidator({ organisme, ...rest }) {
  let modal = useModal();
  let { validateUAI, setOrganisme } = useContext(OrganismeContext);
  let actionName = organisme.uai ? "Modifier l'UAI" : "Sélectionner et valider l'UAI";

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
    <div style={{ display: "inline" }} {...rest}>
      <ValidationTag className="fr-mr-3v" organisme={organisme} />
      <Button modifiers={"sm icon-left"} icons={"edit-line"} onClick={() => modal.open()}>
        {actionName}
      </Button>
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
                      <span className="fr-fi-arrow-right-line fr-fi--lg">{actionName}</span>
                    </h1>
                    <BlueBox>
                      <Fieldset
                        legend={"Par quelle UAI souhaitez-vous remplacer l’UAI validée ?"}
                        validation={asValidation(touched, errors, "uai")}
                      >
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
                        <CustomUAIField name={"uai"} checked={values.uai === "custom"} />
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
    </div>
  );
}
