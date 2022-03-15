import { useValidation } from "../../common/hooks/useValidation";
import Nouveau from "../common/Nouveau";

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
      <Nouveau>{response.data.pagination.total} NOUVEAUX ORGANISMES</Nouveau>
    </div>
  );
}
