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

const styles = {
  float: 'left',
}

const Size = ({ size, onChange }) => {
  const items = sizes.map(s =>
    <MenuItem key={s} name="size" value={s} primaryText={friendlySize(s)} />,
  );

  return (
    <div style={styles}>
      <SelectField
        floatingLabelText="Size"
        name="size"
        value={size}
        onChange={onChange}
        autoWidth
      >
        <MenuItem value={null} primaryText="" />
        {items}
      </SelectField>
    </div>
  );
};

Size.propTypes = {
  size: PropTypes.string,
  onChange: PropTypes.func,
};

export default Size;
