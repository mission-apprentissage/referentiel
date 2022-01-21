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
import { buildValidationParams, getValidationTitle } from "./fragments/validation";

export function ValidationTitle() {
  let { type } = useParams();
  return <span>{getValidationTitle(type)}</span>;
}

const ValidationLayoutTitle = styled(({ search, children, className }) => {
  let { params } = useNavigation();

  return (
    <div className={className}>
      <LayoutTitle
        title={<ValidationTitle />}
        selector={<DepartementAuthSelector onChange={(code) => search({ ...params, departements: code })} />}
      >
        {children}
      </LayoutTitle>
    </div>
  );
})`
  background: ${(props) => `var(--color-validation-background-${props.type})`};
`;

export default function ValidationPage() {
  let { params } = useNavigation();
  let { type } = useParams();
  let [auth] = useContext(AuthContext);
  let [response, search] = useSearch({
    [`${auth.type}s`]: auth.code,
    ordre: "desc",
    page: 1,
    items_par_page: 25,
    ...buildValidationParams(type),
  });

  return (
    <>
      <ValidationLayoutTitle search={search} type={type} />
      <LayoutContent>
        <Results
          search={<SearchForm onSubmit={(values) => search({ ...params, ...values, page: 1 })} />}
          results={<OrganismeList response={response} />}
        />
      </LayoutContent>
    </>
  );
}
