import React from "react";
import TitleLayout from "./common/layout/TitleLayout.jsx";
import ContentLayout from "./common/layout/ContentLayout.jsx";
import Page from "./common/Page.jsx";
import styled from "styled-components";
import { Col, GridRow } from "./common/dsfr/fondamentaux/index.js";
import { Summary } from "./common/dsfr/elements/Summary.jsx";
import { DateTime } from "luxon";
import { capitalizeFirstLetter, cloneNodes } from "./common/utils.js";

function formatDate(date, pattern) {
  return DateTime.fromISO(date).setLocale("fr").toLocaleString(pattern);
}

function Modifications({ id, date, children, className }) {
  return (
    <div id={id} className={className}>
      <h4>Le {formatDate(date, DateTime.DATE_FULL)}</h4>
      {children}
    </div>
  );
}

const Modification = styled(({ titre, children }) => {
  return (
    <div className={"fr-mb-4w"}>
      <h6>{titre}</h6>
      {children}
    </div>
  );
})`
  h4 {
    color: #666666;
  }

  h6 {
    padding-bottom: 0.5rem;
    border-bottom: 1px solid #cecece;
  }
`;

export const modifications = [
  <Modifications date={"2022-09-15"}>
    <Modification>
      <p>Automatisation de la récupération des UAI valides de la base ACCE PRO</p>
    </Modification>
  </Modifications>,
  <Modifications date={"2022-09-06"}>
    <Modification>
      <ul>
        <li>Remplacement de l’API entreprise.data.gouv.fr par l’api INSEE</li>
        <li>Ajout des organismes formateurs dans la page Tableau de Bord (mode connecté)</li>
        <li>Ajout des statistiques de validation des organismes formateurs dans la page "Statistiques"</li>
      </ul>
    </Modification>
  </Modifications>,
  <Modifications date={"2022-06-27"}>
    <Modification>
      <ul>
        <li>Ajout de la page "Correction et fiabilisation des données"</li>
        <li>Corrections de données pour certains sirets</li>
      </ul>
    </Modification>
  </Modifications>,
  <Modifications date={"2022-06-08"}>
    <Modification>
      <p>
        Ajout de l’onglet "impact sur les sources de données entrantes" dans la page "Construction du Référentiel
        national"
      </p>
    </Modification>
  </Modifications>,
  <Modifications date={"2022-05-21"}>
    <Modification>
      <ul>
        <li>Proposition d’UAI valides via un lien vers ACCE PRO</li>
        <li>Correction d’un bug sur les statistiques de couverture</li>
        <li>Ajout d’une recherche des organismes sans académies</li>
        <li>Affichage des départements en fonction du lien de connexion utilisé.</li>
      </ul>
    </Modification>
  </Modifications>,
  <Modifications date={"2022-04-04"}>
    <Modification titre={"Ajout de l'export"}>
      <p>Il est désormais possible d'exporter la liste des organismes.</p>
    </Modification>
  </Modifications>,
  <Modifications date={"2022-03-21"}>
    <Modification titre={"Ajout des lieux de formations et des statistiques"}>
      <p>Il est possible de consulter dans une fiche organisme les lieux de formations.</p>
      <p>Il également possible de consulter le nombre de nouveaux organismes depuis le tableau de bord.</p>
    </Modification>
  </Modifications>,
  <Modifications date={"2022-02-18"}>
    <Modification titre={"Ajout des relations entre les organismes"}>
      <p>
        Il est à présent possible de consulter dans une fiche organisme les relations qu’il entretient avec d’autres
        organismes en tant que responsable et/ou formateur.
      </p>
    </Modification>
  </Modifications>,
];

export default function ModificationsPage() {
  return (
    <Page>
      <TitleLayout title={"Journal des modifications"} />
      <ContentLayout>
        <GridRow>
          <Col modifiers={"8"}>
            {cloneNodes(modifications, (modification) => {
              const date = modification.props.date;
              return { ...modification, key: date, id: date, className: "fr-mb-8w" };
            })}
          </Col>
          <Col modifiers={"offset-1 3"}>
            <Summary>
              {modifications.map((m) => {
                return (
                  <a href={`#${m.props.date}`}>
                    {capitalizeFirstLetter(formatDate(m.props.date, { month: "long", year: "numeric" }))}
                  </a>
                );
              })}
            </Summary>
          </Col>
        </GridRow>
      </ContentLayout>
    </Page>
  );
}
