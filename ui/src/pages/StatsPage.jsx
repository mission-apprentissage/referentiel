import { Col, GridRow } from "../common/dsfr/fondamentaux";
import React from "react";
import TitleLayout from "../common/layout/TitleLayout";
import ContentLayout from "../common/layout/ContentLayout";
import NaturesStats from "../stats/natures/NaturesStats";
import ValidationStats from "../stats/validation/ValidationStats";
import QualiopiStats from "../stats/qualiopi/QualiopiStats";

export default function StatsPage() {
  return (
    <>
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
    </>
  );
}
