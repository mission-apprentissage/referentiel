import { classNames } from '../dsfr';
import useElementId from '../../hooks/useElementId';

function SearchBar({ label, placeholder = label, modifiers, className, ...rest }) {
  const clazz = classNames('fr-search-bar', { modifiers, className });
  const id = useElementId('search');
  const inputId = useElementId('search-input');

  return (
    <div className={clazz} id={id} role="search">
      <label className="fr-label" htmlFor={inputId}>
        {label}
      </label>
      <input id={inputId} type="search" className="fr-input" placeholder={placeholder} {...rest} />
      <button type="submit" className="fr-btn" title={label}>
        {label}
      </button>
    </div>
  );
}

export default SearchBar;
