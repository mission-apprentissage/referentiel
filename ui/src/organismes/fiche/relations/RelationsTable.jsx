import useToggle from "../../../common/hooks/useToggle";
import { asSiren } from "../../../common/utils";
import { Box } from "../../../common/Flexbox";
import Fieldset from "../../../common/dsfr/elements/Fieldset";
import Checkbox from "../../../common/dsfr/elements/Checkbox";
import { Thead } from "../../../common/dsfr/elements/Table";
import React, { useState } from "react";
import NA from "../../common/NA";
import { Tag } from "../../../common/dsfr/elements/Tag";
import Nature from "../../common/Nature";
import Siret from "../../common/Siret";
import { useModal } from "../../../common/dsfr/common/useModal";
import RelationModal from "./RelationModal";
import RaisonSociale from "../../common/RaisonSociale";
import { Button } from "../../../common/dsfr/elements/Button";
import Adresse from "../../common/Adresse";
import CustomTable from "../../../common/dsfr/custom/CustomTable";

function RelationRow({ organisme, show }) {
  return (
    <tr>
      <td onClick={show} colSpan="2">
        <Box direction={"column"}>
          <RaisonSociale className={"fr-text--bold"} organisme={organisme} />
          <Adresse organisme={organisme} />
        </Box>
      </td>
      <td onClick={show}>
        <Tag modifiers="sm">{<Nature organisme={organisme} />}</Tag>
      </td>
      <td onClick={show}>
        <span>{organisme.uai || <NA />}</span>
      </td>
      <td onClick={show} colSpan="2">
        <Siret organisme={organisme} />
      </td>
      <td style={{ textAlign: "right" }}>
        <Button onClick={show} modifiers={"icon secondary"} icons={"eye-fill"} title="Label bouton">
          Label bouton
        </Button>
      </td>
    </tr>
  );
}

function AbsentRow({ relation }) {
  return (
    <tr>
      <td colSpan="2">{relation.label}</td>
      <td>
        <NA />
      </td>
      <td>
        <NA />
      </td>
      <td>
        <Siret organisme={{ siret: relation.siret }} />
      </td>
    </tr>
  );
}

export function RelationsTable({ label, organisme, results }) {
  const [sirenFilter, toggleSirenFilter] = useToggle(false);
  const [fermésFilter, toggleFermésFilter] = useToggle(false);
  const siren = asSiren(organisme.siret);
  const presents = results.filter((item) => item.organisme);
  const absents = results.filter((item) => !item.organisme);
  const memeEntreprise = presents.filter((i) => asSiren(i.organisme.siret) === siren);
  const [selectedOrganisme, setSelectedOrganisme] = useState(null);
  const modal = useModal();
  function showOrganisme(organisme) {
    setSelectedOrganisme(organisme);
    modal.open();
  }

  if (results.length === 0) {
    return <></>;
  }

  return (
    <>
      <h5>{label} :</h5>
      {presents.length > 0 && (
        <>
          <Box align={"start"}>
            <span className={"fr-pt-2w fr-mr-2w"}>Filtres :</span>
            <Fieldset modifiers={"inline"}>
              <Checkbox
                label={"organismes faisant partie de la même entreprise"}
                disabled={memeEntreprise.length === presents.length || memeEntreprise.length === 0}
                checked={sirenFilter}
                onChange={() => toggleSirenFilter()}
              />
              <Checkbox
                label={"afficher les sirets fermés"}
                disabled={presents.filter((i) => i.organisme.etat_administratif === "fermé").length === 0}
                checked={fermésFilter}
                onChange={() => toggleFermésFilter()}
              />
            </Fieldset>
          </Box>
          <CustomTable
            modifiers={"bordered layout-fixed"}
            thead={
              <Thead>
                <th colSpan="2">Raison sociale</th>
                <th>Nature</th>
                <th>UAI</th>
                <th colSpan="2">SIRET</th>
                <th />
              </Thead>
            }
          >
            {presents
              .map((item) => item.organisme)
              .filter((o) => (sirenFilter ? siren === asSiren(o.siret) : true))
              .filter((o) => (fermésFilter ? true : o.etat_administratif === "actif"))
              .map((o, index) => {
                return <RelationRow key={index} organisme={o} show={() => showOrganisme(o)} />;
              })}
          </CustomTable>
        </>
      )}
      {absents.length > 0 && (
        <>
          <div>Les 2 organismes suivants sont absents du référentiel national</div>
          <CustomTable
            modifiers={"bordered layout-fixed"}
            thead={
              <Thead>
                <td colSpan="2">Raison sociale</td>
                <td>UAI</td>
                <td>Nature</td>
                <td>SIRET</td>
              </Thead>
            }
          >
            {absents.map((result, index) => {
              return <AbsentRow key={index} relation={result.relation} />;
            })}
          </CustomTable>
        </>
      )}
      {<RelationModal modal={modal} organisme={selectedOrganisme} />}
    </>
  );
}
