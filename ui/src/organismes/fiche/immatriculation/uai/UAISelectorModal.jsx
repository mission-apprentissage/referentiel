import React, { useContext } from "react";
import Modal from "../../../../common/dsfr/elements/Modal";
import { Button, ButtonGroup } from "../../../../common/dsfr/elements/Button";
import useForm from "../../../../common/form/useForm";
import * as yup from "yup";
import { Form } from "../../../../common/form/Form";
import { _get, _put } from "../../../../common/api/httpClient";
import { UAIPotentielsRadios } from "./UAIPotentielsRadios";
import { UAICustom } from "./UAICustom";
import Alert from "../../../../common/dsfr/elements/Alert";
import { OrganismeContext } from "../../../../pages/OrganismePage";
import BlueBox from "../../../../common/BlueBox";

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

export function UAISelectorModal({ modal, organisme, action }) {
  let hasPotentiels = organisme.uai_potentiels.length > 0;
  let { updateOrganisme } = useContext(OrganismeContext);
  let form = useForm({
    initialValues: hasPotentiels ? { uai: organisme.uai || "", custom: "" } : { uai: "custom", custom: "" },
    yup: validators,
  });

  function onSubmit(values) {
    const uai = values.uai === "custom" ? values.custom : values.uai;
    return _put(`/api/v1/organismes/${organisme.siret}/setUAI`, { uai }).then((updated) => {
      modal.close();
      updateOrganisme(updated, {
        message: (
          <Alert modifiers={"success"}>
            <p>L’UAI que vous avez renseignée pour cet organisme a bien été enregistré</p>
          </Alert>
        ),
      });
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
              <span className="fr-fi-arrow-right-line fr-fi--lg">{action.actionName}</span>
            </h1>
            <BlueBox>
              {hasPotentiels ? (
                <UAIPotentielsRadios organisme={organisme} action={action} />
              ) : (
                <UAICustom action={action} />
              )}
            </BlueBox>
          </>
        }
        footer={
          <ButtonGroup modifiers={"inline right"}>
            <Button type={"button"} modifiers={"secondary"} onClick={modal.close}>
              Annuler
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
