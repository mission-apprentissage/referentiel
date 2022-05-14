import React, { forwardRef } from "react";
import cs from "classnames";
import "@gouvfr/dsfr/dist/dsfr/dsfr.css";
import "./custom/xfr.scss";

window.dsfr = {
  verbose: true,
  mode: "manual",
};
require("@gouvfr/dsfr/dist/dsfr/dsfr.module");
require("@gouvfr/dsfr/dist/dsfr/dsfr.nomodule");

export function buildComponent(componentName, dsfrName, options = {}) {
  return forwardRef((props, ref) => {
    const { as, modifiers, icons, className, children, ...rest } = props;
    const Component = as || componentName;
    const clazz = classNames(dsfrName, { modifiers, icons, className, ...options });

    return (
      <Component className={clazz} {...rest} {...(ref ? { ref } : {})}>
        {children}
      </Component>
    );
  });
}

export function buildListComponent(Tag, dsfrName, options = {}) {
  return forwardRef((props, ref) => {
    const { modifiers, className, children, ...rest } = props;
    const clazz = classNames(dsfrName, { modifiers, className, ...options });

    return (
      <Tag className={clazz} {...rest} {...(ref ? { ref } : {})}>
        {React.Children.map(children, (child, i) => {
          return <li key={i}>{child}</li>;
        })}
      </Tag>
    );
  });
}

export function classNames(baseClassName, { modifiers, icons, className, validation, bemDelimiter = "--" }) {
  return cs(
    baseClassName,
    modifiers ? modifiers.split(" ").map((m) => `${baseClassName}${bemDelimiter}${m}`) : "",
    icons ? icons.split(" ").map((iconName) => asIconClassName(iconName)) : "",
    validation ? `${baseClassName}--${validation.type}` : "",
    className
  );
}

function asIconClassName(name) {
  return `fr-fi-${name}`;
}

export function ariaLabelledBy(...byIds) {
  return { "aria-labelledby": byIds.join(" "), role: "group" };
}

export function ariaDescribedBy(id) {
  return { "aria-describedby": id };
}

export function ariaExpanded(value) {
  return { "aria-expanded": value };
}

export function collapseElement(el) {
  const height = el.offsetHeight;
  el.style.setProperty("--collapser", "start-transition");
  el.style.setProperty("--collapse", -height + "px");
  el.style.setProperty("max-height", "none");
  el.style.setProperty("--collapser", "");
}

export function bootstrapDsfr() {
  return setTimeout(() => dsfr.start(), 250);
}
