import { Col, Container, GridRow } from "../dsfr/fondamentaux";
import React, { useContext } from "react";
import FilAriane from "./FilAriane";
import styled from "styled-components";
import LinkButton from "../dsfr/custom/LinkButton";
import { useNavigate } from "react-router-dom";
import { ValidationTitle } from "../../pages/ValidationPage";
import { OrganismeTitle } from "../../pages/OrganismePage";
import { AuthContext } from "../AuthRoutes";

const Back = styled(LinkButton)`
  margin-bottom: 1.5rem;
`;

const Message = styled("div")`
  margin-bottom: 1.5rem;
`;

export default function TitleLayout({ title, message, back, selector, children }) {
  let navigate = useNavigate();
  let [auth] = useContext(AuthContext);
  let authTitle = `${auth.type === "region" ? "Région" : "Académie"} : ${auth.nom}`;

  return (
    <Container>
      <GridRow modifiers={"gutters"}>
        <Col>
          <FilAriane
            routes={[
              { path: "/", breadcrumb: `Tableau de bord (${authTitle})` },
              { path: "/validation/:type", breadcrumb: ValidationTitle },
              { path: "/validation/:type/:siret", breadcrumb: OrganismeTitle },
              { path: "/organismes", breadcrumb: "Liste des organismes" },
              { path: "/organismes/:siret", breadcrumb: OrganismeTitle },
            ]}
          />
        </Col>
      </GridRow>
      {message && (
        <GridRow modifiers={"gutters"}>
          <Col>
            <Message>{message}</Message>
          </Col>
        </GridRow>
      )}
      {back && (
        <GridRow modifiers={"gutters"}>
          <Col>
            <Back icons={"arrow-left-line"} onClick={() => navigate(-1)}>
              {back}
            </Back>
          </Col>
        </GridRow>
      )}
      <GridRow className={"fr-pb-1w"}>
        <Col modifiers={"12 md-8"}>
          {title && <h2>{title}</h2>}
          {children}
        </Col>
        {selector && <Col modifiers={"12 md-4"}>{selector}</Col>}
      </GridRow>
    </Container>
  );
}
