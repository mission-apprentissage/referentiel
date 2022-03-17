import { useValidation } from "../../common/hooks/useValidation";
import Badge from "../../common/dsfr/elements/Badge";

export default function NouveauxCounter({ type }) {
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
    <div style={{ width: "85%" }}>
      <Badge modifiers={"info"}>{response.data.pagination.total} NOUVEAUX ORGANISMES</Badge>
    </div>
  );
}
