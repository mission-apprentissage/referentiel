import { Col, Container, GridRow } from "../../common/dsfr/fondamentaux";
import React from "react";
import ValidationCard from "./fragments/ValidationCard";
import DepartementAuthSelector from "./fragments/DepartementAuthSelector";
import useNavigation from "../../common/navigation/useNavigation";
import { useFetch } from "../../common/http/useFetch";
import Spinner from "../../common/Spinner";
import { useAuthContext } from "../../common/auth/useAuthContext";
import useFilAriane from "../../common/ariane/useFilAriane";

export default function TableauDeBord() {
  let [auth] = useAuthContext();
  let { params, buildUrl, navigate } = useNavigation();
  useFilAriane([{ label: "Accueil", to: "/" }]);
  let [{ data, loading, error }] = useFetch(buildUrl("/api/v1/validation", params), {
    validation: {},
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
          <ValidationCard type={"A_VALIDER"} label={"UAI à valider"} nbElements={data.validation["A_VALIDER"]} />
        </Col>
        <Col modifiers={"12 sm-4"}>
          <ValidationCard type={"INCONNUE"} label={"UAI inconnues"} nbElements={data.validation["INCONNUE"]} />
        </Col>
        <Col modifiers={"12 sm-4"}>
          <ValidationCard type={"VALIDEE"} label={"UAI validées"} nbElements={data.validation["VALIDEE"]} />
        </Col>
      </GridRow>
    </Container>
  );
}
