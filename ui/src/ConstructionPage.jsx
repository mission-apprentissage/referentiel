import { ContentLayout, TitleLayout } from './common/layout';
import { Tab, TabPanel } from './common/dsfr/elements/Tabs';
import WideTabs from './common/dsfr/custom/WideTabs';
import { Table, Thead } from './common/dsfr/elements/Table';
import definitions from './common/definitions.json';
import Page from './common/Page';
import { Link } from './common/dsfr/elements/Link';
import { useNavigate, useParams } from 'react-router-dom';


function Incoherence ({ itemName }) {
  return (
    <div className={'fr-mt-3w'}>
      Si cette donnée est inconnue ou incorrecte,{' '}
      <Link to={`/corrections?item=${itemName}`} modifiers={'sm'}>
        voir la marche à suivre
      </Link>
      .
    </div>
  );
}

export default function ConstructionPage () {
  const navigate = useNavigate();
  const { tab = 'source' } = useParams();

  return (
    <Page>
      <TitleLayout title={'Construction du Référentiel national'} />
      <ContentLayout>
        <WideTabs
          tabs={[
            {
              tab:   (
                       <Tab selected={tab === 'source'} onClick={() => navigate('../source')}>
                         Source et périmètre des données
                       </Tab>
                     ),
              panel: (
                       <TabPanel>
                         <h4>Source et périmètre des données</h4>
                         <p>
                           Le Référentiel UAI-SIRET est construit avec des données issues de différentes sources que
                           nous
                           exploitons quotidiennement (base SIRENE, Liste publique des organismes de formation,
                           Catalogue des
                           formations en apprentissage…). C’est un agrégat de données où seule l’UAI est modifiable.
                           <br />
                           L’intégration d’un organisme au sein du Référentiel se fait de manière automatique si son
                           SIRET est
                           présent au sein du{' '}
                           <a href="https://catalogue-apprentissage.intercariforef.org/" target="_blank"
                              rel="noreferrer">
                             Catalogue des formations en apprentissage
                           </a>{' '}
                           (base des Carif-Oref) et/ou de la{' '}
                           <a
                             href="https://data.gouv.fr/fr/datasets/liste-publique-des-organismes-de-formation-l-6351-7-1-du-code-du-travail/"
                             target="_blank"
                             rel="noreferrer"
                           >
                             Liste publique des organismes de formation
                           </a>{' '}
                           (data.gouv).
                         </p>
                         <p>
                           Chaque organisme présent dans le Référentiel est décrit par plusieurs attributs qui sont
                           listés
                           ci-dessous. Pour chaque donnée, la source ainsi que le périmètre sont précisés. Ces données,
                           une
                           fois compilées, constituent la fiche détaillée de l’organisme au sein du Référentiel.
                         </p>
                         <Table
                           modifiers={'layout-fixed'}
                           thead={
                             <Thead>
                               <th>Donnée</th>
                               <th>Source</th>
                               <th colSpan="2">Périmètre</th>
                             </Thead>
                           }
                         >
                           <tr>
                             <td>Organisme de formation</td>
                             <td>{definitions.organisme}</td>
                             <td colSpan="2">
                               <span
                                 className={'fr-text--bold'}>Les organismes présents dans le Référentiel sont :</span>
                               <ul>
                                 <li>identifiés par un SIRET ;</li>
                                 <li>
                                   trouvés dans la Liste publique des organismes de formation (data.gouv) et/ou le
                                   Catalogue
                                   des formations en apprentissage (base des Carif-Oref).
                                 </li>
                               </ul>
                             </td>
                           </tr>
                           <tr>
                             <td>Relations entre les organismes</td>
                             <td>
                               {definitions.relations}
                               <Incoherence itemName={'relations'} />
                             </td>
                             <td colSpan="2">
                        <span className={'fr-text--bold'}>
                          Les relations entre les organismes sont identifiées au niveau de l'offre de formation en
                          apprentissage collectée par les Carif-Oref.{' '}
                        </span>
                               En effet, chaque offre de formation est associée à un organisme responsable et un
                               organisme
                               formateur (chacun est connu par son SIRET et son UAI le cas échéant).
                               <ul>
                                 <li>
                                   Si les organismes associés à une offre de formation ont le même SIRET, on en déduit
                                   la
                                   nature "responsable et formateur" et on ne génère pas de relation.
                                 </li>
                                 <li>
                                   Si les organismes associés à une offre de formation n'ont pas le même SIRET, on en
                                   déduit la
                                   nature "responsable" pour l'un et "formateur" pour l'autre, et on génère une relation
                                   entre
                                   eux.
                                 </li>
                               </ul>
                             </td>
                           </tr>
                           <tr>
                             <td>Nature de l'organisme</td>
                             <td>
                               {definitions.nature}
                               <Incoherence itemName={'nature'} />
                             </td>
                             <td colSpan="2">
                        <span className={'fr-text--bold'}>
                          Trois natures d'organismes peuvent être observées via le Catalogue des formations en
                          apprentissage :
                        </span>
                               <div className={'fr-text--bold'}>Un organisme responsable :</div>
                               <ul>
                                 <li>
                                   Ne dispense pas de formation mais délègue à des organismes responsables et formateurs
                                   ou
                                   uniquement formateurs ;
                                 </li>
                                 <li>Est signataire de la convention de formation ;</li>
                                 <li>Demande et reçoit les financements de l'OPCO ;</li>
                                 <li>
                                   Est responsable auprès de l'administration du respect de ses missions et obligations
                                   ;
                                 </li>
                                 <li>
                                   Est titulaire de la certification qualité en tant que CFA et est garant du respect
                                   des
                                   critères qualité au sein de l'UFA.
                                 </li>
                               </ul>
                               <div className={'fr-text--bold'}>Un organisme responsable et formateur :</div>
                               <ul>
                                 <li>
                                   Dispense des actions de formation par apprentissage déclaré auprès des services de
                                   l'Etat
                                   (n° de déclaration d'activité (NDA))
                                 </li>
                                 <li>Est signataire de la convention de formation ;</li>
                                 <li>Demande et reçoit les financements de l'OPCO ;</li>
                                 <li>
                                   Est responsable auprès de l'administration du respect de ses missions et obligations
                                   ;
                                 </li>
                                 <li>
                                   Est titulaire de la certification qualité en tant que CFA et est garant du respect
                                   des
                                   critères qualité au sein de l'UFA.
                                 </li>
                               </ul>
                               <div className={'fr-text--bold'}>Un organisme formateur :</div>
                               <ul>
                                 <li>
                                   Dispense des actions de formation par apprentissage déclaré auprès des services de
                                   l'Etat
                                   (n° de déclaration d'activité (NDA)).
                                 </li>
                               </ul>
                             </td>
                           </tr>
                           <tr>
                             <td>Lieu de formation</td>
                             <td>
                               {definitions.lieu}
                               <Incoherence itemName={'lieu'} />
                             </td>
                             <td colSpan="2">
                               Les lieux de formation sont caractérisés par une adresse postale et des coordonnées de
                               géolocalisation et sont toujours rattachés à un organisme de formation.
                             </td>
                           </tr>
                           <tr>
                             <td>UAI</td>
                             <td>{definitions.uai}</td>
                             <td colSpan="2">
                               <div>
                                 Les UAI peuvent avoir différents statuts :
                                 <ul>
                                   <li>validée : l'UAI de cet organisme est fiabilisée</li>
                                   <li>
                                     à vérifier : l'UAI de cet organisme doit être validée pour finaliser son lien avec
                                     le
                                     SIRET associé. Des UAI potentielles sont proposées pour aider à la validation.
                                   </li>
                                   <li>
                                     à identifier : l'UAI de cet organisme doit être saisie pour finaliser son lien avec
                                     le
                                     SIRET associé.
                                   </li>
                                 </ul>
                               </div>
                             </td>
                           </tr>
                           <tr>
                             <td>Réseaux</td>
                             <td>
                               La donnée « Réseaux » provient des Réseaux qui ont transmis leur liste d’organismes au
                               Tableau
                               de bord de l’Apprentissage. Si cette donnée est erronée ou manquante,{' '}
                               <Incoherence itemName={'appartenance'} />
                             </td>
                             <td colSpan="2" />
                           </tr>
                           <tr>
                             <td>SIREN</td>
                             <td>{definitions.siren}</td>
                             <td colSpan="2" />
                           </tr>
                           <tr>
                             <td>SIRET (en activité, fermé)</td>
                             <td>{definitions.siret}</td>
                             <td colSpan="2" />
                           </tr>
                           <tr>
                             <td>Numéro de déclaration d'activité (NDA)</td>
                             <td>{definitions.nda}</td>
                             <td colSpan="2" />
                           </tr>
                           <tr>
                             <td>Certifié Qualiopi (oui, non)</td>
                             <td>{definitions.qualiopi}</td>
                             <td colSpan="2" />
                           </tr>
                           <tr>
                             <td>Enseigne</td>
                             <td>{definitions.enseigne}</td>
                             <td colSpan="2" />
                           </tr>
                           <tr>
                             <td>Raison sociale</td>
                             <td>{definitions.raison_sociale}</td>
                             <td colSpan="2" />
                           </tr>
                           <tr>
                             <td>Adresse postale</td>
                             <td>{definitions.adresse}</td>
                             <td colSpan="2" />
                           </tr>
                           <tr>
                             <td>Région</td>
                             <td>{definitions.region}</td>
                             <td colSpan="2" />
                           </tr>
                           <tr>
                             <td>Académie</td>
                             <td>{definitions.academie}</td>
                             <td colSpan="2" />
                           </tr>
                         </Table>
                       </TabPanel>
                     ),
            },
            {
              tab:   (
                       <Tab selected={tab === 'import'} onClick={() => navigate('../import')}>
                         Import et compilation des données
                       </Tab>
                     ),
              panel: (
                       <TabPanel>
                         <h4>Import et compilation des données</h4>
                         <p>La construction du Référentiel se fait en deux temps.</p>

                         <h6>Etape 1 : Import des organismes via le SIRET</h6>
                         <p>
                           Pour importer un nouvel organisme dans le Référentiel, deux sources de données sont utilisées
                           comme
                           référence :
                         </p>
                         <Table
                           modifiers={'layout-fixed'}
                           thead={
                             <Thead>
                               <td>Nom de la source</td>
                               <td>Données récupérées</td>
                               <td>Mise à jour</td>
                               <td>Propriétaire de la source</td>
                             </Thead>
                           }
                         >
                           <tr>
                             <td>Liste publique des organismes de formation</td>
                             <td>SIRET, SIREN</td>
                             <td>Automatique journalière</td>
                             <td>DGEFP</td>
                           </tr>
                           <tr>
                             <td>Établissements du Catalogue des formations en apprentissage (base des Carif-Oref)</td>
                             <td>SIRET, SIREN</td>
                             <td>Automatique journalière</td>
                             <td>Réseau des Carif-Oref - RCO</td>
                           </tr>
                         </Table>

                         <h6>Etape 2 : Compilation des données</h6>
                         <p>
                           La compilation de données permet de rassembler des informations liées aux organismes importés
                           à
                           l'étape précédente. Chaque source de données comporte un certain nombre d'informations
                           exploitables.{' '}
                         </p>
                         <p>
                           Une fois que les UAI sont validées par les référents en académie ou les gestionnaires du
                           site, les
                           couples UAI-SIRET sont exploités par d’autres applicatifs : le{' '}
                           <b>Catalogue des formations en apprentissage</b>, le <b>Tableau de bord de
                           l’Apprentissage</b>,{' '}
                           <b>ParcourSup</b> et <b>Affelnet</b>.
                           <br />
                           Pour mémoire, l'UAI est utilisée comme clé d'identification des organismes pour
                           l'alimentation des
                           plateformes éducatives (<b>Parcoursup</b> et <b>Affelnet</b>).
                           <br /> Un couple UAI-SIRET validé garantie la bonne circulation d’une offre de formation en
                           apprentissage jusqu’à ces plateformes.
                         </p>
                         <Table
                           modifiers={'layout-fixed'}
                           thead={
                             <Thead>
                               <td>Nom de la source</td>
                               <td colSpan="2">Données récupérées</td>
                               <td>Mise à jour</td>
                               <td>Propriétaire de la source</td>
                             </Thead>
                           }
                         >
                           <tr>
                             <td>Formations du Catalogue des formations en apprentissage (base des Carif-Oref)</td>
                             <td colSpan="2">Nature, Relations, Diplômes, Certification, Lieux de formation, Contacts
                             </td>
                             <td>Automatique journalière</td>
                             <td>RCO</td>
                           </tr>
                           <tr>
                             <td>Sirene</td>
                             <td colSpan="2">Raison sociale, Relations, Etat administratif, Adresse, Forme juridique
                             </td>
                             <td>Automatique journalière</td>
                             <td>INSEE</td>
                           </tr>
                           <tr>
                             <td>Liste publique des organismes de formation (data.gouv)</td>
                             <td colSpan="2">NDA, Qualiopi</td>
                             <td>Automatique journalière</td>
                             <td>DGEFP</td>
                           </tr>
                           <tr>
                             <td>Tableau de bord de l'apprentissage</td>
                             <td colSpan="2">UAI potentielle, Réseau</td>
                             <td>Automatique journalière</td>
                             <td>Mission Apprentissage</td>
                           </tr>
                           <tr>
                             <td>DECA</td>
                             <td colSpan="2">UAI potentielle</td>
                             <td>
                               A la demande <br />
                               Tous les 6 mois environ <i>(dernière mise à jour 11/2024)</i>
                             </td>
                             <td>DGEFP</td>
                           </tr>
                           <tr>
                             <td>Onisep / Ideo</td>
                             <td colSpan="2">UAI potentielle</td>
                             <td>
                               A la demande
                               <br />
                               <i>(dernière mise à jour 12/2024)</i>
                             </td>
                             <td>Onisep</td>
                           </tr>
                           <tr>
                             <td>RefEA</td>
                             <td colSpan="2">UAI potentielle</td>
                             <td>Automatique journalière</td>
                             <td>DGER</td>
                           </tr>
                           <tr>
                             <td>Catalogue des Ministères éducatifs (Parcoursup / Affelnet)</td>
                             <td colSpan="2">UAI des lieux de formation</td>
                             <td>Automatique journalière</td>
                             <td>DNE – Direction du numérique pour l’éducation</td>
                           </tr>
                         </Table>
                       </TabPanel>
                     ),
            },
          ]}
        />
        <p>
          Pour en savoir plus sur les dates de mises à jour, consultez le{' '}
          <a href="/modifications">Journal des modifications</a>.
        </p>
      </ContentLayout>
    </Page>
  );
}
