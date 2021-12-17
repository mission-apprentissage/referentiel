import { useContext } from "react";
import { FormContext } from "../components/Form";

export default function useFormContext() {
  return useContext(FormContext);
}
