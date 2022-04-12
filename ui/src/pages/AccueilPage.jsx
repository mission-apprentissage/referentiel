import { Col, GridRow } from "../common/dsfr/fondamentaux";
import React from "react";
import TitleLayout from "../common/layout/TitleLayout";
import ContentLayout from "../common/layout/ContentLayout";
import { Summary } from "../common/dsfr/elements/Summary";
import { Button } from "../common/dsfr/elements/Button";
import { useNavigate } from "react-router-dom";
import { useFetch } from "../common/hooks/useFetch";
import { percentage } from "../common/utils";
import Page from "../common/Page";
import { modifications } from "./ModificationsPage";

export default function AccueilPage() {
  let navigate = useNavigate();
  let [{ data: stats }] = useFetch("/api/v1/stats/couverture", null);

  return (
    <Page>
      <TitleLayout />
      <ContentLayout>
        <GridRow modifiers={"gutters"} className={"fr-pb-3w"}>
          <Col modifiers={"sm-3"} className={"xfr-display-none xfr-display-sm-block"}>
            <Summary>
              <a href={"#référentiel"}>Référentiel national</a>
              <a href={"#construction"}>Construction du référentiel</a>
              <a href={"#modifications"}>Journal des modifications</a>
            </Summary>
          </Col>
          <Col modifiers={"12 offset-sm-1 sm-8"}>
            <h2>Bienvenue sur le Référentiel des organismes de formation en apprentissage</h2>
            <h6 id={"référentiel"}>
              Aujourd’hui, des travaux d'expertise sont en cours dans chaque académie.
              {stats && (
                <div>
                  Il contient {Math.round(percentage(stats.valides, stats.total))}% d’organismes validés sur le
                  territoire national.
                </div>
              )}
            </h6>
            {stats && (
              <div className={"fr-mt-3w fr-text--bold"}>
                Les {stats.total} organismes référencés dans le référentiel sont :
              </div>
            )}
            <ol>
              <li>identifiés par un SIRET</li>
              <li>
                trouvés dans la Liste publique des Organismes de Formation (Data.gouv), la base ACCE et le Catalogue des
                formations en apprentissage (base des Carif-Oref)
              </li>
              <li>en lien avec des formations en apprentissage à un moment donné</li>
            </ol>
            <Button className={"fr-mt-3w"} onClick={() => navigate("/organismes")}>
              Consulter le référentiel national
            </Button>
            <h6 id={"construction"} className={"fr-mt-6w"}>
              Construction du référentiel
            </h6>
            <div className={"fr-mt-3w"}>
              <span className={"fr-text--bold"}>
                La construction du référentiel national permet de constituer une liste d’organismes avec les
                informations suivantes :
              </span>
              UAI, Nature (Responsable ; Responsable et formateur ; Formateur), SIREN, SIRET, Numéro de déclaration
              d’activité (NDA), Certification Qualiopi, Enseigne, Raison sociale, Réseau, Adresse, Région, Académie.
              <div className={"fr-mt-3w fr-text--bold"}>
                À chaque organisme de formation est associé une liste de relations avec d’autres organismes et une liste
                de lieux de formations.
              </div>
              <Button className={"fr-mt-3w"} modifiers={"secondary"} onClick={() => navigate("/construction")}>
                En savoir plus
              </Button>
            </div>
            <h6 id={"modifications"} className={"fr-mt-6w"}>
              Dernière modification
            </h6>
            <div className={"fr-mt-3w"}>{modifications[0]}</div>
            <Button
              className={"fr-mt-3w"}
              modifiers={"secondary"}
              onClick={() => {
                window.scrollTo(0, 0);
                return navigate("/modifications");
              }}
            >
              Voir toutes les modifications
            </Button>
          </Col>
        </GridRow>
      </ContentLayout>
    </Page>
  );
}
