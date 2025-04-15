/**
 * Page "Contact"
 */

import { Col, GridRow } from '../common/dsfr/fondamentaux';
import TitleLayout from '../common/layout/TitleLayout.jsx';
import ContentLayout from '../common/layout/ContentLayout.jsx';
import Page from '../common/Page.jsx';


export function ContactPage () {
  return (
    <Page>
      <TitleLayout />
      <ContentLayout>
        <GridRow modifiers={'gutters'} className={'fr-pb-3w'}>
          <Col modifiers={'12 sm-12'}>
            <GridRow modifiers={'gutters'} className={'fr-mb-6w'}>
              <Col modifiers={'12'}>
                <p>
                  Vous avez des questions, des demandes ou souhaitez plus d’informations ?<br />
                  Envoyez-nous un email à l’adresse suivante :{' '}
                  <a href="mailto:referentiel-uai-siret@onisep.fr">referentiel-uai-siret@onisep.fr</a>
                </p>
              </Col>
            </GridRow>
          </Col>
        </GridRow>
      </ContentLayout>
    </Page>
  );
}
