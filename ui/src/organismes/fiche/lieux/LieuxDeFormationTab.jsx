import React from "react";
import { Col, GridRow } from "../../../common/dsfr/fondamentaux/index.js";
import LieuxDeFormationMap from "./LieuxDeFormationMap.jsx";
import { Table, Thead } from "../../../common/dsfr/elements/Table.jsx";
import NA from "../../../common/organismes/NA.jsx";

export default function LieuxDeFormationTab({ organisme }) {
  const lieuxDeFormationFiables = organisme.lieux_de_formation.filter((item) => item.uai_fiable);
  const nbLieux = lieuxDeFormationFiables.length;

  return (
    <>
      <h4>
        {nbLieux === 1
          ? `${nbLieux} lieu de formation est rattaché à cet organisme`
          : `${nbLieux} lieux de formation sont rattachés à cet organisme`}{" "}
      </h4>
      <GridRow>
        <Col modifiers={"12"}>
          <LieuxDeFormationMap organisme={organisme} />
        </Col>
      </GridRow>
      <GridRow className={"fr-mt-6w"}>
        <Col modifiers={"12"}>
          <h6>Liste des lieux</h6>
          <Table
            modifiers={"layout-fixed"}
            thead={
              <Thead>
                <td>UAI</td>
                <td>Adresse</td>
              </Thead>
            }
          >
            {lieuxDeFormationFiables.map((lieu) => {
              return (
                <tr key={lieu.code}>
                  <td>{lieu.uai ? lieu.uai : <NA />}</td>
                  <td>{lieu.adresse.label}</td>
                </tr>
              );
            })}
          </Table>
        </Col>
      </GridRow>
    </>
  );
}
