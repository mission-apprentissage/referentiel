import React from "react";
import { useFetch } from "../../common/hooks/useFetch";
import Spinner from "../../common/Spinner";
import { Col, GridRow } from "../../common/dsfr/fondamentaux";
import Histogram from "../Histogram";

const MAPPER = {
  qualiopi: { label: "Qualiopi", color: "#bbd6f1" },
  non_qualiopi: { label: "Non Qualiopi", color: "#69a4e0" },
};

export default function QualiopiStats() {
  let [{ data, loading, error }] = useFetch(`/api/v1/stats/qualiopi`, []);

  if (loading || error) {
    return <Spinner loading={loading} error={error} />;
  }

  return (
    <GridRow>
      <Col>
        <div style={{ height: "500px" }}>
          <Histogram
            indexBy={(item) => item.nature}
            data={data}
            ariaLabel="Répartition des natures des organisme par académie"
            xLegend={"Natures"}
            yLegend={"Nombre d'organisme"}
            keys={["qualiopi", "non_qualiopi"]}
            legendLabel={({ id }) => MAPPER[id].label}
            getTooltipLabel={({ id }) => MAPPER[id].label}
          />
        </div>
      </Col>
    </GridRow>
  );
}
