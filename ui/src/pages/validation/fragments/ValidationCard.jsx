import { Link } from "../../../common/dsfr/elements/Link";
import { Box } from "../../../common/Flexbox";
import styled from "styled-components";
import { classNames } from "../../../common/dsfr/common/utils";
import useNavigation from "../../../common/navigation/useNavigation";
import { useAuthContext } from "../../../common/auth/useAuthContext";

function buildValidationParams(type, auth) {
  let restricted = { [auth.type]: auth.code };
  switch (type) {
    case "A_VALIDER":
      return { uai: false, uai_potentiel: true, ...restricted };
    case "VALIDE":
      return { uai: true, ...restricted };
    case "A_RENSEIGNER":
      return { uai: false, uai_potentiel: false, ...restricted };
    default:
      throw new Error("Statut de validation inconnu");
  }
}

function ValidationCard({ type, label, nbElements, className, ...rest }) {
  let [auth] = useAuthContext();
  let { params, buildUrl } = useNavigation();
  let clazz = classNames("validation-status", { modifiers: type, className });
  let listeUrl = buildUrl(`/validation/${type}`, {
    ...params,
    ...buildValidationParams(type, auth),
  });

  return (
    <Box direction={"column"} justify={"between"} className={clazz} {...rest}>
      <div>
        <h4>{nbElements || 0}</h4>
        <div>{label}</div>
      </div>
      <Link to={listeUrl} modifiers={"icon-right"} icons="arrow-right-line">
        Voir la liste
      </Link>
    </Box>
  );
}

export default styled(ValidationCard)`
  padding: 1.5rem;
  min-height: 240px;
  &.validation-status--A_VALIDER {
    background-color: var(--background-validation-A_VALIDER);
  }

  &.validation-status--A_RENSEIGNER {
    background-color: var(--background-validation-A_RENSEIGNER);
  }

  &.validation-status--VALIDE {
    background-color: var(--background-validation-VALIDE);
  }
`;
