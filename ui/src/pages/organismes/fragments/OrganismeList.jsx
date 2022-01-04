import OrganismeItem from "./OrganismeItem";
import ResultsPagination from "../../../common/ResultsPagination";
import { Box } from "../../../common/Flexbox";
import Spinner from "../../../common/Spinner";

export default function OrganismeList({ results }) {
  let { data, loading, error } = results;
  let pagination = data.pagination;

  return (
    <>
      <Spinner error={error} loading={loading} />
      <div className={"fr-mb-3v"}>{pagination.total} organismes</div>
      {data.organismes.map((organisme, index) => {
        return <OrganismeItem key={index} organisme={organisme} />;
      })}
      <Box justify={"center"}>
        <ResultsPagination pagination={pagination} />
      </Box>
    </>
  );
}
