import { buildComponent, elementId } from "../dsfr";
import React, { Children } from "react";
import { Link } from "react-router-dom";

export default function Breadcrumb({ children }) {
  let id = elementId("breadcrumb");

  return (
    <nav role="navigation" className="fr-breadcrumb" aria-label={"vous êtes ici :"}>
      <button className="fr-breadcrumb__button" aria-expanded="false" aria-controls={id}>
        Voir le fil d’Ariane
      </button>
      <div className="fr-collapse" id={id}>
        <ol className="fr-breadcrumb__list">
          {Children.toArray(children).map((child, index) => {
            return <li key={index}>{child}</li>;
          })}
        </ol>
      </div>
    </nav>
  );
}

export const BreadcrumbLink = buildComponent(Link, "fr-breadcrumb__link");
export const BreadcrumbCurrent = buildComponent("a", "fr-breadcrumb__link");
