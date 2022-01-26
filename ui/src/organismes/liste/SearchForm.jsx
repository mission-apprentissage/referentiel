import SearchBar from "../../common/dsfr/elements/SearchBar";
import useForm from "../../common/form/useForm";
import useNavigation from "../../common/hooks/useNavigation";

export default function SearchForm({ onSubmit }) {
  let { params } = useNavigation();
  let { registerForm, registerField } = useForm({ initialValues: { text: params.text || "" } });

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
