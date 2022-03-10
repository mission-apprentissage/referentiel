import OrganismeList from "../organismes/liste/OrganismeList";
import DepartementAuthSelector from "../organismes/selectors/DepartementAuthSelector";
import SearchForm from "../organismes/liste/SearchForm";
import { useParams } from "react-router-dom";
import TitleLayout from "../common/layout/TitleLayout";
import Results from "../common/Results";
import ContentLayout from "../common/layout/ContentLayout";
import styled from "styled-components";
import { useValidation } from "../common/hooks/useValidation";
import Filters from "../organismes/filtres/Filters";
import NatureFilter from "../organismes/filtres/NatureFilter";
import React from "react";

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
  let { type } = useParams();

  return <span>{MAPPER[type].title}</span>;
}

const ValidationLayoutTitle = styled(({ refine, className }) => {
  let { type } = useParams();

  return (
    <div className={className}>
      <TitleLayout
        title={<ValidationTitle />}
        detailsMessage={"afficher les critères"}
        details={
          <div>
            <div className={"fr-text--sm fr-text--bold fr-mb-1v"}>Les organismes affichés dans ces listes sont :</div>
            {MAPPER[type].critères}
          </div>
        }
        selector={<DepartementAuthSelector onChange={(code) => refine({ departements: code })} />}
      />
    </div>
  );
})`
  background: ${(props) => `var(--color-validation-background-${props.type})`};
`;

export default function ValidationPage() {
  let { type } = useParams();
  let { response, search, refine } = useValidation(type, {
    ordre: "desc",
    page: 1,
    items_par_page: 25,
  });

  return (
    <>
      <ValidationLayoutTitle refine={refine} type={type} />
      <ContentLayout>
        <Results
          search={<SearchForm onSubmit={(values) => search({ ...values, page: 1 })} />}
          filters={
            <Filters onChange={(filters) => refine({ ...filters })}>
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
