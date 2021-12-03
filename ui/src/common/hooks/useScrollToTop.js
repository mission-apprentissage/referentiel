import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import usePrevious from "./usePrevious";

export default function useScrollToTop() {
  let location = useLocation();
  let previous = usePrevious(location);
  useEffect(() => {
    if (previous && previous.pathname !== location.pathname) {
      window.scrollTo(0, 0);
    }
  });
}
