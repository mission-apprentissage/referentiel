/**
 *
 */

import { useEffect } from 'react';


export function useOnce (callback) {
  useEffect(callback, []);
}
