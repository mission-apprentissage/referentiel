import { Col, GridRow } from "../common/dsfr/fondamentaux/index.js";
import React, { useContext } from "react";
import ValidationCard from "./cards/ValidationCard.jsx";
import DepartementAuthSelector from "../common/organismes/selectors/DepartementAuthSelector.jsx";
import TitleLayout from "../common/layout/TitleLayout.jsx";
import ContentLayout from "../common/layout/ContentLayout.jsx";
import { useQuery } from "../common/hooks/useQuery.js";
import { UserContext } from "../common/UserProvider.jsx";
import NouveauxCounter from "./cards/NouveauxCounter.jsx";
import useToggle from "../common/hooks/useToggle.js";
import LinkButton from "../common/dsfr/custom/LinkButton.jsx";
import styled from "styled-components";
import Page from "../common/Page.jsx";
import Highlight from "../common/dsfr/elements/Highlight.jsx";

const Presentation = styled(({ className }) => {
  const [showDetails, toggleDetails] = useToggle(false);

  return (
    <div className={className}>
      <Highlight>
        Ce tableau de bord permet de consulter les organismes du référentiel dont les UAI sont à vérifier, à identifier
        ou validées sur le territoire sélectionné. Une fois tous les organismes validés ou expertisés vous pouvez
        adresser un mail à referentiel-uai-siret@onisep.fr pour nous informer de la fin de vos travaux.
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
  const [userContext] = useContext(UserContext);

  const { query, setQuery } = useQuery();
  const title = `${userContext.type === "region" ? "Région" : "Académie"} : ${userContext.nom}`;

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
          <Col modifiers={"12 sm-8"}>
            <GridRow modifiers={"gutters"}>
              <Col modifiers={"12 sm-6"}>
                <ValidationCard
                  type={"A_VALIDER"}
                  natures={"responsable,responsable_formateur"}
                  label={"Organismes responsables ou responsables et formateurs à vérifier"}
                >
                  <NouveauxCounter type={"A_VALIDER"} natures={"responsable,responsable_formateur"} />
                </ValidationCard>
              </Col>
              <Col modifiers={"12 sm-6"}>
                <ValidationCard
                  type={"A_RENSEIGNER"}
                  natures={"responsable,responsable_formateur"}
                  label={"Organismes responsables ou responsables et formateurs à identifier"}
                />
              </Col>
              <Col modifiers={"12 sm-6"}>
                <ValidationCard type={"A_VALIDER"} natures={"formateur"} label={"Organismes formateurs à vérifier"}>
                  <NouveauxCounter type={"A_VALIDER"} natures={"formateur"} />
                </ValidationCard>
              </Col>
              <Col modifiers={"12 sm-6"}>
                <ValidationCard
                  type={"A_RENSEIGNER"}
                  natures={"formateur"}
                  label={"Organismes formateurs à identifier"}
                />
              </Col>
            </GridRow>
          </Col>
          <Col modifiers={"12 sm-4"}>
            <ValidationCard
              type={"VALIDE"}
              label={"Organismes validés"}
              natures={"responsable,responsable_formateur,formateur"}
              height={"100%"}
            />
          </Col>
        </GridRow>
      </ContentLayout>
    </Page>
  );
}
