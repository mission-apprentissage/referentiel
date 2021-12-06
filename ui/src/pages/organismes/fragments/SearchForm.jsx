import { Field, Form, Formik } from "formik";
import { Col, GridRow } from "../../../common/components/dsfr/fondamentaux";
import SearchBar from "../../../common/components/dsfr/elements/SearchBar";
import styled from "styled-components";
import Select from "../../../common/components/dsfr/elements/Select";
import { useFetch } from "../../../common/hooks/useFetch";
import useNavigation from "../../../common/hooks/useNavigation";

const SearchGridRow = styled(GridRow)`
  padding-bottom: 1.5rem;
  margin-bottom: 2rem;
  box-shadow: inset 0 1px 0 0 var(--border-default-grey), 0 1px 0 0 var(--border-default-grey);
`;

const LargeSelect = styled(Select)`
  display: flex;
  height: 100%;
`;

export default function SearchForm({ search }) {
  let { params } = useNavigation();
  let [{ data }] = useFetch(`/api/v1/academies`, { academies: [] });
  async function onSubmit(values) {
    search({ page: 1, ...values });
  }

  return (
    <Formik initialValues={{ text: params.text || "", academie: params.academie || "" }} onSubmit={onSubmit}>
      {() => {
        return (
          <Form>
            <SearchGridRow>
              <Col modifiers={"3"}>
                <Field as={LargeSelect} name="academie" modifiers={"lg"}>
                  <option value="" disabled hidden>
                    Académie
                  </option>
                  {data.academies.map((academie, index) => {
                    return (
                      <option key={index} value={academie.code}>
                        {academie.nom}
                      </option>
                    );
                  })}
                </Field>
              </Col>
              <Col modifiers={"9"}>
                <Field
                  as={SearchBar}
                  name="text"
                  modifiers={"lg"}
                  label={"Rechercher"}
                  placeholder={"Rechercher une raison sociale, une UAI, un SIRET."}
                  className={"fr-ml-1v"}
                />
              </Col>
            </SearchGridRow>
          </Form>
        );
      }}
    </Formik>
  );
}
