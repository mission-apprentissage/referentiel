import { createContext } from "react";

export const FormContext = createContext(null);

export function Form({ onSubmit, children, ...props }) {
  return (
    <FormContext.Provider value={props}>
      <form {...props.registerForm(onSubmit)}>{children}</form>
    </FormContext.Provider>
  );
}
