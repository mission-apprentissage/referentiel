import React from "react";
import TitleLayout from "../common/layout/TitleLayout";
import ContentLayout from "../common/layout/ContentLayout";
import { Tab, TabPanel } from "../common/dsfr/elements/Tabs";
import WideTabs from "../common/dsfr/custom/WideTabs";
import { Table, Thead } from "../common/dsfr/elements/Table";
import { Tag, TagGroup } from "../common/dsfr/elements/Tag";
import definitions from "../common/definitions.json";

export default function ConstructionPage() {
  return (
    <>
      <TitleLayout title={"Construction du référentiel national"} />
      <ContentLayout>
        <WideTabs
          tabs={[
            {
              tab: <Tab>Source et périmètre des données</Tab>,
              panel: (
                <TabPanel>
                  <h4>Source et périmètre des données</h4>
                  <p>
                    La construction du référentiel national permet de constituer une liste d’organismes avec les
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
                        <span className={"fr-text--bold"}>Les organismes référencés dans le référentiel sont :</span>
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
                      <td>{definitions.relations}</td>
                      <td colSpan="2">
                        <span className={"fr-text--bold"}>
                          Les relations entre les organismes sont identifiées au niveau de l’offre de formation en
                          apprentissage collectée par les Carif-Oref.
                        </span>
                        En effet, chaque offre de formation est associée à un organisme responsable et un organisme
                        formateur (chacun est connu par son SIRET et son UAI le cas échéant).
                        <ul>
                          <li>
                            Si les organismes associés à une offre de formation ont le même SIRET, on en déduit la
                            nature "responsable et formateur" et on se génère pas de relation.
                          </li>
                          <li>
                            Si les organismes associés à une offre de formation n’ont pas le même SIRET, on en déduit la
                            nature "responsable"pour l’un et formateur" pour l’autre, et on génère une relation entre
                            eux.
                          </li>
                        </ul>
                      </td>
                    </tr>
                    <tr>
                      <td>Nature de l’organisme</td>
                      <td>{definitions.nature}</td>
                      <td colSpan="2">
                        <span className={"fr-text--bold"}>
                          Trois natures d’organismes peuvent être observées via le Catalogue des formations en
                          apprentissage :
                        </span>
                        <div className={"fr-text--bold"}>Les organismes responsables :</div>
                        <ul>
                          <li>
                            Ne dispense pas de formation mais délègue à des organismes responsable et formateur ou
                            uniquement formateur ;
                          </li>
                          <li>Est signataire de la convention de formation ;</li>
                          <li>Demande et reçoit les financements de l’OPCO ;</li>
                          <li>
                            Est responsable auprès de l’administration du respect de ses missions et obligations ;
                          </li>
                          <li>
                            Est titulaire de la certification qualité en tant que CFA et est garant du respect des
                            critères qualité au sein de l’UFA.
                          </li>
                        </ul>
                        <div className={"fr-text--bold"}>Les organismes responsables et formateur :</div>
                        <ul>
                          <li>
                            Dispense des actions de formation par apprentissage déclaré auprès des services de l’Etat
                            (n° de déclaration d’activité (NDA)) - Est signataire de la convention de formation ;
                          </li>
                          <li>Demande et reçoit les financements de l’OPCO ;</li>
                          <li>
                            Est responsable auprès de l’administration du respect de ses missions et obligations ;
                          </li>
                          <li>
                            Est titulaire de la certification qualité en tant que CFA et est garant du respect des
                            critères qualité au sein de l’UFA.
                          </li>
                        </ul>
                        <div className={"fr-text--bold"}>Les organismes formateurs :</div>
                        <ul>
                          <li>
                            Dispense des actions de formation par apprentissage déclaré auprès des services de l’Etat
                            (n° de déclaration d’activité (NDA))
                          </li>
                        </ul>
                      </td>
                    </tr>
                    <tr>
                      <td>Lieu de formation</td>
                      <td>{definitions.lieu}</td>
                      <td colSpan="2">
                        Les lieux de formations sont caractérisés par une adresse postale et des coordonnées de
                        géolocalisation et toujours rattaché à un organisme de formation
                      </td>
                    </tr>
                    <tr>
                      <td>UAI</td>
                      <td>{definitions.uai}</td>
                      <td colSpan="2">
                        Les UAI peuvent avoir différents status en fonction de l’état d’avancement de leur validation :
                        <ul>
                          <li>"validée" : l’UAI de cet organisme est validée</li>
                          <li>
                            "à valider" : l’UAI de cet organisme doit être validée pour finaliser son lien avec le SIRET
                            associé - "à renseigner" : l’UAI de cet organisme doit être renseignée pour finaliser son
                            lien avec le SIRET associé
                          </li>
                        </ul>
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
                      <td>Numéro de déclaration d’activité (NDA)</td>
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
              tab: <Tab>Import et compilation des données</Tab>,
              panel: (
                <TabPanel>
                  <h4>Import et complilation des données</h4>
                  <p>
                    La construction du référentiel se compose deux étapes qui sont exécutées les unes à la suite des
                    autres
                  </p>

                  <h6>Etape 1 : Import des SIRET (SIREN)</h6>
                  <p>Pour importer les organismes dans le référentiel, trois listes sont utilisées comme référence :</p>
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
                      <td>
                        <TagGroup>
                          <Tag>SIRET</Tag>
                          <Tag>SIREN</Tag>
                        </TagGroup>
                      </td>
                      <td>Automatique Journalière</td>
                      <td>DGEFP</td>
                    </tr>
                    <tr>
                      <td>SIFA-RAMSESE</td>
                      <td>
                        <TagGroup>
                          <Tag>SIRET</Tag>
                          <Tag>SIREN</Tag>
                        </TagGroup>
                      </td>
                      <td>A la demande</td>
                      <td>DEPP</td>
                    </tr>
                    <tr>
                      <td>Etablissements du catalogue</td>
                      <td>
                        <TagGroup>
                          <Tag>SIRET</Tag>
                          <Tag>SIREN</Tag>
                        </TagGroup>
                      </td>
                      <td>Automatique Journalière</td>
                      <td>Mission Apprentissage</td>
                    </tr>
                  </Table>

                  <h6>Etape 2 : Compilation des données</h6>
                  <p>
                    La compilation de données permet de rassembler des informations liées aux organismes importés à
                    l’étape précédente. Chaque source de données comporte un certain nombre d’informations exploitables.{" "}
                  </p>
                  <p>
                    Une fois que les UAI sont validées par les utilisateurs, les liens SIRET - UAI peuvent alors servir
                    de référence dans différentes sources mobilisées (RAMSESE, DECA, Collecte de l’offre de formation
                    réalisée par les Carif-Oref). Pour mémoire l’UAI est utilisée comme clé d’identification des
                    organismes pour l’alimentation des plateformes éducatives (Parcoursup & Affelnet).
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
                        <TagGroup>
                          <Tag>UAI potentielle</Tag>
                          <Tag>Nature</Tag>
                          <Tag>Relation</Tag>
                          <Tag>Diplômes</Tag>
                          <Tag>Certification</Tag>
                          <Tag>Lieux de formation</Tag>
                          <Tag>Anomalies</Tag>
                          <Tag>Contacts</Tag>
                        </TagGroup>
                      </td>
                      <td>Automatique Journalière</td>
                      <td>RCO, Mission Apprentissage</td>
                    </tr>
                    <tr>
                      <td>datagouv</td>
                      <td colSpan="2">
                        <TagGroup>
                          <Tag>NDA</Tag>
                          <Tag>Qualiopi</Tag>
                        </TagGroup>
                      </td>
                      <td>Automatique Journalière</td>
                      <td>DGEFP</td>
                    </tr>
                    <tr>
                      <td>DECA</td>
                      <td colSpan="2">
                        <TagGroup>
                          <Tag>UAI potentielle</Tag>
                        </TagGroup>
                      </td>
                      <td>A la demande</td>
                      <td>DGEFP</td>
                    </tr>
                    <tr>
                      <td>DEPP</td>
                      <td colSpan="2">
                        <TagGroup>
                          <Tag>UAI potentielle</Tag>
                        </TagGroup>
                      </td>
                      <td>A la demande</td>
                      <td>DEPP</td>
                    </tr>
                    <tr>
                      <td>ideo2</td>
                      <td colSpan="2">
                        <TagGroup>
                          <Tag>UAI potentielle</Tag>
                        </TagGroup>
                      </td>
                      <td>A la demande</td>
                      <td>Onisep</td>
                    </tr>
                    <tr>
                      <td>mna</td>
                      <td colSpan="2">
                        <TagGroup>
                          <Tag>UAI potentielle</Tag>
                        </TagGroup>
                      </td>
                      <td>A la demande</td>
                      <td>Mission Apprentissage</td>
                    </tr>
                    <tr>
                      <td>onisep</td>
                      <td colSpan="2">
                        <TagGroup>
                          <Tag>UAI potentielle</Tag>
                        </TagGroup>
                      </td>
                      <td>A la demande</td>
                      <td>Onisep</td>
                    </tr>
                    <tr>
                      <td>onisep-structure</td>
                      <td colSpan="2">
                        <TagGroup>
                          <Tag>UAI potentielle</Tag>
                        </TagGroup>
                      </td>
                      <td>A la demande</td>
                      <td>Onisep</td>
                    </tr>
                    <tr>
                      <td>opcoep</td>
                      <td colSpan="2">
                        <TagGroup>
                          <Tag>UAI potentielle</Tag>
                        </TagGroup>
                      </td>
                      <td>A la demande</td>
                      <td>OPCO EP</td>
                    </tr>
                    <tr>
                      <td>refea</td>
                      <td colSpan="2">
                        <TagGroup>
                          <Tag>UAI potentielle</Tag>
                        </TagGroup>
                      </td>
                      <td>A la demande</td>
                      <td>DGER</td>
                    </tr>
                    <tr>
                      <td>SIFA RAMSESE</td>
                      <td colSpan="2">
                        <TagGroup>
                          <Tag>UAI potentielle</Tag>
                        </TagGroup>
                      </td>
                      <td>A la demande</td>
                      <td>DEPP</td>
                    </tr>
                    <tr>
                      <td>sirene</td>
                      <td colSpan="2">
                        <TagGroup>
                          <Tag>Raison sociale</Tag>
                          <Tag>Relations</Tag>
                          <Tag>Etat administratif</Tag>
                          <Tag>Adresse</Tag>
                          <Tag>Forme juridique</Tag>
                          <Tag>Anomalies</Tag>
                        </TagGroup>
                      </td>
                      <td>Automatique Journalière</td>
                      <td>INSEE</td>
                    </tr>
                    <tr>
                      <td>tableau-de-bord</td>
                      <td colSpan="2">
                        <TagGroup>
                          <Tag>UAI potentielle</Tag>
                          <Tag>Réseau</Tag>
                        </TagGroup>
                      </td>
                      <td>Automatique Journalière</td>
                      <td>Mission Apprentissage</td>
                    </tr>
                    <tr>
                      <td>ymag</td>
                      <td colSpan="2">
                        <TagGroup>
                          <Tag>UAI potentielle</Tag>
                        </TagGroup>
                      </td>
                      <td>A la demande</td>
                      <td>Mission Apprentissage</td>
                    </tr>
                    <tr>
                      <td>acce</td>
                      <td colSpan="2">
                        <TagGroup>
                          <Tag>Contacts</Tag>
                        </TagGroup>
                      </td>
                      <td>Automatique Journalière</td>
                      <td>DEPP</td>
                    </tr>
                    <tr>
                      <td>voeux-affelnet</td>
                      <td colSpan="2">
                        <TagGroup>
                          <Tag>Contacts</Tag>
                        </TagGroup>
                      </td>
                      <td>A la demande</td>
                      <td>Mission Apprentissage</td>
                    </tr>
                  </Table>
                </TabPanel>
              ),
            },
          ]}
        />
      </ContentLayout>
    </>
  );
}
