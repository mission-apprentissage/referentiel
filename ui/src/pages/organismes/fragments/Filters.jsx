import { Accordion } from "../../../common/components/dsfr/elements/Accordion";
import { Formik, useFormikContext } from "formik";
import { isEmpty, omit } from "lodash-es";
import useNavigation from "../../../common/hooks/useNavigation";
import Filter from "./Filter";
import FiltersHeader from "./FiltersHeader";
import { useEffect } from "react";

function AutoResetForm({ children, values }) {
  let { setValues } = useFormikContext();
  useEffect(() => {
    setValues(values);
  }, [values, setValues]);

  return <>{children}</>;
}

export default function Filters({ filters, search }) {
  let { params } = useNavigation();
  let filterNames = Object.keys(filters);

  if (isEmpty(filters)) {
    return <div />;
  }

  function getInitialValues() {
    return filterNames.reduce((acc, name) => {
      return {
        ...acc,
        [name]: (params[name] || "").split(",").filter((v) => v),
      };
    }, {});
  }

  function convertFormValuesIntoParams(values) {
    return filterNames.reduce((acc, key) => {
      return {
        ...acc,
        [key]: values[key].join(","),
      };
    }, {});
  }

  function onSubmit(values) {
    let usedFilterNames = filterNames.filter((k) => values[k] && values[k].length > 0);

    search({
      ...omit(params, [...filterNames, "filtres"]),
      filtres: usedFilterNames,
      ...convertFormValuesIntoParams(values),
    });
  }

  let initialValues = getInitialValues();
  return (
    <Formik initialValues={initialValues} onSubmit={onSubmit}>
      {() => {
        let { departements, statuts } = filters;

        return (
          <AutoResetForm values={initialValues}>
            <FiltersHeader filters={filters} />
            <Accordion>
              {filters.departements && filters.departements.length > 0 && (
                <Filter label={"Département"} filterName={"departements"} filter={departements} />
              )}
              {statuts && statuts.length > 0 && <Filter label={"Type"} filterName={"statuts"} filter={statuts} />}
            </Accordion>
          </AutoResetForm>
        );
      }}
    </Formik>
  );
}
