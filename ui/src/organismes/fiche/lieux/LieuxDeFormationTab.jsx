import React from "react";
import { Col, GridRow } from "../../../common/dsfr/fondamentaux/index.js";
import LieuxDeFormationMap from "./LieuxDeFormationMap.jsx";
import { Table, Thead } from "../../../common/dsfr/elements/Table.jsx";
import NA from "../../../common/organismes/NA.jsx";

export default function LieuxDeFormationTab({ organisme }) {
  const nbLieux = organisme.lieux_de_formation.length;

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
            {organisme.lieux_de_formation.map((lieu) => {
              return (
                <tr key={lieu.code}>
                  <td>{lieu.uai_fiable ? lieu.uai || <NA /> : <NA />}</td>
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
