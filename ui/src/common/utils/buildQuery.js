import queryString from "query-string";

export default function buildQuery(elements = {}) {
  return `${queryString.stringify(elements, { skipNull: true, skipEmptyString: true })}`;
}
