import { Col, Container, GridRow } from "../../common/components/dsfr/fondamentaux";
import React from "react";
import ValidationStatus from "./fragments/ValidationStatus";
import DepartementAuthSelector from "./fragments/DepartementAuthSelector";
import useNavigation from "../../common/hooks/useNavigation";
import { useFetch } from "../../common/hooks/useFetch";
import Spinner from "../../common/components/Spinner";
import { useAuth } from "../../common/hooks/useAuth";
import { useFilAriane } from "../../common/components/FilAriane";

export default function TableauDeBord() {
  let [auth] = useAuth();
  let { params, buildUrl, navigate } = useNavigation();
  useFilAriane([{ label: "Accueil", to: "/" }]);
  let [{ data, loading, error }] = useFetch(buildUrl("/api/v1/validation", params), {
    validation: {},
    total: 0,
  });

  return (
    <Container>
      <GridRow className={"fr-pb-1w"}>
        <Col modifiers={"12 sm-8"}>
          <h2>
            {auth.type === "region" ? "Région" : "Académie"} : {auth.nom}
          </h2>
        </Col>
        <Col modifiers={"12 sm-4"}>
          <DepartementAuthSelector onChange={(code) => navigate({ departements: code })} />
        </Col>
      </GridRow>
      <GridRow>
        <Spinner loading={loading} error={error} />
      </GridRow>
      <GridRow modifiers={"gutters"} className={"fr-pb-3w"}>
        <Col modifiers={"12 sm-4"}>
          <ValidationStatus
            validationStatus={"A_VALIDER"}
            label={"UAI à valider"}
            nbElements={data.validation["A_VALIDER"]}
          />
        </Col>
        <Col modifiers={"12 sm-4"}>
          <ValidationStatus
            validationStatus={"INCONNUE"}
            label={"UAI inconnues"}
            nbElements={data.validation["INCONNUE"]}
          />
        </Col>
        <Col modifiers={"12 sm-4"}>
          <ValidationStatus
            validationStatus={"VALIDEE"}
            label={"UAI validées"}
            nbElements={data.validation["VALIDEE"]}
          />
        </Col>
      </GridRow>
    </Container>
  );
}
