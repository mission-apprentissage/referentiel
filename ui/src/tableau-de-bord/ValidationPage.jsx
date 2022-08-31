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

const getDescription = (type, natures) => {
  const titlePrefix = `Organismes ${natures === "formateur" ? "formateurs" : ""}`;
  const natureDetails =
    natures === "formateur"
      ? 'ont la nature "formateur" uniquement'
      : 'ont la nature "responsable" uniquement ou "responsable et formateur"';

  const mapping = {
    A_VALIDER: {
      title: `${titlePrefix} à vérifier`,
      critères: (
        <ul className={"fr-text--sm fr-pl-3w"}>
          <li>ne possèdent pas d’UAI ;</li>
          <li>possèdent des UAI potentielles collectées dans différentes sources ;</li>
          <li>sont identifiés par un SIRET en activité ;</li>
          <li>sont trouvés dans la Liste publique des Organisme de Formation avec une certification Qualiopi valide</li>
          <li>{natureDetails}</li>
        </ul>
      ),
    },
    A_RENSEIGNER: {
      title: `${titlePrefix} à identifier`,
      critères: (
        <ul className={"fr-text--sm fr-pl-3w"}>
          <li>ne possèdent pas d’UAI ;</li>
          <li>ne possèdent pas d’UAI potentielles ;</li>
          <li>sont identifiés par un SIRET en activité ;</li>
          <li>sont trouvés dans la Liste publique des Organisme de Formation avec une certification Qualiopi valide</li>
          <li>{natureDetails}</li>
        </ul>
      ),
    },
    VALIDE: {
      title: `${titlePrefix} validés`,
      critères: (
        <ul className={"fr-text--sm fr-pl-3w"}>
          <li>possèdent une UAI validée ;</li>
          <li>sont identifiés par un SIRET en activité ;</li>
          <li>sont trouvés dans la Liste publique des Organisme de Formation avec une certification Qualiopi valide</li>
          <li>{natureDetails}</li>
        </ul>
      ),
    },
  };

  return mapping[type];
};

const ValidationTitleLayout = styled(({ type, natures, refine, className }) => {
  const { query } = useQuery();
  const description = getDescription(type, natures);

  return (
    <div className={className}>
      <TitleLayout
        title={<ValidationBreadcrumb />}
        getDetailsMessage={(shown) => (shown ? "masquer les critères" : "afficher les critères")}
        details={
          <div>
            <Small as={"div"} className={"fr-text--bold"}>
              Les organismes affichés dans ces listes :
            </Small>
            {description.critères}
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
  const { query } = useQuery();
  const { criteria } = useParams();
  const [type, natures = "responsable,formateur,responsable_formateur"] = criteria.split("|");
  const { response, search, refine } = useValidationSearch(type, {
    ...(natures ? { natures } : {}),
    ordre: "desc",
    page: 1,
    items_par_page: 25,
  });

  return (
    <Page>
      <ValidationTitleLayout type={type} natures={natures} refine={refine} />
      <ContentLayout>
        <Results
          search={
            <SearchForm onSubmit={(values) => search({ ...values, page: 1, departements: query.departements })} />
          }
          filters={
            <Filters onChange={(filters) => refine({ ...filters })}>
              <NatureFilter
                items={natures?.split(",").map((nature) => {
                  return {
                    paramName: "natures",
                    label: getNatureLabel(nature),
                    value: nature,
                  };
                })}
              />
            </Filters>
          }
          results={<OrganismeList response={response} />}
        />
      </ContentLayout>
    </Page>
  );
}

export function ValidationBreadcrumb() {
  const { criteria } = useParams();
  const [type, natures] = criteria.split("|");
  const description = getDescription(type, natures);

  return <span>{description.title}</span>;
}
