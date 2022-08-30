import React from "react";
import OrganismeList from "../common/organismes/liste/OrganismeList.jsx";
import DepartementAuthSelector from "../common/organismes/selectors/DepartementAuthSelector.jsx";
import SearchForm from "../common/organismes/liste/SearchForm.jsx";
import { useParams } from "react-router-dom";
import TitleLayout from "../common/layout/TitleLayout.jsx";
import Results from "../common/Results.jsx";
import ContentLayout from "../common/layout/ContentLayout.jsx";
import styled from "styled-components";
import { useValidationSearch } from "../common/hooks/useValidationSearch.js";
import Filters from "../common/organismes/filtres/Filters.jsx";
import NatureFilter from "../common/organismes/filtres/NatureFilter.jsx";
import { getNatureLabel } from "../common/enums/natures.js";
import Small from "../common/dsfr/custom/Small.jsx";
import Page from "../common/Page.jsx";
import { useQuery } from "../common/hooks/useQuery.js";

const MAPPER = {
  A_VALIDER: {
    title: "Organismes à vérifier",
    critères: (
      <ul className={"fr-text--sm fr-pl-3w"}>
        <li>ne possèdent pas d’UAI ;</li>
        <li>possèdent des UAI potentielles collectées dans différentes sources ;</li>
        <li>sont identifiés par un SIRET en activité ;</li>
        <li>sont trouvés dans la Liste publique des Organisme de Formation avec une certification Qualiopi valide</li>
        <li>ont la nature "responsable" uniquement ou "responsable et formateur"</li>
      </ul>
    ),
  },
  A_RENSEIGNER: {
    title: "Organismes à identifier",
    critères: (
      <ul className={"fr-text--sm fr-pl-3w"}>
        <li>ne possèdent pas d’UAI ;</li>
        <li>ne possèdent pas d’UAI potentielles ;</li>
        <li>sont identifiés par un SIRET en activité ;</li>
        <li>sont trouvés dans la Liste publique des Organisme de Formation avec une certification Qualiopi valide</li>
        <li>ont la nature "responsable" uniquement ou "responsable et formateur"</li>
      </ul>
    ),
  },
  VALIDE: {
    title: "Organismes validés",
    critères: (
      <ul className={"fr-text--sm fr-pl-3w"}>
        <li>possèdent une UAI validée ;</li>
        <li>sont identifiés par un SIRET en activité ;</li>
        <li>sont trouvés dans la Liste publique des Organisme de Formation avec une certification Qualiopi valide</li>
        <li>ont la nature "responsable" uniquement ou "responsable et formateur"</li>
      </ul>
    ),
  },
};

export function ValidationTitle() {
  const { type } = useParams();

  return <span>{MAPPER[type].title}</span>;
}

const ValidationLayoutTitle = styled(({ refine, className }) => {
  const { query } = useQuery();
  const { type } = useParams();

  return (
    <div className={className}>
      <TitleLayout
        title={<ValidationTitle />}
        getDetailsMessage={(shown) => (shown ? "masquer les critères" : "afficher les critères")}
        details={
          <div>
            <Small as={"div"} className={"fr-text--bold"}>
              Les organismes affichés dans ces listes :
            </Small>
            {MAPPER[type].critères}
          </div>
        }
        selector={
          <DepartementAuthSelector
            departement={query.departements}
            onChange={(code) => refine({ departements: code })}
          />
        }
      />
    </div>
  );
})`
  background: ${(props) => `var(--color-validation-background-${props.type})`};
`;

export default function ValidationPage() {
  const { type } = useParams();
  const { query } = useQuery();
  const { response, search, refine } = useValidationSearch(type, {
    ordre: "desc",
    page: 1,
    items_par_page: 25,
  });

  return (
    <Page>
      <ValidationLayoutTitle refine={refine} type={type} />
      <ContentLayout>
        <Results
          search={
            <SearchForm onSubmit={(values) => search({ ...values, page: 1, departements: query.departements })} />
          }
          filters={
            <Filters onChange={(filters) => refine({ ...filters })}>
              <NatureFilter
                items={[
                  {
                    label: getNatureLabel("responsable_formateur"),
                    paramName: "natures",
                    value: "responsable_formateur",
                  },
                  { label: getNatureLabel("responsable"), paramName: "natures", value: "responsable" },
                ]}
              />
            </Filters>
          }
          results={<OrganismeList response={response} />}
        />
      </ContentLayout>
    </Page>
  );
}
