import SearchBar from "../../../common/dsfr/elements/SearchBar";
import useForm from "../../../common/form/useForm";

export default function SearchForm({ onSubmit }) {
  let { registerForm, registerField } = useForm({ initialValues: { text: "" } });

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
