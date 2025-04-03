import { Col, GridRow } from '../common/dsfr/fondamentaux';
import { ContentLayout, TitleLayout } from '../common/layout';
import NaturesStats from './natures/NaturesStats';
import ValidationStats from './validation/ValidationStats';
import QualiopiStats from './qualiopi/QualiopiStats';
import Page from '../common/Page';
import { Link } from '../common/dsfr/elements/Link';

export default function StatsPage () {
  return (
    <Page>
      <TitleLayout title={'Statistiques'} />
      <ContentLayout>
        <GridRow modifiers={'gutters'} className={'fr-mb-3w'}>
          <Col modifiers={'12'}>
            <p>
              Pour plus de précisons sur le statut des UAI et la nature des organismes, consultez la page{' '}
              <Link to="/construction">Construction du Référentiel</Link>.
            </p>
          </Col>
        </GridRow>
        <GridRow modifiers={'gutters'} className={'fr-mb-3w'}>
          <Col modifiers={'12'}>
            <h6>Fiabilisation des organismes responsables / responsables et formateurs</h6>
            <ValidationStats natures={'responsable,responsable_formateur'} />
          </Col>
        </GridRow>
        <GridRow modifiers={'gutters'} className={'fr-mb-3w'}>
          <Col modifiers={'12'}>
            <h6>Fiabilisation des organismes formateurs</h6>
            <ValidationStats natures={'formateur'} />
          </Col>
        </GridRow>
        <GridRow modifiers={'gutters'} className={'fr-mb-3w'}>
          <Col modifiers={'12'}>
            <h6>Répartition des organismes par nature</h6>
            <NaturesStats />
          </Col>
        </GridRow>
        <GridRow modifiers={'gutters'} className={'fr-mb-3w'}>
          <Col modifiers={'12'}>
            <h6>Nombre d’organisme de formation certifiés ou non Qualiopi en fonction de leur nature</h6>
            <QualiopiStats />
          </Col>
        </GridRow>
      </ContentLayout>
    </Page>
  );
}
