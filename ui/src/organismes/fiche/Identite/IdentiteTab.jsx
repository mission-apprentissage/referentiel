import React, { useContext } from 'react';
import { Box } from '../../../common/Flexbox.jsx';
import LinkButton from '../../../common/dsfr/custom/LinkButton.jsx';
import { useModal } from '../../../common/dsfr/common/useModal.js';
import DatagouvModal from './DatagouvModal.jsx';
import { Col, GridRow } from '../../../common/dsfr/fondamentaux/index.js';
import Field from '../../../common/Field.jsx';
import UAIValidator from './uai/UAISelector.jsx';
import Nature from '../../../common/organismes/Nature.jsx';
import Siret from '../../../common/organismes/Siret.jsx';
import { DateTime } from 'luxon';
import styled from 'styled-components';
import Adresse from '../../../common/organismes/Adresse.jsx';
import { UserContext } from '../../../common/UserProvider.jsx';
import definitions from '../../../common/definitions.json';

const referentielsMapper = {
  'catalogue-etablissements': 'Catalogue de formation',
  datagouv: 'Liste publique des organismes de formation',
  'sifa-ramsese': 'SIFA',
};

const Meta = styled('div')`
  font-size: 0.75rem;
`;

export default function IdentiteTab({ organisme }) {
  const datagouvModal = useModal();
  const [userContext] = useContext(UserContext);
  const showValidator =
    (!userContext.isAnonymous && organisme.adresse && organisme.adresse[userContext.type].code === userContext.code) ||
    userContext.isAdmin;

  return (
    <>
      <Box justify={'between'}>
        <h6>Identité</h6>
        {organisme.referentiels.includes('datagouv') && organisme.uai_potentiels.length === 0 && (
          <>
            <LinkButton modifiers={'icon-right'} icons={'arrow-right-line'} onClick={() => datagouvModal.open()}>
              Afficher les données de la Liste publique des organismes de formation
            </LinkButton>
            {<DatagouvModal modal={datagouvModal} siret={organisme.siret} />}
          </>
        )}
      </Box>
      <GridRow>
        <Col modifiers={'12 sm-8'}>
          <Box direction={'column'}>
            <Field label={'UAI'} value={organisme.uai} tooltip={definitions.uai}>
              {showValidator && <UAIValidator className="fr-ml-3v" organisme={organisme} />}
            </Field>
            <Field label={'Nature'} value={<Nature organisme={organisme} />} tooltip={definitions.nature} />
            <Field label={'SIREN'} value={organisme.siret.substring(0, 9)} tooltip={definitions.siren} />
            <Field label={'SIRET'} value={<Siret organisme={organisme} />} tooltip={definitions.siret} />
            <Field label={'NDA'} value={organisme.numero_declaration_activite} tooltip={definitions.nda} />
            <Field
              label={'Certifié Qualiopi'}
              value={organisme.qualiopi ? 'Oui' : 'Non'}
              tooltip={definitions.qualiopi}
            />
          </Box>
          <Box direction={'column'} className={'fr-mt-5w'}>
            <Field label={'Enseigne'} value={organisme.enseigne} tooltip={definitions.enseigne} />
            <Field label={'Raison sociale'} value={organisme.raison_sociale} tooltip={definitions.raison_sociale} />
            <Field
              label={'Réseaux'}
              value={organisme.reseaux.map((r) => r.code).join(' ,')}
              tooltip={definitions.reseau}
            />
            <Field label={'Adresse'} value={<Adresse organisme={organisme} />} tooltip={definitions.adresse} />
            <Field label={'Région'} value={organisme.adresse?.region?.nom} tooltip={definitions.region} />
            <Field label={'Académie'} value={organisme.adresse?.academie?.nom} tooltip={definitions.academie} />
          </Box>
        </Col>
        <Col modifiers={'sm-4'} className={'xfr-display-xs-none xfr-display-sm-block'} style={{ textAlign: 'right' }}>
          <Meta>
            Date d’import de l’organisme :{' '}
            {DateTime.fromISO(organisme._meta.date_import).setLocale('fr').toFormat('dd/MM/yyyy')}
          </Meta>
          <Meta>
            Source{organisme.referentiels.map((r) => referentielsMapper[r]).length > 1 ? 's' : ''} :{' '}
            {organisme.referentiels.map((r) => referentielsMapper[r]).join(', ')}
          </Meta>
        </Col>
      </GridRow>
    </>
  );
}
