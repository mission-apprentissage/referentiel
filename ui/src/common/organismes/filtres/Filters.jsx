/**
 *
 */

import { createContext } from 'react';
import { uniq } from 'lodash-es';

import { Accordion } from '../../dsfr/elements/Accordion';
import { Box } from '../../Flexbox';
import LinkButton from '../../dsfr/custom/LinkButton';


export const FilterContext = createContext(null);


export function Filters ({ children, onChange: handleChange }) {
  let filters = [];

  function onChange (data) {
    const withArrayValueAsString = Object.keys(data).reduce((acc, key) => {
      const array = data[key];
      return {
        ...acc,
        [key]: array.join(','),
      };
    }, {});

    handleChange(withArrayValueAsString);
  }

  function register (paramName) {
    filters = uniq([...filters, paramName]);
  }

  function reset () {
    onChange(
      filters.reduce((acc, name) => {
        return {
          ...acc,
          [name]: [],
        };
      }, {}),
    );
  }

  return (
    <FilterContext.Provider value={{ onChange, register }}>
      <Box justify={'between'} align={'top'} className={'fr-mb-3v'}>
        <div className={'fr-text--bold'}>FILTRER</div>
        <LinkButton onClick={reset}>réinitialiser</LinkButton>
      </Box>
      <Accordion>{children}</Accordion>
    </FilterContext.Provider>
  );
}
