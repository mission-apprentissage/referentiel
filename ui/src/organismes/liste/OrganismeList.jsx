import React, { useContext } from "react";
import OrganismeItem from "./OrganismeItem";
import ApiPagination from "../../common/ApiPagination";
import { Box } from "../../common/Flexbox";
import Spinner from "../../common/Spinner";
import { SearchContext } from "../../common/SearchProvider";
import ExportButton from "../../common/ExportButton.jsx";

export default function OrganismeList({ response }) {
  const { data, loading, error } = response;
  const { search } = useContext(SearchContext);
  const pagination = data.pagination;

  return (
    <>
      <Spinner error={error} loading={loading} />
      <Box align={"baseline"} justify={"between"}>
        <div className={"fr-mb-3v fr-mr-1w"}>{pagination.total} organismes</div>
        <ExportButton params={search.params} />
      </Box>
      {data.organismes.map((organisme, index) => {
        return <OrganismeItem key={index} organisme={organisme} />;
      })}
      <Box justify={"center"}>
        <ApiPagination pagination={pagination} />
      </Box>
    </>
  );
}
