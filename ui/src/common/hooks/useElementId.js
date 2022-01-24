import { useMemo } from "react";
import { v4 as uuidv4 } from "uuid";

export default function useElementId(name) {
  return useMemo(() => {
    let prefix = name ? `${name}-` : "";
    let random = `${uuidv4().substr(0, 8)}`;

    return `${prefix}${random}`;
  }, [name]);
}
