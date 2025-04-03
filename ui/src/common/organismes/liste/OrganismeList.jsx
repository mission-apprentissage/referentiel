import { useContext } from 'react';
import OrganismeItem from './OrganismeItem';
import ApiPagination from '../../ApiPagination';
import { Box } from '../../Flexbox';
import Spinner from '../../Spinner';
import { SearchContext } from '../../SearchProvider';
import ExportButton from '../../ExportButton';

export default function OrganismeList({ response }) {
  const { data, loading, error } = response;
  const { search } = useContext(SearchContext);
  const pagination = data.pagination;

  return (
    <>
      <Spinner error={error} loading={loading} />
      <Box align={'baseline'} justify={'between'}>
        <div className={'fr-mb-3v fr-mr-1w'}>{pagination.total} organismes</div>
        <ExportButton params={search.params} />
      </Box>
      {data.organismes.map((organisme, index) => {
        return <OrganismeItem key={index} organisme={organisme} />;
      })}
      <Box justify={'center'}>
        <ApiPagination pagination={pagination} />
      </Box>
    </>
  );
}
