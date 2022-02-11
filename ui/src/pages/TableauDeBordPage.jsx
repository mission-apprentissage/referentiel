import { Col, GridRow } from "../common/dsfr/fondamentaux";
import React, { useContext } from "react";
import TableauDeBordCard from "./components/TableauDeBordCard";
import DepartementAuthSelector from "../organismes/selectors/DepartementAuthSelector";
import TitleLayout from "../common/layout/TitleLayout";
import { AuthContext } from "../common/AuthRoutes";
import ContentLayout from "../common/layout/ContentLayout";
import { useQuery } from "../common/hooks/useQuery";

export default function TableauDeBordPage() {
  let [auth] = useContext(AuthContext);
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
        <GridRow modifiers={"gutters"} className={"fr-pb-3w"}>
          <Col modifiers={"12 sm-4"}>
            <TableauDeBordCard type={"A_VALIDER"} label={"Organismes à vérifier"} />
          </Col>
          <Col modifiers={"12 sm-4"}>
            <TableauDeBordCard type={"A_RENSEIGNER"} label={"Organismes à identifier"} />
          </Col>
          <Col modifiers={"12 sm-4"}>
            <TableauDeBordCard type={"VALIDE"} label={"Organismes validés"} />
          </Col>
        </GridRow>
      </ContentLayout>
    </>
  );
}
