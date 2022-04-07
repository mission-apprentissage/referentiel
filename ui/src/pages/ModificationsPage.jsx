import React from "react";
import TitleLayout from "../common/layout/TitleLayout";
import ContentLayout from "../common/layout/ContentLayout";
import Page from "../common/Page";
import styled from "styled-components";
import { Col, GridRow } from "../common/dsfr/fondamentaux";
import { Summary } from "../common/dsfr/elements/Summary";
import { DateTime } from "luxon";
import { cloneNodes } from "../common/utils";

const Modification = styled(({ id, date, titre, texte, className }) => {
  return (
    <div id={id} className={className}>
      <h4>Le {DateTime.fromISO(date).setLocale("fr").toLocaleString(DateTime.DATE_FULL)}</h4>
      <h6>{titre}</h6>
      {texte}
    </div>
  );
})`
  h4 {
    color: #666666;
  }

  h6 {
    border-bottom: 1px solid #cecece;
  }
`;

export const modifications = [
  <Modification
    date={"2022-04-04"}
    titre={"Ajout de l'export"}
    texte={
      <div>
        <p>Il est désormais possible d'export la liste des organismes.</p>
      </div>
    }
  />,
  <Modification
    date={"2022-03-21"}
    titre={"Ajout des lieux de formations et des statistiques"}
    texte={
      <div>
        <p>Il est possible de consulter dans une fiche organisme les lieux de formations.</p>
        <p>Il également possible de consulter le nombre de nouveaux organismes depuis le tableau de bord.</p>
      </div>
    }
  />,
  <Modification
    date={"2022-02-18"}
    titre={"Ajout des relations entre les organismes"}
    texte={
      <p>
        Il est à présent possible de consulter dans une fiche organisme les relations qu’il entretient avec d’autres
        organismes en tant que responsable et/ou formateur.
      </p>
    }
  />,
];

export default function ModificationsPage() {
  return (
    <Page>
      <TitleLayout title={"Journal des modifications"} />
      <ContentLayout>
        <GridRow>
          <Col modifiers={"8"}>
            {cloneNodes(modifications, (modification) => {
              let date = modification.props.date;
              return { ...modification, key: date, id: date };
            })}
          </Col>
          <Col modifiers={"offset-1 3"}>
            <Summary>
              {modifications.map((m) => {
                return <a href={`#${m.props.date}`}>{m.props.titre}</a>;
              })}
            </Summary>
          </Col>
        </GridRow>
      </ContentLayout>
    </Page>
  );
}
