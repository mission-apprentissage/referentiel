import OrganismeItem from "./OrganismeItem";
import ApiPagination from "../../common/ApiPagination";
import { Box } from "../../common/Flexbox";
import Spinner from "../../common/Spinner";

export default function OrganismeList({ response }) {
  let { data, loading, error } = response;
  let pagination = data.pagination;

  return (
    <>
      <Spinner error={error} loading={loading} />
      <div className={"fr-mb-3v"}>{pagination.total} organismes</div>
      {data.organismes.map((organisme, index) => {
        return <OrganismeItem key={index} organisme={organisme} />;
      })}
      <Box justify={"center"}>
        <ApiPagination pagination={pagination} />
      </Box>
    </>
  );
}
