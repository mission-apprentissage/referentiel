import { Box } from "../../common/Flexbox";
import styled from "styled-components";
import React from "react";
import { Link } from "../../common/dsfr/elements/Link";
import ClickableItem from "../../common/ClickableItem";
import { Tag } from "../../common/dsfr/elements/Tag";
import Natures from "../fiche/Natures";

const Card = styled(Box)`
  padding: 1rem 2rem;
  margin-bottom: 1rem;
  background-color: var(--color-box-background);
  &:hover {
    background-color: var(--color-box-background-hover);
  }
`;

const RaisonSociale = styled.div`
  font-size: 1.25rem;
  line-height: 2rem;
  padding-bottom: 0.25rem;
`;

const Adresse = styled.div`
  font-size: 1rem;
  line-height: 1.5rem;
  padding-bottom: 0.5rem;
`;

const Identifiants = styled(Box)`
  font-size: 0.875rem;
  line-height: 1.5rem;
  span {
    width: 50%;
  }
`;

const ValidationTag = styled(({ organisme, ...props }) => {
  if (!organisme.uai) {
    return <span {...props} />;
  }

  return (
    <Tag modifiers="sm icon-left" icons={"checkbox-circle-fill"} {...props}>
      UAI validée
    </Tag>
  );
})`
  &::before {
    color: var(--green-emeraude-main-632);
  }
`;

export default function OrganismeItem({ organisme }) {
  let adresse = !organisme.adresse
    ? "Adresse inconnue"
    : organisme.adresse.label || `${organisme.adresse.code_postal || ""} ${organisme.adresse.localite || ""}`;

  return (
    <ClickableItem to={organisme.siret}>
      <Card direction={"column"}>
        {organisme.natures.length > 0 && (
          <Box justify={"between"}>
            <Tag modifiers="sm">{<Natures organisme={organisme} />}</Tag>
            <ValidationTag organisme={organisme} />
          </Box>
        )}
        <Box justify={"between"}>
          <RaisonSociale className={"fr-text--bold"} style={{ width: "85%" }}>
            {organisme.raison_sociale || "Raison sociale inconnue"}
          </RaisonSociale>
        </Box>
        <Adresse>{adresse}</Adresse>
        <Box justify={"between"} align={"center"}>
          <Identifiants>
            <span>UAI&nbsp;:&nbsp;{organisme.uai || "N.A"}</span>
            <span>SIRET&nbsp;:&nbsp;{organisme.siret}</span>
          </Identifiants>
          <Link as={"span"} modifiers={"lg icon-right"} icons="arrow-right-line" />
        </Box>
      </Card>
    </ClickableItem>
  );
}
