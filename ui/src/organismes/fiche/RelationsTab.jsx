import React from "react";
import { useSearch } from "../../common/hooks/useSearch";
import Filters from "../filtres/Filters";
import OrganismeList from "../liste/OrganismeList";
import Results from "../../common/Results";
import NatureFilter from "../filtres/NatureFilter";
import RelationFilter from "../filtres/RelationFilter";
import EtatAdministratifFilter from "../filtres/EtatAdministratifFilter";

export default function RelationsTab({ organisme }) {
  let relations = organisme.relations.filter((r) => r.referentiel);
  let { response, refine } = useSearch({
    page: 1,
    sirets: relations.map((r) => r.siret),
    items_par_page: relations.length,
  });

  return (
    <>
      <h6>Ecosystème de l'organisme</h6>
      <Results
        filters={
          <Filters onChange={(filters) => refine({ ...filters })}>
            <RelationFilter expanded={true} />
            <NatureFilter />
            <EtatAdministratifFilter />
          </Filters>
        }
        results={<OrganismeList response={response} />}
      />
    </>
  );
}
