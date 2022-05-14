import React from "react";
import { useFetch } from "../../common/hooks/useFetch";
import Spinner from "../../common/Spinner";
import { Col, GridRow } from "../../common/dsfr/fondamentaux";
import { ValidationHistogram } from "./ValidationHistogram";
import { ValidationPie } from "./ValidationPie";

export default function ValidationStats() {
  const [{ data: stats, loading, error }] = useFetch(`/api/v1/stats/validation`, { national: {}, academies: [] });

  if (loading || error) {
    return <Spinner loading={loading} error={error} />;
  }

  return (
    <>
      <GridRow className={"fr-mb-3w"}>
        <Col>
          <ValidationPie stats={stats} />
        </Col>
      </GridRow>
      <GridRow className={"fr-mb-3w"}>
        <Col>
          <ValidationHistogram stats={stats} />
        </Col>
      </GridRow>
    </>
  );
}
