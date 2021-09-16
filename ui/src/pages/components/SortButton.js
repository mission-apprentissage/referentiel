import React, { useState } from "react";
import { Button } from "tabler-react";

import styled from "styled-components";

const SortButton = styled(Button)`
  background-color: #ffffff;
  padding: 0;
  &:focus,
  &:active {
    box-shadow: none;
  }
`;

export default ({ onClick }) => {
  const [order, setOrder] = useState("desc");

  function toggleOrder() {
    let newValue = order === "asc" ? "desc" : "asc";
    setOrder(newValue);
    onClick(newValue);
  }

  return (
    <SortButton onClick={toggleOrder} size="sm">
      {order === "asc" ? "\u25B2" : "\u25BC"}
    </SortButton>
  );
};
