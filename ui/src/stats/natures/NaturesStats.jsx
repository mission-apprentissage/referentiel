import React from "react";
import { useFetch } from "../../common/hooks/useFetch";
import Spinner from "../../common/Spinner";
import { Col, GridRow } from "../../common/dsfr/fondamentaux";
import { NaturesPie } from "./NaturesPie";
import { NaturesHistogram } from "./NaturesHistogram";

export default function NaturesStats() {
  let [{ data: stats, loading, error }] = useFetch(`/api/v1/stats/natures`, { national: null, academies: [] });

  if (loading || error) {
    return <Spinner loading={loading} error={error} />;
  }

  return (
    <>
      <GridRow className={"fr-mb-3w"}>
        <Col>{stats.national && <NaturesPie stats={stats} />}</Col>
      </GridRow>
      <GridRow className={"fr-mb-3w"}>
        <Col>{stats.academies.length > 0 && <NaturesHistogram stats={stats} />}</Col>
      </GridRow>
    </>
  );
}
