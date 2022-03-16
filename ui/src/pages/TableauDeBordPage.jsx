import { Col, GridRow } from "../common/dsfr/fondamentaux";
import React, { useContext } from "react";
import ValidationCard from "../organismes/validation/ValidationCard";
import DepartementAuthSelector from "../organismes/selectors/DepartementAuthSelector";
import TitleLayout from "../common/layout/TitleLayout";
import ContentLayout from "../common/layout/ContentLayout";
import { useQuery } from "../common/hooks/useQuery";
import { ApiContext } from "../common/ApiProvider";
import NouveauxCounter from "../organismes/validation/NouveauxCounter";
import EntrantsSortant from "../stats/EntrantsSortants";

export default function TableauDeBordPage() {
  let { auth } = useContext(ApiContext);
  let { query, setQuery } = useQuery();
  let title = `${auth.type === "region" ? "Région" : "Académie"} : ${auth.nom}`;

  return (
    <>
      <TitleLayout
        title={title}
        selector={
          <DepartementAuthSelector
            departement={query.departement}
            onChange={(code) => setQuery({ ...query, departements: code })}
          />
        }
      />
      <ContentLayout>
        <GridRow modifiers={"gutters"} className={"fr-mb-3w"}>
          <Col modifiers={"12 sm-4"}>
            <ValidationCard type={"A_VALIDER"} label={"Organismes à vérifier"}>
              <NouveauxCounter type={"A_VALIDER"} />
            </ValidationCard>
          </Col>
          <Col modifiers={"12 sm-4"}>
            <ValidationCard type={"A_RENSEIGNER"} label={"Organismes à identifier"} />
          </Col>
          <Col modifiers={"12 sm-4"}>
            <ValidationCard type={"VALIDE"} label={"Organismes validés"} />
          </Col>
        </GridRow>
        <GridRow modifiers={"gutters"} className={"fr-mb-3w"}>
          <Col modifiers={"12"}>
            <EntrantsSortant />
          </Col>
        </GridRow>
        <GridRow modifiers={"gutters"} className={"fr-pb-3w"}>
          <Col modifiers={"12"}>
            <div className={"fr-text--bold"}>Les organismes affichés dans ces listes :</div>
            <ul>
              <li>sont identifiés par un SIRET en activité ;</li>
              <li>
                sont trouvés dans la Liste publique des Organisme de Formation avec une certification Qualiopi valide
              </li>
              <li>ont eu un lien avec des formations en apprentissage à un moment donné ;</li>
              <li>ont la nature "responsable" uniquement ou "responsable et formateur"</li>
            </ul>
          </Col>
        </GridRow>
      </ContentLayout>
    </>
  );
}
