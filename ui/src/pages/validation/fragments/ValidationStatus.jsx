import { Link } from "../../../common/components/dsfr/elements/Link";
import { Box } from "../../../common/components/Flexbox";
import styled from "styled-components";
import { classNames } from "../../../common/components/dsfr/common/utils";
import useNavigation from "../../../common/hooks/useNavigation";
import { useAuth } from "../../../common/hooks/useAuth";

function buildValidationParams(validationStatus, auth) {
  let restricted = { [auth.type]: auth.code };
  switch (validationStatus) {
    case "A_VALIDER":
      return { uai: false, potentiel: true, ...restricted };
    case "VALIDEE":
      return { uai: true, ...restricted };
    case "INCONNUE":
      return { uai: false, potentiel: false, ...restricted };
    default:
      throw new Error("Statut de validation inconnu");
  }
}

function ValidationStatus({ validationStatus, label, nbElements, className, ...rest }) {
  let [auth] = useAuth();
  let { params, buildUrl } = useNavigation();
  let clazz = classNames("validation-status", { modifiers: validationStatus, className });
  let listeUrl = buildUrl(`/validation/${validationStatus}`, {
    ...params,
    ...buildValidationParams(validationStatus, auth),
  });

  return (
    <Box direction={"column"} justify={"between"} className={clazz} {...rest}>
      <div>
        <h4>{nbElements}</h4>
        <div>{label}</div>
      </div>
      <Link to={listeUrl} modifiers={"icon-right"} icons="arrow-right-line">
        Voir la liste
      </Link>
    </Box>
  );
}

export default styled(ValidationStatus)`
  padding: 1.5rem;
  min-height: 240px;
  &.validation-status--A_VALIDER {
    background-color: var(--background-validation-A_VALIDER);
  }

  &.validation-status--INCONNUE {
    background-color: var(--background-validation-INCONNUE);
  }

  &.validation-status--VALIDEE {
    background-color: var(--background-validation-VALIDEE);
  }
`;
