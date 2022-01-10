import { Col, Container, GridRow } from "../dsfr/fondamentaux";
import React from "react";
import FilAriane from "../FilAriane";

export default function LayoutTitle({ title, selector, children }) {
  return (
    <Container>
      <GridRow modifier={"gutters"}>
        <Col>
          <FilAriane />
        </Col>
      </GridRow>
      <GridRow className={"fr-pb-1w"}>
        <Col modifiers={"12 md-7"}>
          {title && <h2>{title}</h2>}
          {children}
        </Col>
        {selector && <Col modifiers={"12 md-5"}>{selector}</Col>}
      </GridRow>
    </Container>
  );
}
