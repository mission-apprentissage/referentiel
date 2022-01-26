import React from "react";

export default function Siret({ siret }) {
  return (
    <>
      <span className={"fr-mr-1v"}>{siret.substr(0, 9)}</span>
      <span className={"fr-mr-1v"}>{siret.substr(10, 14)}</span>
    </>
  );
}
