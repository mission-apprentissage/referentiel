import React from "react";
import { Col, GridRow } from "../../../common/dsfr/fondamentaux";
import { Table, Thead } from "../../../common/dsfr/elements/Table";
import { Link } from "../../../common/dsfr/elements/Link";

export function Relations({ organisme }) {
  return (
    <>
      <h6>Relations</h6>
      <GridRow>
        <Col>
          <Table
            modifiers={"bordered layout-fixed"}
            thead={
              <Thead>
                <td>Nom</td>
                <td>SIRET</td>
                <td>entreprise</td>
                <td>Type de relation</td>
              </Thead>
            }
          >
            {organisme.relations.map((relation, index) => {
              return (
                <tr key={index}>
                  <td>{relation.label}</td>
                  <td>
                    {relation.referentiel ? (
                      <Link to={`/organismes/${relation.siret}`}>{relation.siret}</Link>
                    ) : (
                      relation.siret
                    )}
                  </td>
                  <td>{organisme.siret.substr(0, 9) === relation?.siret.substr(0, 9) ? "Oui" : "Non"}</td>
                  <td>{relation.type}</td>
                </tr>
              );
            })}
          </Table>
        </Col>
      </GridRow>
    </>
  );
}
