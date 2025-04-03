import { useFetch } from '../../common/hooks/useFetch';
import Spinner from '../../common/Spinner';
import { Col, GridRow } from '../../common/dsfr/fondamentaux';
import { ValidationHistogram } from './ValidationHistogram';
import { ValidationPie } from './ValidationPie';
import { buildUrl } from '../../common/utils.js';
const config = require('../../config');

export default function ValidationStats({ natures }) {
  const [{ data: stats, loading, error }] = useFetch(
    buildUrl(config.apiUrl + '/stats/validation', {
      natures,
    }),
    {
      national: {},
      academies: [],
    }
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
