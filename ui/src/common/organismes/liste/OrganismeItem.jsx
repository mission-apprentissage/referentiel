import { Box } from "../../Flexbox.jsx";
import styled from "styled-components";
import React from "react";
import ClickableItem from "../../ClickableItem.jsx";
import { Tag } from "../../dsfr/elements/Tag.jsx";
import Nature from "../Nature.jsx";
import Siret from "../Siret.jsx";
import RaisonSociale from "../RaisonSociale.jsx";
import { Link } from "../../dsfr/elements/Link.jsx";
import Badge from "../../dsfr/elements/Badge.jsx";

const CardBox = styled(Box)`
  padding: 1rem 2rem;
  margin-bottom: 1rem;
  background-color: var(--color-box-background);
  &:hover {
    background-color: var(--color-box-background-hover);
  }
`;

const Nom = styled.div`
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
  .uai {
    width: 15%;
  }
  .siret {
    display: inline;
    width: 85%;
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
  const adresse = !organisme.adresse
    ? "Adresse inconnue"
    : organisme.adresse.label || `${organisme.adresse.code_postal || ""} ${organisme.adresse.localite || ""}`;

  return (
    <ClickableItem to={organisme.siret}>
      <CardBox direction={"column"}>
        {organisme.nature && (
          <Box justify={"between"} align={"start"} className={"xfr-flex-direction-xs-column xfr-flex-direction-sm-row"}>
            <div>
              <Tag modifiers="sm" className={"fr-mr-1w fr-mb-1w"}>
                {<Nature organisme={organisme} />}
              </Tag>
              <ValidationTag organisme={organisme} />
            </div>
            {organisme._meta.nouveau && <Badge modifiers={"info"}>Nouvel organisme</Badge>}
          </Box>
        )}
        <Nom className={"fr-text--bold"}>
          <RaisonSociale organisme={organisme} />
        </Nom>
        <Adresse>{adresse}</Adresse>
        <Identifiants>
          <div className={"uai"}>UAI : {organisme.uai || "N.A"}</div>
          <div className={"siret"}>
            <span>SIRET : </span>
            <Siret organisme={organisme} />
          </div>
        </Identifiants>
        <Box direction={"column"} justify={"between"}>
          <Link as={"span"} modifiers={"lg icon-right"} icons="arrow-right-line" />
        </Box>
      </CardBox>
    </ClickableItem>
  );
}
