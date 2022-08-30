import React from "react";
import { Col, GridRow } from "../../common/dsfr/fondamentaux/index.js";
import NouveauxHistogram from "./NouveauxHistogram.jsx";
import EtatAdministratifPie from "./EtatAdministratifPie.jsx";

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
