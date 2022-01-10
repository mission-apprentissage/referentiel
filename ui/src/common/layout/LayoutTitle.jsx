import { Col, Container, GridRow } from "../dsfr/fondamentaux";
import React from "react";
import FilAriane from "../FilAriane";
import styled from "styled-components";
import LinkButton from "../dsfr/custom/LinkButton";
import { useNavigate } from "react-router-dom";

const Back = styled(LinkButton)`
  margin-bottom: 1.5rem;
`;

export default function LayoutTitle({ title, back, selector, children }) {
  let navigate = useNavigate();

  return (
    <Container>
      <GridRow modifier={"gutters"}>
        <Col>
          <FilAriane />
        </Col>
      </GridRow>
      {back && (
        <GridRow modifier={"gutters"}>
          <Col>
            <Back icons={"arrow-left-line"} onClick={() => navigate(-1)}>
              {back}
            </Back>
          </Col>
        </GridRow>
      )}
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
