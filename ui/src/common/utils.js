import { omit } from "lodash-es";
import { Children, cloneElement } from "react";

export function without(Tag, filter = []) {
  return (props) => <Tag {...omit(props, filter)} />;
}

export function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export function cloneNodes(nodes, propsCallback) {
  return Children.toArray(nodes).map((node) => cloneElement(node, propsCallback(node)));
}
