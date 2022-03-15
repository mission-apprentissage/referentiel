import React from "react";
import { capitalizeFirstLetter } from "../../common/utils";
import NA from "./NA";

export default function Nature({ organisme }) {
  if (!organisme.nature) {
    return <NA />;
  }

  return <span>{capitalizeFirstLetter(organisme.nature.replace(/_/g, " et "))}</span>;
}
