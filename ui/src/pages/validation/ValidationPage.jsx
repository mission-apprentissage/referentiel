import OrganismeList from "../organismes/fragments/OrganismeList";
import DepartementAuthSelector from "./fragments/DepartementAuthSelector";
import SearchForm from "../organismes/fragments/SearchForm";
import { useSearch } from "../../common/hooks/useSearch";
import { useParams } from "react-router-dom";
import PageTitle from "../../common/page/PageTitle";
import useNavigation from "../../common/hooks/useNavigation";
import ResultsPageContent from "../../common/page/ResultsPageContent";
import { useContext } from "react";
import { AuthContext } from "../../common/AuthRoutes";

export function ValidationTitle() {
  let { validationStatus } = useParams();
  const validationTitleMapper = {
    A_VALIDER: "OF-CFA à valider",
    A_RENSEIGNER: "OF-CFA à identifier",
    VALIDE: "OF-CFA validés",
  };

  return <span>{validationTitleMapper[validationStatus]}</span>;
}

export default function ValidationPage() {
  let { params } = useNavigation();
  let [auth] = useContext(AuthContext);
  let [results, search] = useSearch({
    [auth.type]: auth.code,
    ordre: "desc",
    page: 1,
    items_par_page: 25,
    etat_administratif: "actif",
    qualiopi: true,
    types: "of-cfa",
  });

  return (
    <>
      <PageTitle
        title={<ValidationTitle />}
        selector={<DepartementAuthSelector onChange={(code) => search({ ...params, departements: code })} />}
      />
      <ResultsPageContent
        search={<SearchForm onSubmit={(values) => search({ ...params, ...values, page: 1 })} />}
        results={<OrganismeList results={results} />}
      />
    </>
  );
}