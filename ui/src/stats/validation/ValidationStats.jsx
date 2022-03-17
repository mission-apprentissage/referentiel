import React from "react";
import { useFetch } from "../../common/hooks/useFetch";
import Spinner from "../../common/Spinner";
import { Col, GridRow } from "../../common/dsfr/fondamentaux";
import { ValidationHistogram } from "./ValidationHistogram";
import { ValidationPie } from "./ValidationPie";

export default function ValidationStats() {
  let [{ data: stats, loading, error }] = useFetch(`/api/v1/stats/validation`, { national: {}, academies: [] });

  if (loading || error) {
    return <Spinner loading={loading} error={error} />;
  }

  return (
    <>
      <GridRow>
        <Col>
          <ValidationPie stats={stats} />
        </Col>
      </GridRow>
      <GridRow>
        <Col>
          <ValidationHistogram stats={stats} />
        </Col>
      </GridRow>
    </>
  );
}
