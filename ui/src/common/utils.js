import { omit } from "lodash-es";
import { Children, cloneElement } from "react";
import queryString from "query-string";

export function without(Tag, filter = []) {
  return (props) => <Tag {...omit(props, filter)} />;
}

export function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export function cloneNodes(nodes, propsCallback) {
  return Children.toArray(nodes).map((node) => cloneElement(node, propsCallback(node)));
}

export function flattenObject(obj, parent, res = {}) {
  for (let key in obj) {
    let propName = parent ? parent + "." + key : key;
    if (typeof obj[key] == "object" && !Array.isArray(obj[key])) {
      flattenObject(obj[key], propName, res);
    } else {
      res[propName] = obj[key];
    }
  }
  return res;
}

export function asSiren(siret) {
  return siret.substring(0, 9);
}

export function buildUrl(url, data) {
  let params = `${queryString.stringify(data, { skipNull: true, skipEmptyString: true })}`;
  return `${url}?${params}`;
}

export function openNewTab(params) {
  let url = buildUrl("/organismes", params);
  window.open(url, "_blank");
}

export const divide = (dividend, divisor) => {
  if (dividend && divisor !== 0) {
    let value = dividend / divisor;
    return Number(Math.round(value + "e1") + "e-1");
  } else {
    return 0;
  }
};

export const percentage = (dividend, divisor) => {
  return divide(dividend * 100, divisor);
};
