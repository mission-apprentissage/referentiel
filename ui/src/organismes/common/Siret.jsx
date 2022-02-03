import React from "react";
import { asSiren } from "../../common/utils";

export default function Siret({ organisme }) {
  return (
    <>
      <span className={"fr-mr-1v"}>{asSiren(organisme.siret)}</span>
      <span className={"fr-mr-1v"}>{organisme.siret.substring(9, 14)}</span>
    </>
  );
}
