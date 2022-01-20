import { omit } from "lodash-es";

export function without(Tag, filter = []) {
  return (props) => <Tag {...omit(props, filter)} />;
}

export function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
