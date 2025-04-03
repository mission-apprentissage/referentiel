/**
 *
 */

import { Col, GridRow } from '../common/dsfr/fondamentaux';
import { useContext } from 'react';
import ValidationCard from './cards/ValidationCard';
import DepartementAuthSelector from '../common/organismes/selectors/DepartementAuthSelector';
import { ContentLayout, TitleLayout } from '../common/layout';
import { useQuery, useToggle } from '../common/hooks';
import { UserContext } from '../common/UserProvider';
import NouveauxCounter from './cards/NouveauxCounter';
import LinkButton from '../common/dsfr/custom/LinkButton';
import styled from 'styled-components';
import Page from '../common/Page';
import Highlight from '../common/dsfr/elements/Highlight';


const Presentation = styled(({ className }) => {
  const [showDetails, toggleDetails] = useToggle(false);

  return (
    <div className={className}>
      <Highlight>
        Ce tableau de bord permet de consulter les organismes du Référentiel dont les UAI sont à vérifier, à identifier
        ou validées sur le territoire sélectionné.
      </Highlight>

      <div className={'details fr-mt-2w'}>
        <LinkButton
          className={'fr-mb-2w'}
          modifiers={'sm icon-right'}
          icons={`arrow-${showDetails ? 'up' : 'down'}-s-line`}
          onClick={() => toggleDetails()}
        >
          Comment sont sélectionnés les organismes à vérifier ou à identifier
        </LinkButton>
        {showDetails && (
          <>
            <div className={'fr-text--bold'}>Les organismes :</div>
            <ul>
              <li>sont identifiés par un SIRET en activité ;</li>
              <li>
                sont trouvés dans la Liste publique des organismes de formation (DGEFP) ou le Catalogue des formations
                en apprentissage (RCO) avec une certification Qualiopi valide ;
              </li>
              <li>ont eu un lien avec des formations en apprentissage à un moment donné ;</li>
            </ul>
          </>
        )}
      </div>
    </div>
  );
})`
  .fr-highlight {
    margin-left: 0;
    padding-left: 2rem;
  }
  .details {
    padding-left: 2rem;
  }
`;

export default function TableauDeBordPage () {
  const [userContext] = useContext(UserContext);

  const { query, setQuery } = useQuery();
  const title = userContext.isAdmin
    ? 'Tous les organismes'
    : `${userContext.type === 'region' ? 'Région' : 'Académie'} : ${userContext.nom}`;

  return (
    <Page>
      <TitleLayout
        title={title}
        selector={
          !userContext.isAdmin && (
            <DepartementAuthSelector
              departement={query.departements}
              onChange={(code) => setQuery({ ...query, departements: code })}
            />
          )
        }
      />
      <ContentLayout>
        <GridRow modifiers={'gutters'} className={'fr-pb-3w'}>
          <Col modifiers={'12'}>
            <Presentation />
          </Col>
        </GridRow>

        <GridRow modifiers={'gutters'} className={'fr-mb-3w'}>
          <Col modifiers={'12 sm-8'}>
            <GridRow modifiers={'gutters'}>
              <Col modifiers={'12 sm-6'}>
                <ValidationCard
                  type={'A_VALIDER'}
                  natures={'responsable,responsable_formateur'}
                  label={'Organismes responsables ou responsables et formateurs à vérifier'}
                >
                  <NouveauxCounter type={'A_VALIDER'} natures={'responsable,responsable_formateur'} />
                </ValidationCard>
              </Col>
              <Col modifiers={'12 sm-6'}>
                <ValidationCard
                  type={'A_RENSEIGNER'}
                  natures={'responsable,responsable_formateur'}
                  label={'Organismes responsables ou responsables et formateurs à identifier'}
                />
              </Col>
              <Col modifiers={'12 sm-6'}>
                <ValidationCard type={'A_VALIDER'} natures={'formateur'} label={'Organismes formateurs à vérifier'}>
                  <NouveauxCounter type={'A_VALIDER'} natures={'formateur'} />
                </ValidationCard>
              </Col>
              <Col modifiers={'12 sm-6'}>
                <ValidationCard
                  type={'A_RENSEIGNER'}
                  natures={'formateur'}
                  label={'Organismes formateurs à identifier'}
                />
              </Col>
            </GridRow>
          </Col>
          <Col modifiers={'12 sm-4'}>
            <ValidationCard
              type={'VALIDE'}
              label={'Organismes validés'}
              natures={'responsable,responsable_formateur,formateur'}
              height={'100%'}
            />
          </Col>
        </GridRow>
      </ContentLayout>
    </Page>
  );
}
