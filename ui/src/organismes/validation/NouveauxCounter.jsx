import { useValidationSearch } from "../../common/hooks/useValidationSearch";
import Badge from "../../common/dsfr/elements/Badge";

export default function NouveauxCounter({ type }) {
  let { response } = useValidationSearch(type, {
    nouveaux: true,
    page: 1,
    items_par_page: 1,
    champs: "siret",
  });

  if (response.loading || response.data.pagination.total === 0) {
    return <div />;
  }

  return (
    <div style={{ width: "85%" }}>
      <Badge modifiers={"info"}>{response.data.pagination.total} NOUVEAUX ORGANISMES</Badge>
    </div>
  );
}
