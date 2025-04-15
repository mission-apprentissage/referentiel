import { createRef } from 'react';
import { useElementId } from '../../hooks';


export function useCollapse () {
  const collapseId = useElementId('collapse');
  const collapseRef = createRef();

  function collapse () {
    dsfr(collapseRef.current).collapse.disclose();
  }

  return { collapseId, collapseRef, collapse };
}
