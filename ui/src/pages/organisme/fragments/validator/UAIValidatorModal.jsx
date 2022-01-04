import React, { useContext } from "react";
import { OrganismeContext } from "../../Organisme";
import Modal from "../../../../common/dsfr/elements/Modal";
import { Button, ButtonGroup } from "../../../../common/dsfr/elements/Button";
import styled from "styled-components";
import useForm from "../../../../common/form/useForm";
import * as yup from "yup";
import { Form } from "../../../../common/form/Form";
import { _get } from "../../../../common/api/httpClient";
import { UAIPotentielsSelector } from "./UAIPotentielsSelector";
import { UAICustom } from "./UAICustom";

const BlueBox = styled("div")`
  border: 1px solid var(--border-active-blue-france);
  padding: 1.5rem;
  margin-top: 1rem;
  margin-bottom: 3rem;
`;

const validators = yup.object({
  uai: yup.string(),
  custom: yup.string().when("uai", {
    is: (uai) => uai === "custom",
    then: yup.string().test("is-uai-valide", async (value, { createError, path }) => {
      if (!value) {
        return createError({ message: "Le format de l'UAI n'est pas valide", path });
      }

      return _get(`/api/v1/uais/${value}`)
        .then(() => true)
        .catch((e) => {
          if (e.statusCode === 400) {
            return createError({ message: "Le format de l'UAI n'est pas valide", path });
          } else if (e.statusCode === 404) {
            return createError({
              message: "Cette UAI n'existe pas dans la base RAMSESE, merci de renseigner une autre UAI",
              path,
            });
          } else {
            return false;
          }
        });
    }),
    otherwise: yup.string().max(0),
  }),
});

export function UAIValidatorModal({ modal, organisme, validation }) {
  let { actions } = useContext(OrganismeContext);
  let hasPotentiels = organisme.uai_potentiels.length > 0;
  let form = useForm({
    initialValues: hasPotentiels ? { uai: organisme.uai || "", custom: "" } : { uai: "custom", custom: "" },
    yup: validators,
  });

  async function onSubmit(values) {
    actions
      .setUAI(values.uai === "custom" ? values.custom : values.uai)
      .then((updated) => {
        modal.close();
        actions.setOrganisme(updated);
      })
      .catch(() => {
        form.setFormErrors({ uai: "L'uai saisie est invalide" });
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
              {hasPotentiels ? (
                <UAIPotentielsSelector organisme={organisme} validation={validation} />
              ) : (
                <UAICustom organisme={organisme} validation={validation} />
              )}
            </BlueBox>
          </>
        }
        footer={
          <ButtonGroup modifiers={"inline right"}>
            <Button type={"button"} modifiers={"secondary"} onClick={modal.close}>
              Cancel
            </Button>
            <Button type={"submit"} disabled={form.pristine}>
              Valider
            </Button>
          </ButtonGroup>
        }
      />
    </Form>
  );
}
