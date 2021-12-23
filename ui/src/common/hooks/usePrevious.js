import { useEffect, useRef } from "react";

export default function usePrevious(state) {
  let ref = useRef();

  useEffect(() => {
    ref.current = state;
  });

  return ref.current;
}
