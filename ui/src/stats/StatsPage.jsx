import { Col, GridRow } from "../common/dsfr/fondamentaux/index.js";
import React from "react";
import TitleLayout from "../common/layout/TitleLayout.jsx";
import ContentLayout from "../common/layout/ContentLayout.jsx";
import NaturesStats from "./natures/NaturesStats.jsx";
import ValidationStats from "./validation/ValidationStats.jsx";
import QualiopiStats from "./qualiopi/QualiopiStats.jsx";
import Page from "../common/Page.jsx";

export default function StatsPage() {
  return (
    <Page>
      <TitleLayout title={"Statistiques"} />
      <ContentLayout>
        <GridRow modifiers={"gutters"} className={"fr-mb-3w"}>
          <Col modifiers={"12"}>
            <h6>Validation</h6>
            <ValidationStats />
          </Col>
        </GridRow>
        <GridRow modifiers={"gutters"} className={"fr-mb-3w"}>
          <Col modifiers={"12"}>
            <h6>Natures</h6>
            <NaturesStats />
          </Col>
        </GridRow>
        <GridRow modifiers={"gutters"} className={"fr-mb-3w"}>
          <Col modifiers={"12"}>
            <h6>Qualiopi</h6>
            <QualiopiStats />
          </Col>
        </GridRow>
      </ContentLayout>
    </Page>
  );
}
