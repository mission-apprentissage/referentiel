import { createRef, useMemo } from "react";
import { elementId } from "../dsfr";

export function useCollapse() {
  let collapseId = useMemo(() => elementId("collapse"), []);
  let collapseRef = createRef();
  function collapse() {
    dsfr(collapseRef.current).collapse.disclose();
  }

  return { collapseId, collapseRef, collapse };
}
