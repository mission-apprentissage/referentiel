import { Col, Container, GridRow } from "../dsfr/fondamentaux";
import React, { useContext } from "react";
import FilAriane from "./FilAriane";
import styled from "styled-components";
import LinkButton from "../dsfr/custom/LinkButton";
import { ValidationTitle } from "../../tableau-de-bord/ValidationPage.jsx";
import { OrganismeTitle } from "../../organismes/OrganismePage.jsx";
import { ApiContext } from "../ApiProvider";
import { Box } from "../Flexbox";
import useToggle from "../hooks/useToggle";

export function Back({ children, ...rest }) {
  return (
    <LinkButton icons={"arrow-left-line"} className={"fr-mb-3w"} {...rest}>
      {children}
    </LinkButton>
  );
}

const Message = styled("div")`
  margin-bottom: 1.5rem;
`;

export default function TitleLayout({ title, details, getDetailsMessage, message, back, selector }) {
  const [showDetails, toggleDetails] = useToggle(false);
  const { auth } = useContext(ApiContext);
  const authTitle = `${auth.type === "region" ? "Région" : "Académie"} : ${auth.nom}`;

  return (
    <Container>
      <GridRow modifiers={"gutters"}>
        <Col>
          <FilAriane
            routes={[
              { path: "/", breadcrumb: "Accueil" },
              { path: "/construction", breadcrumb: "Construction du référentiel" },
              { path: "/corrections", breadcrumb: "Correction et fiabilisation des données" },
              { path: "/modifications", breadcrumb: "Journal des modifications" },
              { path: "/stats", breadcrumb: "Statistiques" },
              { path: "/organismes", breadcrumb: "Liste des organismes" },
              { path: "/organismes/:siret", breadcrumb: OrganismeTitle },
              { path: "/tableau-de-bord", breadcrumb: `Tableau de bord (${authTitle})` },
              { path: "/tableau-de-bord/validation/:type", breadcrumb: ValidationTitle },
              { path: "/tableau-de-bord/validation/:type/:siret", breadcrumb: OrganismeTitle },
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
          <Col>{back}</Col>
        </GridRow>
      )}
      <GridRow className={"fr-pb-1w"}>
        <Col modifiers={"12 md-8"}>
          <Box align={"baseline"}>
            {title && <h2>{title}</h2>}
            {details && (
              <LinkButton
                className={"fr-ml-2w"}
                modifiers={"sm icon-right"}
                icons={`arrow-${showDetails ? "up" : "down"}-s-line`}
                onClick={() => toggleDetails()}
              >
                {getDetailsMessage ? getDetailsMessage(showDetails) : "Afficher les informations"}
              </LinkButton>
            )}
          </Box>
          {showDetails && details}
        </Col>
        {selector && <Col modifiers={"12 md-4"}>{selector}</Col>}
      </GridRow>
    </Container>
  );
}
