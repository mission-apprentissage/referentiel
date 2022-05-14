import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import usePrevious from "./usePrevious";

export default function useScrollToTop() {
  const location = useLocation();
  const previous = usePrevious(location);
  useEffect(() => {
    if (previous && (previous.pathname !== location.pathname || previous.search !== location.search)) {
      window.scrollTo(0, 0);
    }
  });
}
