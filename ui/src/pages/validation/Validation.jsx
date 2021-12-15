import { Col, Container, GridRow } from "../../common/components/dsfr/fondamentaux";
import OrganismeList from "../organismes/fragments/OrganismeList";
import DepartementAuthSelector from "./fragments/DepartementAuthSelector";
import Filters from "../organismes/fragments/Filters";
import SearchForm from "../organismes/fragments/SearchForm";
import { useSearch } from "../../common/hooks/useSearch";
import { omit } from "lodash-es";
import Spinner from "../../common/components/Spinner";
import { useParams } from "react-router-dom";
import { useFilAriane } from "../../common/components/FilAriane";

let statusMapper = {
  A_VALIDER: "l'UAI est à valider",
  INCONNUES: "l'UAI est inconnue",
  VALIDEES: "l'UAI est validée",
};

export default function Validation() {
  let { validationStatus } = useParams();
  let title = `Liste des organismes dont ${statusMapper[validationStatus]}`;
  useFilAriane(
    [
      { label: "Accueil", to: "/" },
      { label: title, to: "/" },
    ],
    [title]
  );
  let [{ data, loading, error }, search] = useSearch({ ordre: "desc", page: 1, items_par_page: 25 });

  return (
    <Container>
      <GridRow className={"fr-pb-3w"}>
        <Col modifiers={"12 sm-8"}>
          <h2>{title}</h2>
        </Col>
        <Col modifiers={"12 sm-4"}>
          <DepartementAuthSelector onChange={(code) => search({ departements: code })} />
        </Col>
      </GridRow>
      <GridRow className={"fr-pb-3w"}>
        <Col>
          <SearchForm search={search} />
          <GridRow>
            <Col modifiers={"3"} className={"fr-pr-5v"}>
              <Filters search={search} filters={omit(data.filtres, ["departements"])} />
            </Col>
            <Col modifiers={"9"}>
              <Spinner error={error} loading={loading} />
              <OrganismeList etablissements={data.etablissements} pagination={data.pagination} />
            </Col>
          </GridRow>
        </Col>
      </GridRow>
    </Container>
  );
}
