import React from "react";
import { useFetch } from "../../common/hooks/useFetch";
import Spinner from "../../common/Spinner";
import { Col, GridRow } from "../../common/dsfr/fondamentaux";
import Histogram from "../../common/nivo/Histogram";
import { getNatureLabel, getNatureParams } from "../../common/enums/natures";
import { getQualiopiColor, getQualiopiLabel, getQualiopiParams } from "../../common/enums/qualiopi";
import { openNewTab } from "../../common/utils";
const config = require("../../config");

export default function QualiopiStats() {
  const [{ data, loading, error }] = useFetch(config.apiUrl + `/stats/qualiopi`, []);

  if (loading || error) {
    return <Spinner loading={loading} error={error} />;
  }

  return (
    <GridRow>
      <Col>
        <Histogram
          title="Répartition des natures des organisme par académie"
          xLegend={"Natures"}
          yLegend={"Nombre d'organisme"}
          data={data}
          series={["qualiopi", "non_qualiopi"]}
          getSerieLabel={(id) => getQualiopiLabel(id)}
          getSerieColor={(id) => getQualiopiColor(id)}
          groupBy={(item) => getNatureLabel(item.nature)}
          onClick={({ id, data }) => {
            openNewTab("/organismes", { ...getQualiopiParams(id), ...getNatureParams(data.nature) });
          }}
        />
      </Col>
    </GridRow>
  );
}
