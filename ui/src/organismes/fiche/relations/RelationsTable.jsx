import useToggle from "../../../common/hooks/useToggle";
import { asSiren } from "../../../common/utils";
import { Box } from "../../../common/Flexbox";
import Fieldset from "../../../common/dsfr/elements/Fieldset";
import Checkbox from "../../../common/dsfr/elements/Checkbox";
import { Table, Thead } from "../../../common/dsfr/elements/Table";
import React, { useState } from "react";
import NA from "../../common/NA";
import { Tag } from "../../../common/dsfr/elements/Tag";
import Natures from "../../common/Natures";
import Siret from "../../common/Siret";
import LinkButton from "../../../common/dsfr/custom/LinkButton";
import { useModal } from "../../../common/dsfr/common/useModal";
import OrganismeModal from "./OrganismeModal";
import RaisonSociale from "../../common/RaisonSociale";

function OrganismeRow({ organisme, show }) {
  return (
    <tr>
      <td colSpan="2">
        <RaisonSociale organisme={organisme} />
      </td>
      <td>
        <span>{organisme.uai || <NA />}</span>
      </td>
      <td>
        <Tag modifiers="sm">{<Natures organisme={organisme} />}</Tag>
      </td>
      <td>
        <LinkButton onClick={show}>
          <Siret organisme={organisme} />
        </LinkButton>
      </td>
    </tr>
  );
}

function RelationRow({ relation }) {
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
  let [sirenFilter, toggleSirenFilter] = useToggle(false);
  let [fermésFilter, toggleFermésFilter] = useToggle(false);
  let siren = asSiren(organisme.siret);
  let presents = results.filter((item) => item.organisme);
  let absents = results.filter((item) => !item.organisme);
  let memeEntreprise = presents.filter((i) => asSiren(i.organisme.siret) === siren);
  let [selectedOrganisme, setSelectedOrganisme] = useState(null);
  let modal = useModal();
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
          <Table
            modifiers={"bordered layout-fixed"}
            thead={
              <Thead>
                <td colSpan="2">Raison sociale</td>
                <td>UAI</td>
                <td>Natures</td>
                <td>SIRET</td>
              </Thead>
            }
          >
            {presents
              .map((item) => item.organisme)
              .filter((o) => (sirenFilter ? siren === asSiren(o.siret) : true))
              .filter((o) => (fermésFilter ? true : o.etat_administratif === "actif"))
              .map((o, index) => {
                return <OrganismeRow key={index} organisme={o} show={() => showOrganisme(o)} />;
              })}
          </Table>
        </>
      )}
      {absents.length > 0 && (
        <>
          <div>Les 2 organismes suivants sont absents du référentiel national</div>
          <Table
            modifiers={"bordered layout-fixed"}
            thead={
              <Thead>
                <td colSpan="2">Raison sociale</td>
                <td>UAI</td>
                <td>Natures</td>
                <td>SIRET</td>
              </Thead>
            }
          >
            {absents.map((result, index) => {
              return <RelationRow key={index} relation={result.relation} />;
            })}
          </Table>
        </>
      )}
      {<OrganismeModal modal={modal} organisme={selectedOrganisme} />}
    </>
  );
}
