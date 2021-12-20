import React, { Children } from "react";
import { buildComponent, classNames, elementId } from "../common/utils";
import { Collapse } from "../common/Collapsable";
import { useCollapse } from "../common/useCollapse";
import { NavLink as RouterNavLink } from "react-router-dom";

export function Nav({ modifiers, className, children }) {
  let clazz = classNames("fr-nav", { modifiers, className });
  let id = elementId("nav");

  return (
    <nav className={clazz} id={id} role="navigation" aria-label="Menu principal">
      <ul className={`fr-nav__list`}>
        {Children.toArray(children).map((child, index) => {
          return (
            <li key={index} className={`fr-nav__item`}>
              {child}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

export const NavLink = buildComponent(RouterNavLink, "fr-nav__link");

export function NavButton({ text, children, ...rest }) {
  let { collapseId, collapseRef, collapse } = useCollapse();

  return (
    <>
      <button className="fr-nav__btn" aria-expanded={false} aria-controls={collapseId} onClick={collapse} {...rest}>
        {text}
      </button>
      <Collapse id={collapseId} ref={collapseRef} className={"fr-menu"}>
        <ul className="fr-menu__list">{children}</ul>
      </Collapse>
    </>
  );
}
