import React from "react";
import TitleLayout from "./common/layout/TitleLayout.jsx";
import ContentLayout from "./common/layout/ContentLayout.jsx";
import { Tab, TabPanel } from "./common/dsfr/elements/Tabs.jsx";
import WideTabs from "./common/dsfr/custom/WideTabs.jsx";
import { Table, Thead } from "./common/dsfr/elements/Table.jsx";
import definitions from "./common/definitions.json";
import Page from "./common/Page.jsx";
import { Link } from "./common/dsfr/elements/Link.jsx";
import { useNavigate, useParams } from "react-router-dom";

function Incoherence({ itemName }) {
  return (
    <div className={"fr-mt-3w"}>
      Si cette donnée est inconnue ou incorrecte,{" "}
      <Link to={`/corrections?item=${itemName}`} modifiers={"sm"}>
        voir la marche à suivre
      </Link>
      .
    </div>
  );
}

export default function ConstructionPage() {
  const navigate = useNavigate();
  const { tab = "source" } = useParams();

  return (
    <Page>
      <TitleLayout title={"Construction du Référentiel national"} />
      <ContentLayout>
        <WideTabs
          tabs={[
            {
              tab: (
                <Tab selected={tab === "source"} onClick={() => navigate("../source")}>
                  Source et périmètre des données
                </Tab>
              ),
              panel: (
                <TabPanel>
                  <h4>Source et périmètre des données</h4>
                  <p>
                    La construction du Référentiel national permet de constituer une liste d'organismes avec les
                    informations suivantes :
                  </p>
                  <Table
                    modifiers={"layout-fixed"}
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
                        <span className={"fr-text--bold"}>Les organismes référencés dans le Référentiel sont :</span>
                        <ul>
                          <li>identifiés par un SIRET ;</li>
                          <li>
                            trouvés dans la Liste publique des Organismes de Formation (data.gouv), la base RAMSESE ou
                            le catalogue des formations en apprentissage (base des Carif-Oref) ;
                          </li>
                          <li>en lien avec des formations en apprentissage à un moment donné.</li>
                        </ul>
                      </td>
                    </tr>
                    <tr>
                      <td>Relations entre les organismes</td>
                      <td>
                        {definitions.relations}
                        <Incoherence itemName={"relations"} />
                      </td>
                      <td colSpan="2">
                        <span className={"fr-text--bold"}>
                          Les relations entre les organismes sont identifiées au niveau de l'offre de formation en
                          apprentissage collectée par les Carif-Oref.
                        </span>
                        En effet, chaque offre de formation est associée à un organisme responsable et un organisme
                        formateur (chacun est connu par son SIRET et son UAI le cas échéant).
                        <ul>
                          <li>
                            Si les organismes associés à une offre de formation ont le même SIRET, on en déduit la
                            nature "responsable et formateur" et on ne génère pas de relation.
                          </li>
                          <li>
                            Si les organismes associés à une offre de formation n'ont pas le même SIRET, on en déduit la
                            nature "responsable" pour l'un et "formateur" pour l'autre, et on génère une relation entre
                            eux.
                          </li>
                        </ul>
                      </td>
                    </tr>
                    <tr>
                      <td>Nature de l'organisme</td>
                      <td>
                        {definitions.nature}
                        <Incoherence itemName={"nature"} />
                      </td>
                      <td colSpan="2">
                        <span className={"fr-text--bold"}>
                          Trois natures d'organismes peuvent être observées via le Catalogue des formations en
                          apprentissage :
                        </span>
                        <div className={"fr-text--bold"}>Un organisme responsable :</div>
                        <ul>
                          <li>
                            Ne dispense pas de formation mais délègue à des organismes responsable et formateur ou
                            uniquement formateur ;
                          </li>
                          <li>Est signataire de la convention de formation ;</li>
                          <li>Demande et reçoit les financements de l'OPCO ;</li>
                          <li>
                            Est responsable auprès de l'administration du respect de ses missions et obligations ;
                          </li>
                          <li>
                            Est titulaire de la certification qualité en tant que CFA et est garant du respect des
                            critères qualité au sein de l'UFA.
                          </li>
                        </ul>
                        <div className={"fr-text--bold"}>Un organisme responsable et formateur :</div>
                        <ul>
                          <li>
                            Dispense des actions de formation par apprentissage déclaré auprès des services de l'Etat
                            (n° de déclaration d'activité (NDA)) - Est signataire de la convention de formation ;
                          </li>
                          <li>Demande et reçoit les financements de l'OPCO ;</li>
                          <li>
                            Est responsable auprès de l'administration du respect de ses missions et obligations ;
                          </li>
                          <li>
                            Est titulaire de la certification qualité en tant que CFA et est garant du respect des
                            critères qualité au sein de l'UFA.
                          </li>
                        </ul>
                        <div className={"fr-text--bold"}>Un organisme formateur :</div>
                        <ul>
                          <li>
                            Dispense des actions de formation par apprentissage déclaré auprès des services de l'Etat
                            (n° de déclaration d'activité (NDA))
                          </li>
                        </ul>
                      </td>
                    </tr>
                    <tr>
                      <td>Lieu de formation</td>
                      <td>
                        {definitions.lieu}
                        <Incoherence itemName={"lieu"} />
                      </td>
                      <td colSpan="2">
                        Les lieux de formations sont caractérisés par une adresse postale et des coordonnées de
                        géolocalisation et sont toujours rattachés à un organisme de formation
                      </td>
                    </tr>
                    <tr>
                      <td>UAI</td>
                      <td>{definitions.uai}</td>
                      <td colSpan="2">
                        <div>
                          Les UAI peuvent avoir différents status en fonction de l'état d'avancement de leur validation
                          :
                          <ul>
                            <li>"validée" : l'UAI de cet organisme est validée</li>
                            <li>
                              "à valider" : l'UAI de cet organisme doit être validée pour finaliser son lien avec le
                              SIRET associé - "à renseigner" : l'UAI de cet organisme doit être renseignée pour
                              finaliser son lien avec le SIRET associé
                            </li>
                          </ul>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td>Réseau</td>
                      <td>{definitions.reseau}</td>
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
                      <td>Certifié qualiopi (oui, non)</td>
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
                    <tr>
                      <td>RNCP</td>
                      <td>{definitions.rncp}</td>
                      <td colSpan="2" />
                    </tr>
                    <tr>
                      <td>CFD</td>
                      <td>{definitions.cfd}</td>
                      <td colSpan="2" />
                    </tr>
                    <tr>
                      <td>Métadonnées (anomalies)</td>
                      <td />
                      <td colSpan="2" />
                    </tr>
                  </Table>
                </TabPanel>
              ),
            },
            {
              tab: (
                <Tab selected={tab === "import"} onClick={() => navigate("../import")}>
                  Import et compilation des données
                </Tab>
              ),
              panel: (
                <TabPanel>
                  <h4>Import et compilation des données</h4>
                  <p>
                    La construction du Référentiel se compose deux étapes qui sont exécutées les unes à la suite des
                    autres
                  </p>

                  <h6>Etape 1 : Import des SIRET (SIREN)</h6>
                  <p>Pour importer les organismes dans le Référentiel, trois listes sont utilisées comme référence :</p>
                  <Table
                    modifiers={"layout-fixed"}
                    thead={
                      <Thead>
                        <td>Nom</td>
                        <td>Données</td>
                        <td>Mise à jour</td>
                        <td>Source</td>
                      </Thead>
                    }
                  >
                    <tr>
                      <td>Liste publique des organismes de formation</td>
                      <td>SIRET, SIREN</td>
                      <td>Automatique Journalière</td>
                      <td>DGEFP</td>
                    </tr>
                    <tr>
                      <td>SIFA-RAMSESE</td>
                      <td>SIRET, SIREN</td>
                      <td>06/2021 (liste désormais indisponible)</td>
                      <td>DEPP</td>
                    </tr>
                    <tr>
                      <td>Etablissements du catalogue</td>
                      <td>SIRET, SIREN</td>
                      <td>Automatique Journalière</td>
                      <td>Mission Apprentissage</td>
                    </tr>
                  </Table>

                  <h6>Etape 2 : Compilation des données</h6>
                  <p>
                    La compilation de données permet de rassembler des informations liées aux organismes importés à
                    l'étape précédente. Chaque source de données comporte un certain nombre d'informations exploitables.{" "}
                  </p>
                  <p>
                    Une fois que les UAI sont validées par les utilisateurs, les liens SIRET - UAI peuvent alors servir
                    de référence dans différentes sources mobilisées (RAMSESE, DECA, Collecte de l'offre de formation
                    réalisée par les Carif-Oref). Pour mémoire l'UAI est utilisée comme clé d'identification des
                    organismes pour l'alimentation des plateformes éducatives (Parcoursup & Affelnet).
                  </p>
                  <Table
                    modifiers={"layout-fixed"}
                    thead={
                      <Thead>
                        <td>Nom</td>
                        <td colSpan="2">Données</td>
                        <td>Mise à jour</td>
                        <td>Source</td>
                      </Thead>
                    }
                  >
                    <tr>
                      <td>catalogue</td>
                      <td colSpan="2">
                        UAI potentielle, Nature, Relation, Diplômes, Certification, Lieux de formation, Anomalies,
                        Contacts
                      </td>
                      <td>Automatique Journalière</td>
                      <td>RCO, Mission Apprentissage</td>
                    </tr>
                    <tr>
                      <td>datagouv</td>
                      <td colSpan="2">NDA, Qualiopi</td>
                      <td>Automatique Journalière</td>
                      <td>DGEFP</td>
                    </tr>
                    <tr>
                      <td>DECA</td>
                      <td colSpan="2">UAI potentielle</td>
                      <td>A la demande</td>
                      <td>DGEFP</td>
                    </tr>
                    <tr>
                      <td>ideo2</td>
                      <td colSpan="2">UAI potentielle</td>
                      <td>
                        A la demande
                        <br />
                        <i>(dernière mise à jour 09/2021)</i>
                      </td>
                      <td>Onisep</td>
                    </tr>
                    <tr>
                      <td>onisep</td>
                      <td colSpan="2">UAI potentielle</td>
                      <td>
                        A la demande
                        <br />
                        <i>(dernière mise à jour 09/2021)</i>
                      </td>
                      <td>Onisep</td>
                    </tr>
                    <tr>
                      <td>onisep-structure</td>
                      <td colSpan="2">UAI potentielle</td>
                      <td>
                        A la demande
                        <br />
                        <i>(dernière mise à jour 09/2021)</i>
                      </td>
                      <td>Onisep</td>
                    </tr>
                    <tr>
                      <td>refea</td>
                      <td colSpan="2">UAI potentielle</td>
                      <td>Automatique Journalière</td>
                      <td>DGER</td>
                    </tr>
                    <tr>
                      <td>sirene</td>
                      <td colSpan="2">
                        Raison sociale, Relations, Etat administratif, Adresse, Forme juridique, Anomalies
                      </td>
                      <td>Automatique Journalière</td>
                      <td>INSEE</td>
                    </tr>
                    <tr>
                      <td>tableau-de-bord</td>
                      <td colSpan="2">UAI potentielle, Réseau</td>
                      <td>Automatique Journalière</td>
                      <td>Mission Apprentissage</td>
                    </tr>
                    <tr>
                      <td>acce</td>
                      <td colSpan="2">Contacts</td>
                      <td>Automatique Journalière</td>
                      <td>DEPP</td>
                    </tr>
                    <tr>
                      <td>voeux-affelnet</td>
                      <td colSpan="2">Contacts</td>
                      <td>
                        A la demande
                        <br />
                        <i>(dernière mise à jour 10/2022)</i>
                      </td>
                      <td>Mission Apprentissage</td>
                    </tr>
                  </Table>
                </TabPanel>
              ),
            },
          ]}
        />
      </ContentLayout>
    </Page>
  );
}
