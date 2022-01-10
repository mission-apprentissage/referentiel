import OrganismeList from "../organismes/fragments/OrganismeList";
import DepartementAuthSelector from "./fragments/DepartementAuthSelector";
import SearchForm from "../organismes/fragments/SearchForm";
import { useSearch } from "../../common/hooks/useSearch";
import { useParams } from "react-router-dom";
import LayoutTitle from "../../common/layout/LayoutTitle";
import useNavigation from "../../common/hooks/useNavigation";
import Results from "../../common/layout/Results";
import { useContext } from "react";
import { AuthContext } from "../../common/AuthRoutes";
import LayoutContent from "../../common/layout/LayoutContent";
import styled from "styled-components";

export function ValidationTitle() {
  let { validationStatus: type } = useParams();
  let validationTitleMapper = {
    A_VALIDER: "OF-CFA à valider",
    A_RENSEIGNER: "OF-CFA à identifier",
    VALIDE: "OF-CFA validés",
  };

  return <span>{validationTitleMapper[type]}</span>;
}

const ValidationLayoutTitle = styled(({ children, className, ...props }) => {
  return (
    <div className={className}>
      <LayoutTitle {...props}>{children}</LayoutTitle>
    </div>
  );
})`
  background: ${(props) => `var(--color-validation-background-${props.type})`};
`;

export default function ValidationPage() {
  let { params } = useNavigation();
  let { validationStatus } = useParams();
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
      <ValidationLayoutTitle
        type={validationStatus}
        title={<ValidationTitle />}
        selector={<DepartementAuthSelector onChange={(code) => search({ ...params, departements: code })} />}
      />
      <LayoutContent>
        <Results
          search={<SearchForm onSubmit={(values) => search({ ...params, ...values, page: 1 })} />}
          results={<OrganismeList results={results} />}
        />
      </LayoutContent>
    </>
  );
}
