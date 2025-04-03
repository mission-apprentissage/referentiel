/**
 *
 */

import Spinner from '../../common/Spinner';
import { Col, GridRow } from '../../common/dsfr/fondamentaux';
import { useFetch } from '../../common/hooks';
import { buildUrl } from '../../common/utils';
import { ValidationHistogram } from './ValidationHistogram';
import { ValidationPie } from './ValidationPie';
import config from '../../config';


export default function ValidationStats ({ natures }) {
  const [{ data: stats, loading, error }] = useFetch(
    buildUrl(config.apiUrl + '/stats/validation', {
      natures,
    }),
    {
      national:  {},
      academies: [],
    },
  );

  if (loading || error) {
    return <Spinner loading={loading} error={error} />;
  }

  return (
    <>
      <GridRow className={'fr-mb-3w'}>
        <Col>
          <ValidationPie stats={stats} />
        </Col>
      </GridRow>
      <GridRow className={'fr-mb-3w'}>
        <Col>
          <ValidationHistogram stats={stats} />
        </Col>
      </GridRow>
    </>
  );
}
