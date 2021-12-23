import { Accordion } from "../../../common/dsfr/elements/Accordion";
import { Box } from "../../../common/Flexbox";
import LinkButton from "../../../common/dsfr/custom/LinkButton";
import useNavigation from "../../../common/hooks/useNavigation";
import { createContext } from "react";
import { uniq } from "lodash-es";

export const FilterContext = createContext(null);

export default function Filters({ children, search }) {
  let { params } = useNavigation();
  let filters = [];
  function onChange(data) {
    search({ ...params, ...data });
  }
  function register(paramName) {
    filters = uniq([...filters, paramName]);
  }
  function reset() {
    onChange(
      filters.reduce((acc, name) => {
        return {
          ...acc,
          [name]: [],
        };
      }, {})
    );
  }

  return (
    <FilterContext.Provider value={{ onChange, register }}>
      <Box justify={"between"} align={"top"} className={"fr-mb-3v"}>
        <div className={"fr-text--bold"}>FILTRER</div>
        <LinkButton onClick={reset}>réinitialiser</LinkButton>
      </Box>
      <Accordion>{children}</Accordion>
    </FilterContext.Provider>
  );
}
