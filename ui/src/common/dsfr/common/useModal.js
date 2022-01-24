import { createRef, useMemo } from "react";
import { elementId } from "../dsfr";

export function useModal() {
  let id = useMemo(() => elementId("modal"), []);
  let ref = createRef();
  function open() {
    dsfr(ref.current).modal.disclose();
  }
  function close() {
    dsfr(ref.current).modal.conceal();
  }

  return { id, ref, open, close };
}
