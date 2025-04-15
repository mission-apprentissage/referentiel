/**
 *
 */

import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { usePrevious } from './usePrevious';


export function useScrollToTop (options = {}) {

  const location = useLocation();
  const previous = usePrevious(location);

  useEffect(() => {
    const isNewPath = previous && (previous.pathname !== location.pathname || previous.search !== location.search);
    if (options.force || isNewPath) {
      window.scrollTo(0, 0);
    }
  });
}
