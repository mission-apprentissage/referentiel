import SearchBar from "../../dsfr/elements/SearchBar.jsx";
import useForm from "../../form/useForm.js";
import { useQuery } from "../../hooks/useQuery.js";

export default function SearchForm({ onSubmit }) {
  const { query } = useQuery();
  const { registerForm, registerField } = useForm({ initialValues: { text: query.text || "" } });

  return (
    <form {...registerForm(onSubmit)}>
      <SearchBar
        name="text"
        modifiers={"lg"}
        label={"Rechercher"}
        placeholder={"Rechercher une raison sociale, une UAI, un SIRET."}
        {...registerField("text")}
      />
    </form>
  );
}
