import SearchBar from "../../common/dsfr/elements/SearchBar";
import useForm from "../../common/form/useForm";
import { useQuery } from "../../common/hooks/useQuery";

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
