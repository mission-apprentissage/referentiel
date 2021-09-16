import React from "react";
import { Button } from "tabler-react";
import styled from "styled-components";

const noop = () => ({});

const PaginationPosition = styled.span`
  font-size: 0.75rem;
  padding-right: 0.5rem;
`;

export default ({ pagination, onClick = noop }) => {
  return (
    <Button.List>
      <Button size="sm" onClick={() => onClick(pagination.page - 1)} disabled={pagination.page === 1}>
        &lt; Précédent
      </Button>
      <PaginationPosition>
        {pagination.page} / {pagination.nombre_de_page}
      </PaginationPosition>
      <Button
        size="sm"
        onClick={() => onClick(pagination.page + 1)}
        disabled={pagination.nombre_de_page === pagination.page}
      >
        Suivant &gt;
      </Button>
    </Button.List>
  );
};
