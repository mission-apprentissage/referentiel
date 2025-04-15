/**
 *
 */

import { useFetch } from '../../common/hooks';
import Histogram from '../../common/nivo/Histogram';
import config from '../../config';


function getLastMonths (nbMonths) {
  const names = [
    'Janvier',
    'Février',
    'Mars',
    'Avril',
    'Mai',
    'Juin',
    'Juillet',
    'Août',
    'Septembre',
    'Octobre',
    'Novembre',
    'Decembre',
  ];

  const today = new Date();
  const months = [];
  for (let i = nbMonths; i > 0; i -= 1) {
    const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
    const year = d.getFullYear();
    months.push({ label: names[d.getMonth()], mois: d.getMonth() + 1, annee: year });
  }

  return months;
}

export default function NouveauxHistogram () {
  const [{ data }] = useFetch(config.apiUrl + '/stats/nouveaux', []);
  const last6Months = getLastMonths(6).map(({ annee, mois, label }) => {
    const found = data.find((e) => e.annee === annee && e.mois === mois);

    return {
      key:          `${annee}_${label}`,
      nbOrganismes: found?.total || 0,
    };
  });

  const customXLegend = {
    tickSize:       0,
    tickPadding:    25,
    tickRotation:   -25,
    legend:         '6 derniers mois',
    legendPosition: 'middle',
    legendOffset:   100,
    format:         (id) => id.split('_').reverse().join(' '),
  };

  return (
    <div style={{ height: '500px' }}>
      <Histogram
        title="Entrants sur les 6 derniers mois"
        yLegend={'Oorganismes'}
        data={last6Months}
        series={['nbOrganismes']}
        getSerieLabel={() => 'Nouveaux organismes'}
        getSerieColor={() => '#417DC4'}
        axisBottom={customXLegend}
      />
    </div>
  );
}
