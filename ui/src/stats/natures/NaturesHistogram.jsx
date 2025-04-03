import Histogram from '../../common/nivo/Histogram';
import { getNatureColor, getNatureLabel, getNatureParams, getNatureTypes } from '../../common/enums/natures';
import React from 'react';
import { openNewTab } from '../../common/utils';

export function NaturesHistogram({ stats }) {
  return (
    <Histogram
      title="Répartition des natures des organisme par académie"
      xLegend={'Académies'}
      yLegend={'Nombre d\'organismes'}
      data={stats.academies}
      series={getNatureTypes()}
      getSerieLabel={(id) => getNatureLabel(id)}
      getSerieColor={(id) => getNatureColor(id)}
      groupBy={({ academie }) => academie.nom}
      onClick={({ id, data }) => {
        openNewTab({ ...getNatureParams(id), academies: data.academie.code });
      }}
    />
  );
}
