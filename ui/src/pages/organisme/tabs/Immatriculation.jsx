import React from "react";
import styled from "styled-components";
import cs from "classnames";
import { Col, GridRow } from "../../../common/dsfr/fondamentaux";
import UAIValidator from "../fragments/uai/UAISelector";
import { Natures } from "../fragments/Natures";

const Field = styled(({ label, value, children, className, ...rest }) => {
  return (
    <div className={cs(className, "fr-py-3v")} {...rest}>
      {label && <span className={"fr-text--regular"}>{label} :&nbsp;</span>}
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
      <h6>Immatriculation</h6>
      <GridRow>
        <Col>
          <Field label={"UAI"} value={organisme.uai}>
            <UAIValidator className="fr-ml-3v" organisme={organisme} />
          </Field>
          <Field label={"Natures"} value={<Natures organisme={organisme} />} />
          <Field label={"SIREN"} value={organisme.siret.substr(0, 9)} />
          <Field label={"SIRET"} className={"fr-mr-1w xfr-display-inline-block"} value={organisme.siret} />
          <Field
            className={"xfr-display-inline-block"}
            value={organisme.etat_administratif === "actif" ? "en activité" : "fermé"}
          />
          <Field label={"NDA"} value={organisme.numero_declaration_activite} />
          <Field label={"Certifié Qualiopi"} value={organisme.qualiopi ? "Oui" : "Non"} />
        </Col>
      </GridRow>
      <GridRow className={"fr-mt-5w"}>
        <Col>
          <Field label={"Enseigne"} value={organisme.enseigne} />
          <Field label={"Raison sociale"} value={organisme.raison_sociale} />
          <Field label={"Adresse"} value={adresse} />
          <Field label={"Région"} value={organisme.adresse?.region?.nom} />
          <Field label={"Académie"} value={organisme.adresse?.academie?.nom} />
        </Col>
      </GridRow>
    </>
  );
}
