import React from "react";
import { classNames, elementId } from "../dsfr";

function SearchBar({ label, placeholder = label, modifiers, className, ...rest }) {
  let clazz = classNames("fr-search-bar", { modifiers, className });
  let id = elementId("search");
  let inputId = elementId("search-input");

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
