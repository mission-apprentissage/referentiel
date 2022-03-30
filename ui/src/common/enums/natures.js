import { sortBy } from "lodash-es";

const MAPPER = {
  responsable: { label: "Responsable", color: "#bbd6f1", order: 0, params: { natures: "responsable" } },
  formateur: { label: "Formateur", color: "#0063cb", order: 2, params: { natures: "formateur" } },
  inconnue: { label: "N.A", color: "#003f7e", order: 3, params: { natures: "inconnue" } },
  responsable_formateur: {
    label: "Responsable et formateur",
    color: "#69a4e0",
    order: 1,
    params: { natures: "responsable_formateur" },
  },
};

export const getNatureTypes = () => sortBy(Object.keys(MAPPER), (key) => MAPPER[key].order);
export const getNatureLabel = (id) => MAPPER[id].label;
export const getNatureColor = (id) => MAPPER[id].color;
export const getNatureParams = (key) => MAPPER[key].params;
