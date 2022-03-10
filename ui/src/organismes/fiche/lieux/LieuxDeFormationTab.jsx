import React from "react";
import { Box } from "../../../common/Flexbox";
import { Col, GridRow } from "../../../common/dsfr/fondamentaux";
import LieuxDeFormationMap from "./LieuxDeFormationMap";

export default function LieuxDeFormationTab({ organisme }) {
  let nbLieux = organisme.lieux_de_formation.length;

  return (
    <>
      <Box justify={"between"}>
        <h6>
          {nbLieux === 1
            ? `${nbLieux} lieu de formation est rattaché à cet organisme`
            : `${nbLieux} lieux de formation sont rattachés à cet organisme`}{" "}
        </h6>
      </Box>
      <GridRow>
        <Col modifiers={"12"}>
          <LieuxDeFormationMap organisme={organisme} />
        </Col>
      </GridRow>
    </>
  );
}
