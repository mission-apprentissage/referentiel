import React from "react";

export default function RaisonSociale({ organisme }) {
  return <span>{organisme.enseigne || organisme.raison_sociale || "Raison sociale inconnue"}</span>;
}
