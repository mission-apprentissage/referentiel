import { Col, Container, GridRow } from "../../common/dsfr/fondamentaux";
import OrganismeList from "../organismes/fragments/OrganismeList";
import DepartementAuthSelector from "./fragments/DepartementAuthSelector";
import Filters from "../organismes/fragments/Filters";
import SearchForm from "../organismes/fragments/SearchForm";
import { useSearch } from "../../common/hooks/useSearch";
import Spinner from "../../common/Spinner";
import { useParams } from "react-router-dom";
import { NdaFilter, TypeFilter } from "../organismes/fragments/Filter";
import MainTitle from "../../common/layout/MainTitle";
import useNavigation from "../../common/hooks/useNavigation";

export function ValidationTitle() {
  let { validationStatus } = useParams();
  const validationTitleMapper = {
    A_VALIDER: "Organismes à valider",
    A_RENSEIGNER: "Organismes à renseigner",
    VALIDE: "Organismes validés",
  };

  return <span>{validationTitleMapper[validationStatus]}</span>;
}

export default function Validation() {
  let { params } = useNavigation();
  let [{ data, loading, error }, search] = useSearch({ ordre: "desc", page: 1, items_par_page: 25 });

  return (
    <>
      <MainTitle
        title={<ValidationTitle />}
        selector={<DepartementAuthSelector onChange={(code) => search({ departements: code })} />}
      />
      <Container>
        <GridRow className={"fr-pb-3w"}>
          <Col>
            <SearchForm onSubmit={(form) => search({ ...params, page: 1, text: form.text })} />
            <GridRow>
              <Col modifiers={"3"} className={"fr-pr-5v"}>
                <Filters search={search}>
                  <TypeFilter />
                  <NdaFilter />
                </Filters>
              </Col>
              <Col modifiers={"9"}>
                <Spinner error={error} loading={loading} />
                <OrganismeList organismes={data.organismes} pagination={data.pagination} />
              </Col>
            </GridRow>
          </Col>
        </GridRow>
      </Container>
    </>
  );
}
