import { Col, GridRow } from "../../../common/components/dsfr/fondamentaux";
import SearchBar from "../../../common/components/dsfr/elements/SearchBar";
import styled from "styled-components";

const SearchGridRow = styled(GridRow)`
  padding-bottom: 1.5rem;
  margin-bottom: 2rem;
  box-shadow: inset 0 1px 0 0 var(--border-default-grey), 0 1px 0 0 var(--border-default-grey);
`;

export default function SearchForm({ search }) {
  async function onChange(e) {
    search({ page: 1, text: e.target.value });
  }

  return (
    <SearchGridRow>
      <Col>
        <SearchBar
          name="text"
          modifiers={"lg"}
          label={"Rechercher"}
          placeholder={"Rechercher une raison sociale, une UAI, un SIRET."}
          className={"fr-ml-1v"}
          onChange={onChange}
        />
      </Col>
    </SearchGridRow>
  );
}
