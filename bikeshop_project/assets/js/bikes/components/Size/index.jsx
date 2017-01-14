import React, { PropTypes } from 'react';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';

const sizes = ['C', 'S', 'M', 'L', 'XL'];

export const friendlySize = (size) => {
  switch (size) {
    case 'C':
      return 'child';
    case 'S':
      return 'small';
    case 'M':
      return 'medium';
    case 'L':
      return 'large';
    case 'XL':
      return 'extra large';
    default:
      return 'unknown';
  }
};

const Size = ({ size }) => {
  const items = sizes.map(s =>
    <MenuItem value={s} primaryText={friendlySize(s)} />,
  );

  return (
    <div>
      <SelectField
        floatingLabelText="Size"
        value={size}
        onChange={undefined}
      >
        <MenuItem value={null} primaryText="" />
        {items}
      </SelectField>
    </div>
  );
};

Size.propTypes = {
  size: PropTypes.string,
};

export default Size;
