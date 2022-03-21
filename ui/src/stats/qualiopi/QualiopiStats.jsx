import React from "react";
import { useFetch } from "../../common/hooks/useFetch";
import Spinner from "../../common/Spinner";
import { Col, GridRow } from "../../common/dsfr/fondamentaux";
import Histogram from "../Histogram";
import { getNatureLabel } from "../../common/enums/natures";
import { getQualiopiColor, getQualiopiLabel } from "../../common/enums/qualiopi";

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
            xLegend={"Natures"}
            yLegend={"Nombre d'organisme"}
            data={data}
            keys={["qualiopi", "non_qualiopi"]}
            indexBy={(item) => getNatureLabel(item.nature)}
            getLabel={(id) => getQualiopiLabel(id)}
            getColor={(id) => getQualiopiColor(id)}
          />
        </div>
      </Col>
    </GridRow>
  );
}
