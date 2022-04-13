import React, { useReducer, useState } from "react";
import { useSearch } from "../../../common/hooks/useSearch";
import Spinner from "../../../common/Spinner";
import { TagButton, TagGroup } from "../../../common/dsfr/elements/Tag";
import { Col, GridRow } from "../../../common/dsfr/fondamentaux";
import styled from "styled-components";
import { Box } from "../../../common/Flexbox";
import { RelationsTable } from "./RelationsTable";
import { uniq, without } from "lodash-es";

const RelationTagButton = styled(({ label, results, onChange, disabled = false }) => {
  let [pressed, setPressed] = useState(false);
  let nbElements = results.length;

  return (
    <TagButton
      label={label}
      aria-pressed={pressed}
      disabled={disabled}
      onClick={() => {
        onChange && onChange(!pressed);
        return setPressed(!pressed);
      }}
    >
      {label} ({nbElements})
    </TagButton>
  );
})`
  background-color: var(--background-action-low-blue-france);
`;

export default function RelationsTab({ organisme }) {
  let {
    response: { data, loading, error },
  } = useSearch({
    page: 1,
    sirets: organisme.relations.filter((r) => r.referentiel).map((r) => r.siret),
    items_par_page: Number.MAX_SAFE_INTEGER,
  });

  let [tables, filter] = useReducer((state, action) => {
    if (action.pressed) {
      return uniq([...state, action.name]);
    } else {
      return without(state, action.name);
    }
  }, []);

  function buildResults(type) {
    return organisme.relations
      .filter((r) => r.type === type)
      .map((relation) => {
        return {
          relation,
          organisme: data.organismes.find((o) => o.siret === relation.siret),
        };
      });
  }

  let estResponsableDe = buildResults("responsable->formateur");
  let dispenseDesFormationsPour = buildResults("formateur->responsable");
  let autres = buildResults("entreprise");

  if (loading || error) {
    return <Spinner loading={loading} error={error} />;
  }

  return (
    <>
      <h4>
        <Box>
          <span className={"fr-mr-1w"}>Relations :</span>
          <TagGroup>
            <RelationTagButton
              label={"Responsable"}
              results={estResponsableDe}
              disabled={estResponsableDe.length === 0}
              onChange={(pressed) => filter({ name: "responsable", pressed })}
            />
            <RelationTagButton
              label={"Formateur"}
              results={dispenseDesFormationsPour}
              disabled={dispenseDesFormationsPour.length === 0}
              onChange={(pressed) => filter({ name: "formateur", pressed })}
            />
            <RelationTagButton
              label={"Autres relations"}
              results={autres}
              disabled={autres.length === 0}
              onChange={(pressed) => filter({ name: "autres", pressed })}
            />
          </TagGroup>
        </Box>
      </h4>
      {((tables.length === 0 && estResponsableDe.length > 0) || tables.includes("responsable")) && (
        <GridRow className={"fr-mb-6w"}>
          <Col>
            <RelationsTable
              label={"Cet organisme est responsable des organismes suivants"}
              organisme={organisme}
              results={estResponsableDe}
            />
          </Col>
        </GridRow>
      )}
      {((tables.length === 0 && dispenseDesFormationsPour.length > 0) || tables.includes("formateur")) && (
        <GridRow className={"fr-mb-6w"}>
          <Col>
            <RelationsTable
              label={"Cet organisme dispense des formations pour"}
              organisme={organisme}
              results={dispenseDesFormationsPour}
            />
          </Col>
        </GridRow>
      )}
      {((tables.length === 0 && autres.length > 0) || tables.includes("autres")) && (
        <GridRow className={"fr-mb-6w"}>
          <Col>
            <RelationsTable
              label={"Autres organismes qui font partie de la même entreprise"}
              organisme={organisme}
              results={autres}
            />
          </Col>
        </GridRow>
      )}
    </>
  );
}
