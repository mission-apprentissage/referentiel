import { Box } from "../../../common/Flexbox";
import React from "react";
import Reseaux from "./Reseaux";

export function Presentation({ organisme }) {
  return (
    <>
      <h1>{organisme.raison_sociale}</h1>
      <Box>
        <Reseaux organisme={organisme} />
      </Box>
    </>
  );
}
