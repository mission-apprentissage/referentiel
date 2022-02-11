import { Filter } from "./Filter";

export default function UAIFilter() {
  return (
    <Filter
      label={"UAI validée"}
      paramName={"uais"}
      items={[
        { code: "true", label: "Oui" },
        { code: "false", label: "Non" },
      ]}
    />
  );
}
