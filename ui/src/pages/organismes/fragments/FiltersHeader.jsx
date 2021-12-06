import { useFormikContext } from "formik";
import { Box } from "../../../common/components/Flexbox";
import { Button } from "../../../common/components/dsfr/elements/Button";

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
    <Box justify={"between"} className={"fr-mb-3v"}>
      <div className={"fr-text--bold"}>FILTRER</div>
      <Button onClick={() => reset()}>réinitialiser</Button>
    </Box>
  );
}
