import { useValidation } from "../../common/hooks/useValidation";
import Icon from "../../common/dsfr/custom/Icon";
import styled from "styled-components";
import { Box } from "../../common/Flexbox";

const NouveauxCounter = styled(({ type, className }) => {
  let { response } = useValidation(type, {
    nouveaux: true,
    page: 1,
    items_par_page: 1,
    champs: "siret",
  });

  if (response.loading) {
    return <div />;
  }

  return (
    <Box align={"start"} className={className}>
      <Icon name={"info-fill"} className={"fr-mr-1w"} />
      <span className={"fr-text--bold"}>{response.data.pagination.total} NOUVEAUX ORGANISMES</span>
    </Box>
  );
})`
  padding: 5px;
  width: 80%;
  color: #0063cb;
  background-color: #e8edff;
`;

export default NouveauxCounter;
