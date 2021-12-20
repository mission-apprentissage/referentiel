import { useState } from "react";
import { uniq } from "lodash-es";

export default function useForm(options = {}) {
  let fields = [];
  let schema = options.yup;
  let [values, setValues] = useState(options.initialValues || {});
  let [submitting, setSubmitting] = useState(false);
  let [errors, setErrors] = useState(null);

  function registerField(name) {
    fields = uniq([...fields, name]);
    return {
      name,
      onChange: ({ target: { name, value } }) => {
        setValues({
          ...values,
          [name]: value,
        });
      },
    };
  }

  async function validate() {
    try {
      await schema.validate(values, { abortEarly: false, recursive: true });
      return null;
    } catch (err) {
      if (!err.inner) {
        throw err;
      }

      return err.inner.reduce((acc, item) => {
        return {
          ...acc,
          [item.path]: { type: "error", message: item.message },
        };
      }, {});
    }
  }

  function registerForm(onSubmit) {
    return {
      onSubmit: async (e) => {
        e.preventDefault();
        if (!submitting) {
          setSubmitting(true);

          if (schema) {
            let err = await validate();
            if (err) {
              setErrors(err);
              setSubmitting(false);
              return;
            } else {
              setErrors({});
            }
          }

          return onSubmit(values).finally(() => setSubmitting(false));
        }
      },
    };
  }

  return {
    registerForm,
    registerField,
    setFormErrors: setErrors,
    values,
    errors,
  };
}
