import React from 'react';
import { capitalizeFirstLetter } from '../utils.js';
import NA from './NA.jsx';

export default function Nature({ organisme }) {
  if (!organisme.nature) {
    return <NA />;
  }

  return <span>{capitalizeFirstLetter(organisme.nature.replace(/_/g, ' et '))}</span>;
}
