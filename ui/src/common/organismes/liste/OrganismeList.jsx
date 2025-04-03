import React, { useContext } from 'react';
import OrganismeItem from './OrganismeItem.jsx';
import ApiPagination from '../../ApiPagination.jsx';
import { Box } from '../../Flexbox.jsx';
import Spinner from '../../Spinner.jsx';
import { SearchContext } from '../../SearchProvider.jsx';
import ExportButton from '../../ExportButton.jsx';

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
