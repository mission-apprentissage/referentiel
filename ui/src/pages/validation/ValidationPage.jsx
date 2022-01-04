import OrganismeList from "../organismes/fragments/OrganismeList";
import DepartementAuthSelector from "./fragments/DepartementAuthSelector";
import Filters from "../organismes/fragments/Filters";
import SearchForm from "../organismes/fragments/SearchForm";
import { useSearch } from "../../common/hooks/useSearch";
import { useParams } from "react-router-dom";
import { NdaFilter, TypeFilter } from "../organismes/fragments/Filter";
import PageTitle from "../../common/page/PageTitle";
import useNavigation from "../../common/hooks/useNavigation";
import ResultsPageContent from "../../common/page/ResultsPageContent";

export function ValidationTitle() {
  let { validationStatus } = useParams();
  const validationTitleMapper = {
    A_VALIDER: "Organismes à valider",
    A_RENSEIGNER: "Organismes à renseigner",
    VALIDE: "Organismes validés",
  };

  return <span>{validationTitleMapper[validationStatus]}</span>;
}

export default function ValidationPage() {
  let { params } = useNavigation();
  let [results, search] = useSearch({ ordre: "desc", page: 1, items_par_page: 25 });

  return (
    <>
      <PageTitle
        title={<ValidationTitle />}
        selector={<DepartementAuthSelector onChange={(code) => search({ departements: code })} />}
      />
      <ResultsPageContent
        search={<SearchForm onSubmit={(form) => search({ ...params, page: 1, text: form.text })} />}
        filters={
          <Filters search={search}>
            <TypeFilter />
            <NdaFilter />
          </Filters>
        }
        results={<OrganismeList results={results} />}
      />
    </>
  );
}
