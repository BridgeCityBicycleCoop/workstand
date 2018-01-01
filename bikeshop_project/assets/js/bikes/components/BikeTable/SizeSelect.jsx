import React from 'react';
import { MultiSelect } from './MultiSelect';
import { SIZE_MAP } from '../../constants';

export const SizeSelect = ({ sizeFilters, setSizeFilter }) => (
  <MultiSelect
    selectedMenuValues={sizeFilters}
    handleChange={setSizeFilter}
    menuValuesMap={SIZE_MAP}
    style={{
      marginBottom: 16,
    }}
  />
);
export default SizeSelect;
