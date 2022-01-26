import React from "react";

export default function Reseaux({ organisme }) {
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
