import { Link } from "../../../common/dsfr/elements/Link";
import { Box } from "../../../common/Flexbox";
import styled from "styled-components";
import useNavigation from "../../../common/hooks/useNavigation";
import ClickableItem from "../../../common/ClickableItem";
import { without } from "../../../common/utils";

function buildValidationParams(type) {
  switch (type) {
    case "A_VALIDER":
      return { uai: false, uai_potentiel: true };
    case "VALIDE":
      return { uai: true };
    case "A_RENSEIGNER":
      return { uai: false, uai_potentiel: false };
    default:
      throw new Error("Statut de validation inconnu");
  }
}

const StyledBox = styled(without(Box, ["type"]))`
  padding: 1.5rem;
  min-height: 240px;

  background-color: ${(props) => `var(--color-validation-background-${props.type})`};
  &:hover {
    background-color: ${(props) => `var(--color-validation-background-hover-${props.type})`};
  }
`;

export default function ValidationCard({ type, label, nbElements, ...rest }) {
  let { params, buildUrl } = useNavigation();
  let link = buildUrl(`/validation/${type}`, {
    ...params,
    ...buildValidationParams(type),
  });

  return (
    <ClickableItem to={link}>
      <StyledBox direction={"column"} justify={"between"} type={type} {...rest}>
        <div>
          <h4>{nbElements || 0}</h4>
          <div>{label}</div>
        </div>
        <Link as="span" modifiers={"icon-right"} icons="arrow-right-line">
          Voir la liste
        </Link>
      </StyledBox>
    </ClickableItem>
  );
}
