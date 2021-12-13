import { Field, Form, Formik } from "formik";
import { Col, GridRow } from "../../../common/components/dsfr/fondamentaux";
import SearchBar from "../../../common/components/dsfr/elements/SearchBar";
import styled from "styled-components";
import useNavigation from "../../../common/hooks/useNavigation";

const SearchGridRow = styled(GridRow)`
  padding-bottom: 1.5rem;
  margin-bottom: 2rem;
  box-shadow: inset 0 1px 0 0 var(--border-default-grey), 0 1px 0 0 var(--border-default-grey);
`;

export default function SearchForm({ search }) {
  let { params } = useNavigation();
  async function onSubmit(values) {
    search({ page: 1, ...values });
  }

  return (
    <Formik initialValues={{ text: params.text || "" }} onSubmit={onSubmit}>
      {() => {
        return (
          <Form>
            <SearchGridRow>
              <Col>
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
