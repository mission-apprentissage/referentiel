import React from "react";

export default function Adresse({ organisme }) {
  let adresse = organisme.adresse;
  return <span>{adresse?.label || `${adresse?.code_postal} ${adresse?.localite}`}</span>;
}
