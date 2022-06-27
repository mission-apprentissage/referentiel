import React, { useEffect } from "react";
import TitleLayout from "../common/layout/TitleLayout";
import ContentLayout from "../common/layout/ContentLayout";
import Page from "../common/Page";
import { Accordion, AccordionItem } from "../common/dsfr/elements/Accordion.jsx";
import { Col, GridRow } from "../common/dsfr/fondamentaux/index.js";
import Highlight from "../common/dsfr/elements/Highlight.jsx";
import Alert from "../common/dsfr/elements/Alert.jsx";
import { useSearchParams } from "react-router-dom";
import { useScrollToTop } from "../common/hooks/useScrollToTop.js";

export default function CorrectionsPage() {
  const [searchParams] = useSearchParams();
  const item = searchParams.get("item");
  useScrollToTop({ force: true });

  return (
    <Page>
      <TitleLayout title={"Correction et fiabilisation des données"} />
      <ContentLayout>
        <GridRow modifiers={"gutters"} className={"fr-pb-3w"}>
          <Col modifiers={"12"}>
            <Highlight>Le référentiel est une photographie à l’instant de consultation !</Highlight>
          </Col>
        </GridRow>
        <GridRow modifiers={"gutters"} className={"fr-pb-3w"}>
          <Col modifiers={"12"}>
            <Accordion>
              <AccordionItem
                collapsed={item === "nature"}
                label={"La nature d’un organisme est inconnue ou incorrecte"}
              >
                <div>
                  <Alert modifiers={"info sm"}>
                    <p>La modifications de la nature d’un organisme impacte ses relations avec les autres organismes</p>
                  </Alert>
                  <div className={"fr-mt-3w"}>
                    <span className={"fr-text--bold fr-pr-1v"}>
                      Si un organisme a pour nature "N.A" (inconnue), c’est que l'offre de formation n’est pas collectée
                    </span>
                    par le Carif-Oref, il faudra donc dans un premier temps vérifier auprès de RCO si une modification
                    de la collecte est possible :
                    <ul>
                      <li>si oui, le CSAIO devra demander à son Carif-Oref de collecter les natures manquantes</li>
                      <li>si non, la correction devra se faire directement dans l’interface du Référentiel</li>
                      <ul>
                        <li>
                          <i>
                            aujourd’hui un seul cas s’est présenté, lorsque 3 niveaux d’organismes sont détectés (alors
                            que la collecte gère aujourd’hui seulement 2 niveaux : responsable > formateur), alors au
                            moins un des organisme a un nature inconnue quelque soit le niveau où il se trouve
                          </i>
                        </li>
                      </ul>
                    </ul>
                  </div>

                  <div className={"fr-mt-3w"}>
                    <span className={"fr-text--bold fr-pr-1v"}>
                      Si un organisme à une nature incorrecte, c’est que l'offre de formation est mal collectée
                    </span>
                    par le Carif-Oref, il faudra donc dans un premier temps vérifier auprès de RCO si une modification
                    de la collecte est possible :
                    <ul>
                      <li>si oui, le CSAIO devra demander à son Carif-Oref de modifier les natures incorrectes</li>
                      <li>si non, la correction devra se faire directement dans l’interface du Référentiel</li>
                      <ul>
                        <li>
                          <i>
                            aujourd’hui un seul cas s’est présenté, lorsque 3 niveaux d’organismes sont détectés (alors
                            que la collecte gère aujourd’hui seulement 2 niveaux : responsable > formateur), alors les
                            natures sont mal réparties et par exemple le responsable se retrouve au niveau du formateur
                            et le formateur inconnu.
                          </i>
                        </li>
                      </ul>
                    </ul>
                  </div>
                </div>
              </AccordionItem>
              <AccordionItem collapsed={item === "relations"} label={"Des relations entre organismes sont incorrectes"}>
                <div>
                  <p className={"fr-mt-3w"}>
                    <span className={"fr-text--bold fr-pr-1v"}>
                      Si des relations entre organismes ne devraient pas avoir lieu
                    </span>
                    (ex : MFR rattaché à un CFA EN), le CSAIO devra demander à son Carif-Oref une modification de la
                    collecte (par ex : suppression du formateur rattaché au responsable).
                  </p>
                  <p>
                    <span className={"fr-text--bold fr-pr-1v"}>
                      Si des relations sont incorrectes aujourd’hui mais historiquement correctes,
                    </span>
                    aucune action n’est possible pour le moment.
                    <span className={"fr-text--bold fr-pr-1v"}>
                      Une expression de besoin sera transmise au RCO pour que leur nouvel
                    </span>
                    annuaire des établissements QUIFORME introduise la notion d’historique des natures et des relations.
                  </p>
                </div>
              </AccordionItem>
              <AccordionItem
                collapsed={item === "lieu"}
                label={"Des informations concernant un lieu de formation sont incorrectes (UAI ou adresse)"}
              >
                <div>
                  <p className={"fr-mt-3w"}>
                    <span className={"fr-text--bold fr-pr-1v"}>S’il s’agit d’une erreur sur l’adresse,</span> le CSAIO
                    devra demander à son Carif-Oref une modification de l’adresse postale du lieu de formation concerné.
                  </p>
                  <div>
                    <span className={"fr-text--bold fr-pr-1v"}>S’il s’agit d’une erreur sur UAI,</span> le CSAIO peut
                    faire la modification directement dans le Catalogue des formations en apprentissage :
                    <ol>
                      <li>
                        Utiliser la recherche avancée pour trouver le lieu de formation :
                        <ul>
                          <li>indiquer SIRET de l’organisme (gestionnaire ou formateur)</li>
                          <li>indiquer la commune du lieu de formation égale à (recherche stricte)</li>
                        </ul>
                      </li>
                      <li>
                        Utiliser la liste qui s’affiche qui contient potentiellement les formations sur lesquelles
                        modifier l’UAI du lieu de formation
                        <img
                          width={"75%"}
                          alt={"Page du catalogue des formations en apprentissage"}
                          src={`${process.env.PUBLIC_URL}/catalogue-page.png`}
                        ></img>
                      </li>
                    </ol>
                  </div>
                </div>
              </AccordionItem>
              <AccordionItem
                collapsed={item === "organisme"}
                label={"Un organisme ne devrait pas être présent dans le référentiel"}
              >
                <div>
                  <p className={"fr-mt-3w"}>
                    Si un organisme ne devrait pas être présent dans le référentiel (par exemple s’il s’agit d’une école
                    maternelle ou élémentaire), merci de le signaler à l’adresse mail suivante :
                    referentiel@apprentissage.beta.gouv.fr pour demander le retrait des listes de cet organisme.
                  </p>
                </div>
              </AccordionItem>
            </Accordion>
          </Col>
        </GridRow>
      </ContentLayout>
    </Page>
  );
}
