import { Box } from "../../../common/components/Flexbox";
import styled from "styled-components";
import Statuts from "../../organisme/fragments/Statuts";
import React from "react";
import Identite from "../../organisme/fragments/Identite";
import { Link } from "../../../common/components/dsfr/elements/Link";

const RaisonSociale = styled("div")`
  font-size: 1.25rem;
  line-height: 2rem;
  padding-bottom: 0.25rem;
`;

const Adresse = styled("div")`
  font-size: 1rem;
  line-height: 1.5rem;
  padding-bottom: 0.5rem;
`;

const Identifiants = styled(Box)`
  font-size: 0.875rem;
  line-height: 1.5rem;
`;

const Result = styled(Box)`
  background-color: #f9f8f6;
  padding: 1rem 2rem;
  margin-bottom: 1rem;
`;

export default function OrganismeItem({ organisme }) {
  let adresse = organisme.adresse?.label || `${organisme.adresse?.code_postal} ${organisme.adresse?.localite}`;

  return (
    <Result direction={"column"}>
      <Box justify={"between"}>
        <Statuts organisme={organisme} />
        <Identite organisme={organisme} />
      </Box>
      <RaisonSociale className={"fr-text--bold"}>{organisme.raison_sociale}</RaisonSociale>
      <Adresse>{adresse}</Adresse>
      <Box justify={"between"} align={"center"}>
        <Identifiants>
          <span style={{ width: "50%" }}>UAI&nbsp;:&nbsp;{organisme.uai || "N.A"}</span>
          <span style={{ width: "50%" }}>SIRET&nbsp;:&nbsp;{organisme.siret}</span>
        </Identifiants>
        <Link to={`/organismes/${organisme.siret}`} modifiers={"lg icon-right"} icons="arrow-right-line" />
      </Box>
    </Result>
  );
}
