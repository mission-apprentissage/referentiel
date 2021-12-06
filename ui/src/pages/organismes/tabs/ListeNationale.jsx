import { Col, GridRow } from "../../../common/components/dsfr/fondamentaux";
import { useSearch } from "../useSearch";
import OrganismeResult from "../fragments/OrganismeResult";
import Alert from "../../../common/components/dsfr/elements/Alert";
import ResultsPagination from "../../../common/components/ResultsPagination";
import { Box } from "../../../common/components/Flexbox";
import SearchForm from "../fragments/SearchForm";
import Filters from "../fragments/Filters";

export default function ListeNationale() {
  let [{ data, loading, error }, search] = useSearch({ anomalies: false, ordre: "desc", page: 1, items_par_page: 25 });

  return (
    <>
      <SearchForm search={search} />
      <GridRow>
        <Col modifiers={"3"} className={"fr-pr-5v"}>
          <Filters search={search} filters={data.filtres} />
        </Col>
        <Col modifiers={"9"}>
          <div className={"fr-mb-3v"}>{data.pagination.total} organismes</div>
          {loading && "En cours de chargement..."}
          {error && (
            <Alert modifiers={"error"} title={"Une erreur survenue"}>
              Impossible de réaliser la recherche
            </Alert>
          )}
          {data.etablissements.map((organisme, index) => {
            return <OrganismeResult key={index} organisme={organisme} />;
          })}
          <Box justify={"center"}>
            <ResultsPagination pagination={data.pagination} />
          </Box>
        </Col>
      </GridRow>
    </>
  );
}
