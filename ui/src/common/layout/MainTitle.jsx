import { Col, Container, GridRow } from "../dsfr/fondamentaux";
import React from "react";
import FilAriane from "../FilAriane";

export default function MainTitle({ title, selector, children }) {
  return (
    <div>
      <Container>
        <FilAriane />
        <GridRow className={"fr-pb-1w"}>
          <Col modifiers={"12 sm-8"}>
            {title && <h2>{title}</h2>}
            {children}
          </Col>
          {selector && <Col modifiers={"12 sm-4"}>{selector}</Col>}
        </GridRow>
      </Container>
    </div>
  );
}
