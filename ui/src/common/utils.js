import { omit } from "lodash-es";

export function without(Tag, filter = []) {
  return (props) => <Tag {...omit(props, filter)} />;
}
