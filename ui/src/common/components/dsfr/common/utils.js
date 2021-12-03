import { v4 as uuidv4 } from "uuid";
import React, { Children, cloneElement, forwardRef } from "react";
import cs from "classnames";

export function buildComponent(Tag, dsfrName, options = {}) {
  return forwardRef((props, ref) => {
    let { modifiers, icons, className, children, ...rest } = props;
    let clazz = classNames(dsfrName, { modifiers, icons, className, ...options });

    return (
      <Tag className={clazz} {...rest} {...(ref ? { ref } : {})}>
        {children}
      </Tag>
    );
  });
}

export function buildListComponent(Tag, dsfrName, options = {}) {
  return forwardRef((props, ref) => {
    let { modifiers, className, children, ...rest } = props;
    let clazz = classNames(dsfrName, { modifiers, className, ...options });

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
    icons ? icons.split(" ").map((i) => `fr-fi-${i}`) : "",
    validation ? `${baseClassName}--${validation.type}` : "",
    className
  );
}

export function elementId(prefix) {
  return `${prefix}-${uuidv4().substr(0, 8)}`;
}

export function icon(name) {
  return `fr-fi-${name}`;
}

export function ariaLabelledBy(...byIds) {
  return { "aria-labelledby": byIds.join(" "), role: "group" };
}

export function ariaDescribedBy(id) {
  return { "aria-describedby": id };
}

export function collapseElement(el) {
  let height = el.offsetHeight;
  el.style.setProperty("--collapser", "start-transition");
  el.style.setProperty("--collapse", -height + "px");
  el.style.setProperty("max-height", "none");
  el.style.setProperty("--collapser", "");
}

export function cloneNodes(nodes, propsCallback) {
  return Children.toArray(nodes).map((node) => cloneElement(node, propsCallback(node)));
}
