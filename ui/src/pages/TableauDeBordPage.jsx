import { Col, GridRow } from "../common/dsfr/fondamentaux";
import React, { useContext } from "react";
import TableauDeBordCard from "./components/TableauDeBordCard";
import DepartementAuthSelector from "../organismes/selectors/DepartementAuthSelector";
import useNavigation from "../common/hooks/useNavigation";
import LayoutTitle from "../common/layout/LayoutTitle";
import { AuthContext } from "../common/AuthRoutes";
import LayoutContent from "../common/layout/LayoutContent";

export default function TableauDeBordPage() {
  let [auth] = useContext(AuthContext);
  let title = `${auth.type === "region" ? "Région" : "Académie"} : ${auth.nom}`;
  let { navigate } = useNavigation();

  return (
    <>
      <LayoutTitle
        title={title}
        selector={<DepartementAuthSelector onChange={(code) => navigate({ departements: code })} />}
      />
      <LayoutContent>
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
      </LayoutContent>
    </>
  );
}
