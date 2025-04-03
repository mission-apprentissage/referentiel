import { Col, GridRow } from '../common/dsfr/fondamentaux/index.js';
import { useContext } from 'react';
import TitleLayout from '../common/layout/TitleLayout.jsx';
import ContentLayout from '../common/layout/ContentLayout.jsx';
import { Button } from '../common/dsfr/elements/Button.jsx';
import { useNavigate } from 'react-router-dom';
import { useFetch } from '../common/hooks/useFetch.js';
import { percentage } from '../common/utils.js';
import Page from '../common/Page.jsx';
import NouveauxHistogram from './stats/NouveauxHistogram.jsx';
import EtatAdministratifPie from './stats/EtatAdministratifPie.jsx';
import { UserContext } from '../common/UserProvider.jsx';

const config = require('../config');

export default function AccueilPage() {
  const navigate = useNavigate();
  const [userContext] = useContext(UserContext);

  const [{ data: stats }] = useFetch(config.apiUrl + '/stats/couverture', null);
  console.log({ stats });
  return (
    <Page>
      <TitleLayout />
      <ContentLayout>
        <GridRow modifiers={'gutters'} className={'fr-pb-3w'}>
          <Col modifiers={'12 sm-12'}>
            <GridRow modifiers={'gutters'} className={'fr-mb-6w'}>
              <Col modifiers={'12'}>
                <h2>Bienvenue sur le Référentiel des organismes de formation en apprentissage</h2>
                <h6 id={'référentiel'}>
                  Aujourd’hui, le Référentiel comptabilise {stats?.organismes || '0'} organismes.
                </h6>
                <p>
                  Un établissement, identifié via son SIRET, intègre le Référentiel dès lors qu’il est présent dans
                  l’une de nos deux sources de référence, à savoir :
                </p>
                <ul>
                  <li>
                    La{' '}
                    <a
                      href={
                        'https://www.data.gouv.fr/fr/datasets/liste-publique-des-organismes-de-formation-l-6351-7-1-du-code-du-travail/'
                      }
                      target="_blank"
                      rel="noreferrer"
                    >
                      Liste publique des organismes de formation
                    </a>{' '}
                    (DGEFP)
                  </li>
                  <li>
                    Et/ou le{' '}
                    <a href={'https://catalogue-apprentissage.intercariforef.org/'} target="_blank" rel="noreferrer">
                      Catalogue des formations en apprentissage
                    </a>{' '}
                    (réseau des Carif-Oref)
                  </li>
                </ul>
                <br />
                <p>
                  Parmi ces organismes,{' '}
                  <span style={{ color: 'red' }}>un périmètre est identifié comme étant prioritaire</span> pour la
                  fiabilisation des couples UAI-SIRET.
                </p>
                <p>
                  {stats?.total || '0'} organismes sont aujourd’hui concernés car ils répondent aux critères suivants :
                </p>
                <ul>
                  <li>ils sont identifiés via un SIRET ouvert</li>
                  <li>
                    ET ils sont certifiés Qualiopi par le{' '}
                    <a
                      href="https://travail-emploi.gouv.fr/qualiopi-marque-de-certification-qualite-des-prestataires-de-formation"
                      target="_blank"
                      rel="noreferrer"
                    >
                      Cofrac
                    </a>{' '}
                    pour dispenser des formations en apprentissage
                  </li>
                  <li>
                    ET ils ont une nature : ils peuvent être responsables / responsables et formateurs ou formateurs
                    uniquement. Cette nature est déduite dès lors qu’ils sont liés à de l’offre de formation dans le
                    Catalogue des formations apprentissage (réseau des Carif-Oref).
                  </li>
                </ul>
                <p>
                  <b>
                    {Math.round(percentage(stats?.valides, stats?.total))}% des organismes intégrant ce périmètre
                    d’expertise ont aujourd’hui une UAI fiabilisée.
                  </b>
                </p>
                <p>
                  Toutefois, il faut noter que la fiabilisation des UAI reste possible sur l’ensemble des organismes
                  présents dans le Référentiel, ce qui explique qu’aujourd’hui, {stats?.uaiExistant} organismes ont une
                  UAI validée.
                </p>
                <h6>
                  <u>Rôle et usage du Référentiel</u>
                </h6>
                <p>
                  Le Référentiel est un des pivots d’enrichissement du <b>Catalogue des formations en apprentissage</b>{' '}
                  (réseau des Carif-Oref). Les UAI fiabilisées dans le Référentiel alimentent chaque jour le Catalogue
                  des formations en apprentissage. Ces mêmes UAI sont ensuite exploitées, via le Catalogue, par les
                  Ministères éducatifs dans leurs applicatifs <b>Parcoursup</b> et <b>Affelnet</b>.
                  <br /> Le <b>Tableau de bord de l’Apprentissage</b> (MIA) exploite également les données du
                  Référentiel pour approuver les organismes de formation souhaitant déclarer leurs effectifs.
                  L’ouverture d’un compte sur le Tableau de bord de l’Apprentissage est possible uniquement si
                  l’organisme dispose d’un couple UAI-SIRET valide dans le Référentiel.
                  <br /> D’autres consommateurs du Référentiel peuvent également être mentionnés comme la{' '}
                  <b>Caisse des dépôts et consignation</b> (CDC) qui appelle les couples SIRET-UAI pour fiabiliser la
                  collecte de la taxe d’apprentissage ou encore <b>SIRIUS</b> qui exploite les relations entre les
                  organismes.
                  <br />
                  Les données de ce site sont sous{' '}
                  <a
                    href="https://github.com/etalab/licence-ouverte/blob/master/LO.md"
                    target="_blank"
                    rel="noreferrer"
                  >
                    licence etalab-2.0
                  </a>
                  . Elles sont librement réutilisables.
                </p>
                <h6>
                  <u>Fiabilisation des UAI</u>
                </h6>
                <p>
                  L’UAI est la seule donnée modifiable au sein du Référentiel.
                  <br />
                  Toutes les autres données qui composent une fiche organisme sont issues des différentes sources que
                  nous exploitons (INSEE, Catalogue des formations en apprentissage, Liste publique des organismes de
                  formation…).
                  <br />
                  La fiabilisation des couples UAI-SIRET est réalisée par un réseau d’experts travaillant principalement
                  au sein des services statistiques académiques (SSA) rattachés au niveau national à la Direction de
                  l’évaluation, de la prospective et de la performance (DEPP).
                  <br /> Au sein de leur académie, ces experts sont chargés de l’immatriculation des organismes de
                  formation et de la gestion du répertoire Ramsese (ACCE). Ils ont donc une véritable connaissance des
                  organismes de formation de leur territoire.
                  <br /> Les gestionnaires du site peuvent également être amenés à fiabiliser des UAI au sein du
                  Référentiel.
                </p>
                <Button className={'fr-mt-3w'} onClick={() => navigate('/organismes')}>
                  Consulter le Référentiel national
                </Button>
              </Col>
            </GridRow>

            <GridRow modifiers={'gutters'} className={'fr-mb-6w'}>
              <Col modifiers={'12'}>
                <h6 id={'construction'}>
                  <u>Construction du Référentiel</u>
                </h6>
                <div className={'fr-mt-3w'}>
                  <span className={'fr-text--bold'}>
                    La construction du Référentiel national permet de constituer une liste d’organismes avec les
                    informations suivantes :{' '}
                  </span>
                  UAI, Nature (Responsable, Responsable et formateur, Formateur), SIREN, SIRET, Numéro de déclaration
                  d’activité (NDA), Certification Qualiopi, Enseigne, Raison sociale, Réseau, Adresse, Région, Académie.
                  <div className={'fr-mt-3w fr-text--bold'}>
                    À chaque organisme de formation est associé une liste de relations avec d’autres organismes et une
                    liste de lieux de formation.
                  </div>
                  <Button className={'fr-mt-3w'} modifiers={'secondary'} onClick={() => navigate('/construction')}>
                    En savoir plus
                  </Button>
                </div>
              </Col>
              {!userContext.isAnonymous && (
                <>
                  <Col modifiers={'12'} className={'fr-mb-6w'}>
                    <NouveauxHistogram />
                  </Col>
                  <Col modifiers={'12'}>
                    <EtatAdministratifPie />
                  </Col>
                </>
              )}
            </GridRow>
          </Col>
        </GridRow>
      </ContentLayout>
    </Page>
  );
}
