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

  function getInitialFormValues() {
    return filterNames.reduce((acc, name) => {
      return {
        ...acc,
        [name]: (params[name] || "").split(",").filter((v) => v),
      };
    }, {});
  }

  function convertFormValuesIntoParams(formValues) {
    return filterNames.reduce((acc, key) => {
      return {
        ...acc,
        [key]: formValues[key].join(","),
      };
    }, {});
  }

  function onSubmit(formValues) {
    let usedFilterNames = filterNames.filter((k) => formValues[k] && formValues[k].length > 0);

    search({
      ...omit(params, filterNames),
      filtres: usedFilterNames,
      ...convertFormValuesIntoParams(formValues),
    });
  }

  let initialFormValues = getInitialFormValues();
  return (
    <Formik initialValues={initialFormValues} onSubmit={onSubmit}>
      {() => {
        let { departements, statuts, numero_declaration_activite } = filters;
        return (
          <AutoResetForm values={initialFormValues}>
            <FiltersHeader filters={filters} />
            <Accordion>
              {filters.departements && filters.departements.length > 0 && (
                <Filter label={"Département"} filterName={"departements"} filter={departements} />
              )}
              {statuts && statuts.length > 0 && <Filter label={"Type"} filterName={"statuts"} filter={statuts} />}
              {numero_declaration_activite && numero_declaration_activite.length > 0 && (
                <Filter
                  label={"Déclaré datagouv"}
                  filterName={"numero_declaration_activite"}
                  filter={numero_declaration_activite}
                />
              )}
            </Accordion>
          </AutoResetForm>
        );
      }}
    </Formik>
  );
}
