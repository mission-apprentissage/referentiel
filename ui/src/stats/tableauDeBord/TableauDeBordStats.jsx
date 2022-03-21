import React from "react";
import { Col, GridRow } from "../../common/dsfr/fondamentaux";
import NouveauxHistogram from "./NouveauxHistogram";
import EtatAdministratifPie from "./EtatAdministratifPie";

export default function TableauDeBordStats() {
  return (
    <GridRow modifiers={"gutters"}>
      <Col modifiers={"6"}>
        <NouveauxHistogram />
      </Col>
      <Col modifiers={"6"}>
        <EtatAdministratifPie />
      </Col>
    </GridRow>
  );
}
