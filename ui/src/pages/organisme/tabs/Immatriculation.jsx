import React from "react";
import styled from "styled-components";
import cs from "classnames";
import { Col, GridRow } from "../../../common/components/dsfr/fondamentaux";
import UAIValidator from "../fragments/validator/UAIValidator";

const Info = styled(({ label, value, children, className, ...rest }) => {
  return (
    <div className={cs(className, "fr-text", "fr-py-3v")} {...rest}>
      <span className={"fr-text--regular"}>{label} :&nbsp;</span>
      <span className={cs("fr-text", "fr-text--bold", "fr-p-1v", "value", { na: !value })}>{value || "N.A"}</span>
      {children}
    </div>
  );
})`
  .value {
    background-color: var(--background-alt-beige-gris-galet);
    &.na {
      color: var(--text-disabled-grey);
    }
  }
`;

export function Immatriculation({ organisme }) {
  let adresse = organisme.adresse?.label || `${organisme.adresse?.code_postal} ${organisme.adresse?.localite}`;

  return (
    <>
      <h2>Immatriculation</h2>
      <Info label={"SIRET"} value={organisme.siret} />
      <Info label={"NDA"} value={organisme.numero_declaration_activite} />
      <Info label={"UAI"} value={organisme.uai}>
        <UAIValidator className="fr-ml-3v" organisme={organisme} />
      </Info>
      <GridRow>
        <Col modifiers={"sm-12 md-6"}>
          <Info label={"Raison sociale"} value={organisme.raison_sociale} />
          <Info label={"Adresse"} value={adresse} />
          <Info label={"Région"} value={organisme.adresse?.region?.nom} />
          <Info label={"Académie"} value={organisme.adresse?.academie?.nom} />
        </Col>
        <Col modifiers={"sm-12 offset-md-1 md-5"}>
          <Info label={"Certifié Qualiopi"} value={organisme.qualiopi ? "Oui" : "Non"} />
          <Info label={"Forme jurique"} value={organisme.forme_juridique?.label} />
          <Info label={"Etat administratif"} value={organisme.etat_administratif} />
        </Col>
      </GridRow>
    </>
  );
}
