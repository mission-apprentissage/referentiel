import React from "react";
import { useFetch } from "../../common/hooks/useFetch";
import Spinner from "../../common/Spinner";
import { Col, GridRow } from "../../common/dsfr/fondamentaux";
import Histogram from "../Histogram";
import { getNatureLabel } from "../../common/natures";

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
            ariaLabel="Répartition des natures des organisme par académie"
            data={data}
            indexBy={(item) => getNatureLabel(item.nature)}
            keys={["qualiopi", "non_qualiopi"]}
            xLegend={"Natures"}
            yLegend={"Nombre d'organisme"}
            getLabel={(id) => MAPPER[id].label}
            getColor={(id) => MAPPER[id].color}
          />
        </div>
      </Col>
    </GridRow>
  );
}
