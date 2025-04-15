/**
 *
 */

import SearchBar from '../../dsfr/elements/SearchBar';
import useForm from '../../form/useForm';
import { useQuery } from '../../hooks';


export default function SearchForm ({ onSubmit }) {
  const { query } = useQuery();
  const { registerForm, registerField } = useForm({ initialValues: { text: query.text || '' } });

  return (
    <form {...registerForm(onSubmit)}>
      <SearchBar
        name="text"
        modifiers={'lg'}
        label={'Rechercher'}
        placeholder={'Rechercher une raison sociale, une UAI, un SIRET / SIREN.'}
        {...registerField('text')}
      />
    </form>
  );
}
