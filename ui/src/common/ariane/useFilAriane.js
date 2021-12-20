import { useContext, useEffect } from "react";
import { FilArianeContext } from "./FilArianeProvider";

export default function useFilAriane(list, options = {}) {
  let dependencies = options.dependencies || [];
  let preserve = !!options.preserve;
  let [fil, setFilAriane] = useContext(FilArianeContext);

  useEffect(() => {
    let current = preserve ? fil : [];
    return setFilAriane([...current, ...list]);
  }, [setFilAriane, ...dependencies]);

  return fil;
}
