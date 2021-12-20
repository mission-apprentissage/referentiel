import { useContext } from "react";
import { FormContext } from "./Form";

export default function useFormContext() {
  return useContext(FormContext);
}
