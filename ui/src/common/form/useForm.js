import { useState } from "react";
import { uniq } from "lodash-es";

export default function useForm(options = {}) {
  const schema = options.yup;
  const [values, setValues] = useState(options.initialValues || {});
  const [submitting, setSubmitting] = useState(false);
  const [pristine, setPristine] = useState(true);
  const [errors, setErrors] = useState(null);
  let fields = [];

  function registerField(name) {
    fields = uniq([...fields, name]);
    return {
      name,
      value: values[name] || "",
      onChange: ({ target: { name, value } }) => {
        setPristine(false);
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
            const err = await validate();
            if (err) {
              setErrors(err);
              setSubmitting(false);
              return;
            } else {
              setErrors({});
            }
          }

          return Promise.resolve(onSubmit(values)).finally(() => setSubmitting(false));
        }
      },
    };
  }

  return {
    registerForm,
    registerField,
    setFormErrors: setErrors,
    values,
    pristine,
    errors,
  };
}
