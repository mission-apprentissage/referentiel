import { Button, ButtonGroup } from '../../../common/dsfr/elements/Button';
import Modal, { modalSizeModifiers } from '../../../common/dsfr/elements/Modal';
import BlueBox from '../../../common/BlueBox';
import { useFetch } from '../../../common/hooks/useFetch';
import Spinner from '../../../common/Spinner';
import { flattenObject } from '../../../common/utils';
import { Box } from '../../../common/Flexbox';
import Field from '../../../common/Field';
const config = require('../../../config');

export default function DatagouvModal({ modal, siret }) {
  const [{ data: organisme, loading, error }] = useFetch(config.apiUrl + `/datagouv/${siret}`, {});
  const flatten = flattenObject(organisme);
  const asShortKey = (key) => key.split('.')[key.split('.').length - 1];

  return (
    <Modal
      title={'UAI'}
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
            <Box justify={'between'} align={'start'}>
              <Box direction={'column'}>
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
                href="https://www.data.gouv.fr/fr/datasets/liste-publique-des-organismes-de-formation-l-6351-7-1-du-code-du-travail/"
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
        <ButtonGroup modifiers={'inline right'}>
          <Button onClick={() => modal.close()}>Fermer</Button>
        </ButtonGroup>
      }
    />
  );
}
