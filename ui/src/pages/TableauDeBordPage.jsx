import { Col, GridRow } from "../common/dsfr/fondamentaux";
import React, { useContext } from "react";
import ValidationCard from "./validation/fragments/ValidationCard";
import DepartementAuthSelector from "./validation/fragments/DepartementAuthSelector";
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
            <ValidationCard type={"A_VALIDER"} label={"OF-CFA à vérifier"} />
          </Col>
          <Col modifiers={"12 sm-4"}>
            <ValidationCard type={"A_RENSEIGNER"} label={"OF-CFA à identifier"} />
          </Col>
          <Col modifiers={"12 sm-4"}>
            <ValidationCard type={"VALIDE"} label={"OF-CFA validés"} />
          </Col>
        </GridRow>
      </LayoutContent>
    </>
  );
}
