import { useCallback, useState } from 'react';

//https://usehooks.com/useToggle/#:~:text=Basically%2C%20what%20this%20hook%20does,%2C%20open%2Fclose%20side%20menu.
export default function useToggle(initialState = false) {
  const [state, setState] = useState(initialState);

  // Define and memorize toggler function in case we pass down the comopnent,
  // This function change the boolean value to it's opposite value
  const toggle = useCallback(() => setState((state) => !state), []);

  return [state, toggle];
}
