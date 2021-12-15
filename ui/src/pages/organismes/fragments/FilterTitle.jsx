import { Tag } from "../../../common/components/dsfr/elements/Tag";
import styled from "styled-components";

const FilterTitle = styled(({ label, nbCheckedElements, ...rest }) => {
  return (
    <div {...rest}>
      <span>{label}</span>
      {nbCheckedElements > 0 && <Tag>{nbCheckedElements}</Tag>}
    </div>
  );
})`
  .fr-tag {
    margin-left: 0.5rem;
    color: var(--text-inverted-grey);
    background-color: var(--text-action-high-blue-france);
  }
`;

export default FilterTitle;
