import React from "react";
import TitleLayout from "./common/layout/TitleLayout.jsx";
import ContentLayout from "./common/layout/ContentLayout.jsx";
import Page from "./common/Page.jsx";
import { Accordion, AccordionItem } from "./common/dsfr/elements/Accordion.jsx";
import { Col, GridRow } from "./common/dsfr/fondamentaux/index.js";
import Highlight from "./common/dsfr/elements/Highlight.jsx";
import Alert from "./common/dsfr/elements/Alert.jsx";
import { useSearchParams } from "react-router-dom";
import { useScrollToTop } from "./common/hooks/useScrollToTop.js";

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
            <Highlight>
              Il se peut que certaines données affichées sur le Référentiel soient erronées ou que des données soient
              manquantes. Cette page vous donne des indications sur la procédure à suivre pour les corriger ou les
              compléter.
              <br /> Pour tout autre signalement, vous pouvez contacter l’équipe gestionnaire du site à l’adresse
              suivante : referentiel-uai-siret@onisep.fr
            </Highlight>
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
                      Si un organisme est de Nature inconnue, c’est qu’il n’y a pas d’offre de formation collectée
                    </span>
                    par le Carif-Oref pour cet établissement. Aucune nature n’a pu être déduite. Il faut donc vérifier
                    auprès du Carif-Oref d’appartenance qu’une modification de la collecte est possible. Si oui, le
                    Carif-Oref devra alors référencer l’offre de formation de l'organisme manquant. La collecte de cette
                    offre permettra de déduire la nature de l’organisme.
                  </div>

                  <div className={"fr-mt-3w"}>
                    <span className={"fr-text--bold fr-pr-1v"}>
                      Si un organisme a une Nature incorrecte, c’est que l’offre de formation est mal collectée
                    </span>
                    par le Carif-Oref pour cet établissement. Il faut donc vérifier auprès du Carif-Oref d’appartenance
                    qu’une modification de la collecte est possible. Si oui, le Carif-Oref devra alors modifier la
                    collecte de l’offre existante afin de corriger les natures incorrectes.
                    <br /> Ex : un organisme de formation est de nature Responsable et formateur dans le Référentiel,
                    mais en réalité il n’accueille pas d’apprentis et gère simplement les conventions de formation en
                    apprentissage. Il devrait donc être de nature Responsable uniquement. Dans ce cas précis, la
                    collecte de l’offre devra être modifiée pour que cet établissement n’apparaisse pas comme organisme
                    formateur au niveau de l’offre de formation. La nature sera alors automatiquement corrigée dans le
                    Référentiel.
                  </div>
                </div>
              </AccordionItem>
              <AccordionItem collapsed={item === "relations"} label={"Des relations entre organismes sont incorrectes"}>
                <div>
                  <p className={"fr-mt-3w"}>
                    <span className={"fr-text--bold fr-pr-1v"}>Si des relations entre organismes sont erronées,</span>
                    il faut demander une modification de la collecte auprès du Carif-Oref d’appartenance (par ex :
                    suppression de l’organisme formateur rattaché au responsable).
                  </p>
                  <p>
                    <span className={"fr-text--bold fr-pr-1v"}>
                      Si des relations sont incorrectes aujourd’hui mais historiquement correctes,
                    </span>
                    aucune action n’est possible pour le moment.
                    <p className={"fr-pr-1v"}>
                      <i>Etude en cours côté ONISEP.</i>
                    </p>
                  </p>
                </div>
              </AccordionItem>
              <AccordionItem
                collapsed={item === "lieu"}
                label={"Des informations concernant un lieu de formation sont incorrectes (UAI ou adresse)"}
              >
                <div>
                  <p className={"fr-mt-3w"}>
                    <span className={"fr-text--bold fr-pr-1v"}>S’il s’agit d’une erreur sur l’adresse,</span> il faut
                    demander au Carif-Oref d’appartenance une modification de l’adresse postale du lieu de formation
                    concerné.
                  </p>
                  <div>
                    <span className={"fr-text--bold fr-pr-1v"}>
                      S’il s’agit d’une erreur sur un UAI lieu de formation,
                    </span>{" "}
                    merci d’adresser votre signalement à l’adresse suivante : referentiel-uai-siret@onisep,fr
                  </div>
                </div>
              </AccordionItem>
              <AccordionItem
                collapsed={item === "organisme"}
                label={"Un organisme ne devrait pas être présent dans le Référentiel"}
              >
                <div>
                  <p className={"fr-mt-3w"}>
                    Si un organisme ne devrait pas être présent dans le Référentiel (par exemple s’il s’agit d’une école
                    maternelle ou élémentaire), merci de le signaler à l’adresse mail suivante :
                    referentiel-uai-siret@onisep.fr pour demander le retrait des listes de cet organisme.
                  </p>
                </div>
              </AccordionItem>
              <AccordionItem collapsed={item === "erronee"} label={"Une UAI validée dans le Référentiel est erronée"}>
                <div>
                  <p className={"fr-mt-3w"}>
                    <b>Si une UAI validée dans le Référentiel vous semble erronée,</b> merci d’adresser votre
                    signalement à l’équipe gestionnaire du site à l’adresse suivante : referentiel-uai-siret@onisep.fr
                    <br />
                    Une correction pourra se faire après validation par les référents en académie chargés de la
                    fiabilisation des couples UAI-SIRET.
                  </p>
                </div>
              </AccordionItem>
              <AccordionItem
                collapsed={item === "appartenance"}
                label={"L’appartenance à un réseau est erronée ou manquante"}
              >
                <div>
                  <p className={"fr-mt-3w"}>
                    L’appartenance à un réseau est une donnée qui vient du{" "}
                    <a href="https://cfas.apprentissage.beta.gouv.fr" target="_blank" rel="noreferrer">
                      Tableau de bord de l’Apprentissage
                    </a>
                    . Si cette donnée est erronée ou manquante, merci de contacter l’équipe support via le formulaire
                    suivant :{" "}
                    <a href="https://cfas.apprentissage.beta.gouv.fr/contact" target="_blank" rel="noreferrer">
                      https://cfas.apprentissage.beta.gouv.fr/contact
                    </a>
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
