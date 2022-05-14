import { createRef } from "react";
import useElementId from "../../hooks/useElementId";

export function useModal() {
  const id = useElementId("modal");
  const ref = createRef();
  function open() {
    dsfr(ref.current).modal.disclose();
  }
  function close() {
    dsfr(ref.current).modal.conceal();
  }

  return { id, ref, open, close };
}
