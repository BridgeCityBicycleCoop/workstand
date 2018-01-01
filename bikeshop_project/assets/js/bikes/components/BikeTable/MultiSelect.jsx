import { DropDownMenu } from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';
import React from 'react';
import keys from 'lodash/keys';

const menuItems = (itemsMap, selectedItems) =>
  keys(itemsMap).map(item => (
    <MenuItem
      key={item}
      insetChildren
      checked={itemsMap && selectedItems.indexOf(item) > -1}
      value={item}
      primaryText={itemsMap[item]}
    />
  ));

export const MultiSelect = ({ selectedMenuValues, handleChange, menuValuesMap }) => (
  <DropDownMenu
    multiple
    value={selectedMenuValues}
    onChange={(_e, _k, v) => handleChange(v)}
  >
    {menuItems(menuValuesMap, selectedMenuValues)}
  </DropDownMenu>
);

export default MultiSelect;
