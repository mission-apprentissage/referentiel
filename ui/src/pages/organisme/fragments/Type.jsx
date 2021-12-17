import { Tag, TagGroup } from "../../../common/components/dsfr/elements/Tag";
import React from "react";
import { isEqual } from "lodash-es";

function convertStatutsIntoType(statuts) {
  if (isEqual(statuts.sort(), ["formateur", "gestionnaire"])) {
    return "OF-CFA";
  } else if (isEqual(statuts, ["formateur"])) {
    return "UFA";
  } else if (isEqual(statuts, ["gestionnaire"])) {
    return "Entité administrative";
  }
  return "inconnu";
}

export default function Type({ organisme }) {
  let statuts = organisme.statuts;
  if (statuts.length === 0) {
    return <span>&#8239;</span>;
  }

  return (
    <TagGroup>
      <Tag modifiers="sm">{convertStatutsIntoType(statuts)}</Tag>
    </TagGroup>
  );
}
