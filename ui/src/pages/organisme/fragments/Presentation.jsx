import { Box } from "../../../common/components/Flexbox";
import React from "react";
import Type from "./Type";

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
        <Type organisme={organisme} />
        <Reseaux organisme={organisme} />
      </Box>
    </>
  );
}
