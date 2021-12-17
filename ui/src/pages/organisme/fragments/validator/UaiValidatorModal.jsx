import React, { useContext } from "react";
import { OrganismeContext } from "../../Organisme";
import Modal from "../../../../common/components/dsfr/elements/Modal";
import Fieldset from "../../../../common/components/dsfr/elements/Fieldset";
import Radio from "../../../../common/components/dsfr/elements/Radio";
import { Button, ButtonGroup } from "../../../../common/components/dsfr/elements/Button";
import styled from "styled-components";
import useForm from "../../../../common/hooks/useForm";
import * as yup from "yup";
import { Form } from "../../../../common/components/Form";
import { CustomUAIInput } from "./CustomUAIInput";

const BlueBox = styled("div")`
  border: 1px solid var(--border-active-blue-france);
  padding: 1.5rem;
  margin-top: 1rem;
  margin-bottom: 3rem;
`;

export function UaiValidatorModal({ modal, organisme, validation }) {
  let { validateUAI, setOrganisme } = useContext(OrganismeContext);
  let form = useForm({
    initialValues: { uai: organisme.uai || "", custom: "" },
    yup: yup.object({
      uai: yup.string(),
      custom: yup.string().when("uai", {
        is: (uai) => uai === "custom",
        then: yup.string().test("is-uai-valide", "L'uai n'est pas au bon format ou n'existe pas", async (value) => {
          return /^[0-9]{7}[A-Z]{1}$/.test(value);
        }),
        otherwise: yup.string().max(0),
      }),
    }),
  });
  let { registerField, setFormErrors } = form;

  async function onSubmit(values) {
    validateUAI(values.uai === "custom" ? values.custom : values.uai)
      .then((updated) => {
        modal.close();
        setOrganisme(updated);
      })
      .catch(() => {
        setFormErrors({ uai: "L'uai saisie est invalide" });
      });
  }

  return (
    <Form onSubmit={onSubmit} {...form}>
      <Modal
        title={"UAI"}
        modal={modal}
        content={
          <>
            <h1 className="fr-modal__title">
              <span className="fr-fi-arrow-right-line fr-fi--lg">{validation.actionName}</span>
            </h1>
            <BlueBox>
              <Fieldset legend={validation.legend}>
                {organisme.uai_potentiels.map(({ uai, sources }, index) => {
                  return (
                    <Radio
                      {...registerField("uai")}
                      key={index}
                      label={uai}
                      value={uai}
                      hint={`Sources: ${sources.join(" ,")}`}
                    />
                  );
                })}
              </Fieldset>
              <CustomUAIInput />
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
}
