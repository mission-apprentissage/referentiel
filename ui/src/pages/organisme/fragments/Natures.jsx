import React from "react";
import { capitalizeFirstLetter } from "../../../common/utils";

export function Natures({ organisme }) {
  let natures = organisme.natures.sort().reverse().join(" et ");

  return <span>{capitalizeFirstLetter(natures)}</span>;
}
