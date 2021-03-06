import React, { useContext } from "react";
import Modal from "../../../../common/dsfr/elements/Modal";
import { Button, ButtonGroup } from "../../../../common/dsfr/elements/Button";
import useForm from "../../../../common/form/useForm";
import * as yup from "yup";
import { Form } from "../../../../common/form/Form";
import { UAIPotentielsRadios } from "./UAIPotentielsRadios";
import { UAICustom } from "./UAICustom";
import Alert from "../../../../common/dsfr/elements/Alert";
import BlueBox from "../../../../common/BlueBox";
import { ApiContext } from "../../../../common/ApiProvider";
import { OrganismeContext } from "../../../OrganismeProvider";

const validators = (httpClient) => {
  return yup.object({
    uai: yup.string(),
    custom: yup.string().when("uai", {
      is: (uai) => uai === "custom",
      then: yup.string().test("is-uai-valide", async (value, { createError, path }) => {
        if (!value) {
          return createError({ message: "Le format de l'UAI n'est pas valide", path });
        }

        return httpClient
          ._get(`/api/v1/uais/${value}`)
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
};

export function UAISelectorModal({ modal, organisme, action }) {
  const { httpClient } = useContext(ApiContext);
  const { onChange } = useContext(OrganismeContext);
  const hasPotentiels = organisme.uai_potentiels.length > 0;
  const form = useForm({
    initialValues: hasPotentiels ? { uai: organisme.uai || "", custom: "" } : { uai: "custom", custom: "" },
    yup: validators(httpClient),
  });

  function onSubmit(values) {
    const uai = values.uai === "custom" ? values.custom : values.uai;
    return httpClient
      ._put(`/api/v1/organismes/${organisme.siret}/setUAI`, { uai })
      .then((updated) => {
        modal.close();
        onChange(updated, {
          message: (
            <Alert modifiers={"success"}>
              <p>L???UAI que vous avez renseign??e pour cet organisme a bien ??t?? enregistr??</p>
            </Alert>
          ),
        });
      })
      .catch((e) => {
        console.error(e);
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
