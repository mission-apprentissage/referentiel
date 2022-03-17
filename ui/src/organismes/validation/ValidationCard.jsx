import { Link } from "../../common/dsfr/elements/Link";
import { Box } from "../../common/Flexbox";
import styled from "styled-components";
import ClickableItem from "../../common/ClickableItem";
import { without } from "../../common/utils";
import Spinner from "../../common/Spinner";
import { useValidation } from "../../common/hooks/useValidation";

const StyledBox = styled(without(Box, ["type"]))`
  padding: 1.5rem;
  min-height: 240px;

  background-color: ${(props) => `var(--color-validation-background-${props.type})`};
  &:hover {
    background-color: ${(props) => `var(--color-validation-background-hover-${props.type})`};
  }
`;

const Counter = styled(({ response, className }) => {
  let { data, loading, error } = response;
  if (loading || error) {
    return <Spinner loading={loading} error={error} />;
  }

  return <div className={className}>{data.pagination.total || 0}</div>;
})`
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
`;

export default function ValidationCard({ type, label, children, ...rest }) {
  let { response } = useValidation(type, {
    page: 1,
    items_par_page: 1,
    champs: "siret",
  });

  return (
    <ClickableItem to={`/tableau-de-bord/validation/${type}`}>
      <StyledBox direction={"column"} justify={"between"} type={type} {...rest}>
        <div>
          <Counter response={response} />
          <div className={"fr-text--bold"}>{label}</div>
        </div>
        {children}
        <Link as="span" modifiers={"icon-right"} icons="arrow-right-line">
          Voir la liste
        </Link>
      </StyledBox>
    </ClickableItem>
  );
}
