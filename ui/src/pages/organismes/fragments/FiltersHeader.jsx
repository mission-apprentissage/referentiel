import { useFormikContext } from "formik";
import { Box } from "../../../common/components/Flexbox";
import LinkButton from "../../../common/components/dsfr/custom/LinkButton";

export default function FiltersHeader({ filters }) {
  let { values, submitForm, setValues } = useFormikContext();

  function reset() {
    Object.keys(filters).forEach((key) => {
      values[key] = [];
    });

    setValues(values);
    submitForm();
  }

  return (
    <Box justify={"between"} align={"top"} className={"fr-mb-3v"}>
      <div className={"fr-text--bold"}>FILTRER</div>
      <LinkButton onClick={() => reset()}>réinitialiser</LinkButton>
    </Box>
  );
}
