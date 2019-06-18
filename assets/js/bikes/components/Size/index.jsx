import React, { PropTypes } from 'react';
import { Field } from 'redux-form';
import MenuItem from 'material-ui/MenuItem';
import SelectField from 'material-ui/SelectField';

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
};

const renderSelectField = ({ input, label, meta: { touched, error }, children, ...custom })  => (
  <SelectField
    errorText={touched && error}
    {...input}
    onChange={(event, index, value) => input.onChange(value)}
    children={children}
    {...custom}
  />
);

const Size = () => {
  const items = sizes.map(s =>
    <MenuItem key={s} name="size" value={s} primaryText={friendlySize(s)} />,
  );

  return (
    <Field
      name="size"
      component={renderSelectField}
      floatingLabelText="Size"
      fullWidth
    >
      <MenuItem value={null} primaryText="" />
      {items}
    </Field>
  );
};

Size.propTypes = {
  size: PropTypes.string,
  onChange: PropTypes.func,
};

export default Size;
