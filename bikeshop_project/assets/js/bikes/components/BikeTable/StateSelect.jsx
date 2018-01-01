import React from 'react';
import { STATE_MAP } from '../../constants';
import { MultiSelect } from './MultiSelect';

export const StateSelect = ({ stateFilters, setStateFilter }) => (
  <MultiSelect
    selectedMenuValues={stateFilters}
    handleChange={setStateFilter}
    menuValuesMap={STATE_MAP}
    style={{ marginBottom: 16, fontSize: 14 }}
  />
);
export default StateSelect;
