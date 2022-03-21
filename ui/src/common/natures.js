const MAPPER = {
  responsable: { label: "Responsable", color: "#bbd6f1" },
  responsable_formateur: { label: "Responsable et formateur", color: "#69a4e0" },
  formateur: { label: "Formateur", color: "#0063cb" },
  inconnu: { label: "Inconnu", color: "#003f7e" },
};

export const getNatureKeys = () => Object.keys(MAPPER);
export const getNatureLabel = (id) => MAPPER[id].label;
export const getNatureColor = (id) => MAPPER[id].color;
