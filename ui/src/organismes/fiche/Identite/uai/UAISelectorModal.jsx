import React, { useContext } from 'react';
import Modal from '../../../../common/dsfr/elements/Modal.jsx';
import { Button, ButtonGroup } from '../../../../common/dsfr/elements/Button.jsx';
import useForm from '../../../../common/form/useForm.js';
import * as yup from 'yup';
import { Form } from '../../../../common/form/Form.jsx';
import { UAIPotentielsRadios } from './UAIPotentielsRadios.jsx';
import { UAICustom } from './UAICustom.jsx';
import Alert from '../../../../common/dsfr/elements/Alert.jsx';
import BlueBox from '../../../../common/BlueBox.jsx';
import { ApiContext } from '../../../../common/ApiProvider.jsx';
import { UserContext } from '../../../../common/UserProvider.jsx';
import { OrganismeContext } from '../../../../common/organismes/OrganismeProvider.jsx';
const config = require('../../../../config');

const validators = (httpClient) => {
  return yup.object({
    uai: yup.string(),
    custom: yup.string().when('uai', {
      is: (uai) => uai === 'custom',
      then: yup.string().test('is-uai-valide', async (value, { createError, path }) => {
        if (!value) {
          return createError({ message: 'Le format de l\'UAI n\'est pas valide', path });
        }

        return httpClient
          ._get(config.apiUrl + `/uais/${value}`)
          .then(() => true)
          .catch((e) => {
            if (e.statusCode === 400) {
              return createError({ message: 'Le format de l\'UAI n\'est pas valide', path });
            } else if (e.statusCode === 404) {
              return createError({
                message: 'Cette UAI n\'existe pas dans la base RAMSESE, merci de renseigner une autre UAI',
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
  const [userContext] = useContext(UserContext);

  const hasPotentiels = organisme.uai_potentiels.length > 0;
  const form = useForm({
    initialValues: hasPotentiels ? { uai: organisme.uai || '', custom: '' } : { uai: 'custom', custom: '' },
    yup: validators(httpClient),
  });

  function onSubmit(values) {
    const uai = values.uai === 'custom' ? values.custom : values.uai;
    return httpClient
      ._put(config.apiUrl + `/organismes/${organisme.siret}/setUAI`, { uai }, userContext.token)
      .then((updated) => {
        modal.close();
        form.reset();
        onChange(updated, {
          message: (
            <Alert modifiers={'success'}>
              <p>L’UAI que vous avez renseignée pour cet organisme a bien été enregistré</p>
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
        title={'UAI'}
        modal={modal}
        closeModal={modal.close}
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
          <ButtonGroup modifiers={'inline right'}>
            <Button type={'button'} modifiers={'secondary'} onClick={modal.close}>
              Annuler
            </Button>
            <Button type={'submit'} disabled={form.pristine}>
              Valider
            </Button>
          </ButtonGroup>
        }
      />
    </Form>
  );
}
