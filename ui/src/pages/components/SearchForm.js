import React from "react";
import { Button, Card, Form as TablerForm } from "tabler-react";
import { Field, Form, Formik } from "formik";
import * as Yup from "yup";
import FormMessage from "../../common/components/FormMessage";
import Error from "../../common/components/Error";
import queryString from "query-string";

export default ({ search, error }) => {
  function showError(meta) {
    return meta.touched && meta.error
      ? {
          feedback: meta.error,
          invalid: true,
        }
      : {};
  }

  let params = queryString.parse(window.location.search);

  return (
    <Card>
      <Card.Header>
        <Card.Title>Rechercher un établissement</Card.Title>
      </Card.Header>
      <Card.Body>
        <Formik
          initialValues={{
            text: params.text || "",
          }}
          validationSchema={Yup.object().shape({
            text: Yup.string(),
          })}
          onSubmit={(values) => search({ page: 1, ...values })}
        >
          {({ status = {} }) => {
            return (
              <Form>
                <TablerForm.Group label="Raison sociale, siret ou UAI">
                  <Field name="text">
                    {({ field, meta }) => {
                      return <TablerForm.Input placeholder="..." {...field} {...showError(meta)} />;
                    }}
                  </Field>
                </TablerForm.Group>
                <Button color="primary" className="text-left" type={"submit"}>
                  Rechercher
                </Button>

                {status.message && <FormMessage>{status.message}</FormMessage>}
                {error && <Error>Une erreur est survenue</Error>}
              </Form>
            );
          }}
        </Formik>
      </Card.Body>
    </Card>
  );
};
