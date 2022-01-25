import React from "react";
import { capitalizeFirstLetter } from "../../common/utils";
import NA from "./NA";

export default function Natures({ organisme }) {
  if (organisme.natures.length === 0) {
    return <NA />;
  }

  let natures = organisme.natures.sort().reverse().join(" et ");
  return <span>{capitalizeFirstLetter(natures)}</span>;
}
