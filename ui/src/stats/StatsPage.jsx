import { Col, GridRow } from '../common/dsfr/fondamentaux';
import TitleLayout from '../common/layout/TitleLayout.jsx';
import ContentLayout from '../common/layout/ContentLayout.jsx';
import NaturesStats from './natures/NaturesStats.jsx';
import ValidationStats from './validation/ValidationStats.jsx';
import QualiopiStats from './qualiopi/QualiopiStats.jsx';
import Page from '../common/Page.jsx';
import { Link } from '../common/dsfr/elements/Link.jsx';

export default function StatsPage() {
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
