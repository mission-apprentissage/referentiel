import { createRef } from "react";
import useElementId from "../../hooks/useElementId";

export function useCollapse() {
  let collapseId = useElementId("collapse");
  let collapseRef = createRef();
  function collapse() {
    dsfr(collapseRef.current).collapse.disclose();
  }

  return { collapseId, collapseRef, collapse };
}
