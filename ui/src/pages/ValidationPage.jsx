import OrganismeList from "../organismes/liste/OrganismeList";
import DepartementAuthSelector from "../organismes/selectors/DepartementAuthSelector";
import SearchForm from "../organismes/liste/SearchForm";
import { useParams } from "react-router-dom";
import TitleLayout from "../common/layout/TitleLayout";
import useNavigation from "../common/hooks/useNavigation";
import Results from "../common/layout/Results";
import ContentLayout from "../common/layout/ContentLayout";
import styled from "styled-components";
import useValidationSearch from "../common/hooks/useValidationSearch";
import Filters from "../organismes/filtres/Filters";
import NatureFilter from "../organismes/filtres/NatureFilter";

export function ValidationTitle() {
  let { type } = useParams();
  let mapper = {
    A_VALIDER: "Organismes à vérifier",
    A_RENSEIGNER: "Organismes à identifier",
    VALIDE: "Organismes validés",
  };

  return <span>{mapper[type]}</span>;
}

const ValidationLayoutTitle = styled(({ search, children, className }) => {
  let { params } = useNavigation();

  return (
    <div className={className}>
      <TitleLayout
        title={<ValidationTitle />}
        selector={<DepartementAuthSelector onChange={(code) => search({ ...params, departements: code })} />}
      >
        {children}
      </TitleLayout>
    </div>
  );
})`
  background: ${(props) => `var(--color-validation-background-${props.type})`};
`;

export default function ValidationPage() {
  let { params } = useNavigation();
  let { type } = useParams();
  let [response, search] = useValidationSearch(type, {
    ordre: "desc",
    page: 1,
    items_par_page: 25,
  });

  return (
    <>
      <ValidationLayoutTitle search={search} type={type} />
      <ContentLayout>
        <Results
          search={<SearchForm onSubmit={(values) => search({ ...params, ...values, page: 1 })} />}
          filters={
            <Filters onChange={(filters) => search({ ...filters })}>
              <NatureFilter
                items={[
                  { code: "formateur|responsable", label: "Responsable et formateur" },
                  { code: "-formateur|responsable", label: "Responsable" },
                ]}
              />
            </Filters>
          }
          results={<OrganismeList response={response} />}
        />
      </ContentLayout>
    </>
  );
}
