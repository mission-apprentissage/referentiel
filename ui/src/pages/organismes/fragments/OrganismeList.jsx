import OrganismeItem from "./OrganismeItem";
import ResultsPagination from "../../../common/components/ResultsPagination";
import { Box } from "../../../common/components/Flexbox";

export default function OrganismeList({ organismes, pagination }) {
  return (
    <>
      <div className={"fr-mb-3v"}>{pagination.total} organismes</div>
      {organismes.map((organisme, index) => {
        return <OrganismeItem key={index} organisme={organisme} />;
      })}
      <Box justify={"center"}>
        <ResultsPagination pagination={pagination} />
      </Box>
    </>
  );
}
