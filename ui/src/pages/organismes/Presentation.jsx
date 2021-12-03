import { Box } from "../../common/components/Flexbox";
import React from "react";
import { Tag, TagGroup } from "../../common/components/dsfr/elements/Tag";

const statutsMapper = {
  gestionnaire: "OF-CFA",
  formateur: "UFA",
};

function Statuts({ organisme }) {
  return (
    <TagGroup>
      {organisme.statuts.map((statut, index) => {
        return (
          <Tag modifiers="sm" key={index}>
            {statutsMapper[statut]}
          </Tag>
        );
      })}
    </TagGroup>
  );
}

function Reseaux({ organisme }) {
  if (organisme.reseaux.length === 0) {
    return <div />;
  }
  return (
    <div>
      <span className={"fr-text--bold fr-pr-2v"}>Membre des réseaux</span>
      <span>{organisme.reseaux.join(" ,")}</span>
    </div>
  );
}

export function Presentation({ organisme }) {
  return (
    <>
      <h1>{organisme.raison_sociale}</h1>
      <Box>
        <Statuts organisme={organisme} />
        <Reseaux organisme={organisme} />
      </Box>
    </>
  );
}
