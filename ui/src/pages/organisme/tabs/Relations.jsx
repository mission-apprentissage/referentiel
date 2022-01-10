import React from "react";
import { Col, GridRow } from "../../../common/dsfr/fondamentaux";
import { Table, Thead } from "../../../common/dsfr/elements/Table";

export function Relations({ organisme }) {
  return (
    <>
      <h6>Immatriculation</h6>
      <GridRow>
        <Col>
          <Table
            modifiers={"bordered layout-fixed"}
            thead={
              <Thead>
                <td>col 1</td>
                <td>col 2</td>
              </Thead>
            }
          >
            <tr>
              <td>val 1</td>
              <td>val 2</td>
            </tr>
            <tr>
              <td>val 1</td>
              <td>val 2</td>
            </tr>
          </Table>
        </Col>
      </GridRow>
    </>
  );
}
