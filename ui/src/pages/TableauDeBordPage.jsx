import { Col, GridRow } from "../common/dsfr/fondamentaux";
import React, { useContext } from "react";
import ValidationCard from "../organismes/validation/ValidationCard";
import DepartementAuthSelector from "../organismes/selectors/DepartementAuthSelector";
import TitleLayout from "../common/layout/TitleLayout";
import ContentLayout from "../common/layout/ContentLayout";
import { useQuery } from "../common/hooks/useQuery";
import { ApiContext } from "../common/ApiProvider";
import NouveauxCounter from "../organismes/validation/NouveauxCounter";
import TableauDeBordStats from "../stats/tableauDeBord/TableauDeBordStats";
import useToggle from "../common/hooks/useToggle";
import LinkButton from "../common/dsfr/custom/LinkButton";
import styled from "styled-components";
import Page from "../common/Page";
import Highlight from "../common/dsfr/elements/Highlight";

const Presentation = styled(({ className }) => {
  const [showDetails, toggleDetails] = useToggle(false);

  return (
    <div className={className}>
      <Highlight>
        Ce tableau de bord permet de consulter les organismes du référentiel dont les UAI sont à vérifier, à identifier
        ou validées sur le territoire sélectionné. Une fois tous les organismes validés ou expertisés vous pouvez
        adresser un mail à referentiel@apprentissage.beta.gouv.fr pour nous informer de la fin de vos travaux.
      </Highlight>

      <div className={"details fr-mt-2w"}>
        <LinkButton
          className={"fr-mb-2w"}
          modifiers={"sm icon-right"}
          icons={`arrow-${showDetails ? "up" : "down"}-s-line`}
          onClick={() => toggleDetails()}
        >
          Comment sont sélectionnés les organismes à vérifier ou à identifier
        </LinkButton>
        {showDetails && (
          <>
            <div className={"fr-text--bold"}>Les organismes :</div>
            <ul>
              <li>sont identifiés par un SIRET en activité ;</li>
              <li>
                sont trouvés dans la Liste publique des Organisme de Formation avec une certification Qualiopi valide
              </li>
              <li>ont eu un lien avec des formations en apprentissage à un moment donné ;</li>
              <li>ont la nature "responsable" uniquement ou "responsable et formateur"</li>
            </ul>
          </>
        )}
      </div>
    </div>
  );
})`
  .fr-highlight {
    margin-left: 0;
    padding-left: 2rem;
  }
  .details {
    padding-left: 2rem;
  }
`;

export default function TableauDeBordPage() {
  const { auth } = useContext(ApiContext);
  const { query, setQuery } = useQuery();
  const title = `${auth.type === "region" ? "Région" : "Académie"} : ${auth.nom}`;

  return (
    <Page>
      <TitleLayout
        title={title}
        selector={
          <DepartementAuthSelector
            departement={query.departements}
            onChange={(code) => setQuery({ ...query, departements: code })}
          />
        }
      />
      <ContentLayout>
        <GridRow modifiers={"gutters"} className={"fr-pb-3w"}>
          <Col modifiers={"12"}>
            <Presentation />
          </Col>
        </GridRow>
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
            <TableauDeBordStats />
          </Col>
        </GridRow>
      </ContentLayout>
    </Page>
  );
}
