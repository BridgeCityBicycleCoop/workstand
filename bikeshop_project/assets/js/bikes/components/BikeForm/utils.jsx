import React from 'react';
import Checkbox from 'material-ui/Checkbox';
import MenuItem from 'material-ui/MenuItem';
import SelectField from 'material-ui/SelectField';
import TextField from 'material-ui/TextField';

const sources = ['COS_BIKE_DIVERSION_PILOT', 'UOFS', 'DROP_OFF'];

const friendly = (s) => {
  switch (s) {
    case 'COS_BIKE_DIVERSION_PILOT':
      return 'City of Saskatoon Bike Diversion Pilot';
    case 'UOFS':
      return 'University of Saskatchewan';
    case 'DROP_OFF':
      return 'Drop Off';
    default:
      return undefined;
  }
};

export const sourceMenuItems = sources.map(s =>
  <MenuItem key={s} value={s} primaryText={friendly(s)} />,
);

export const renderTextField = ({ input, meta: { touched, error }, ...custom }) => (
  <TextField
    errorText={touched && error}
    {...input}
    {...custom}
  />
);

export const renderCheckbox = ({ input, meta, label, ...custom }) => (
  <Checkbox
    label={label}
    checked={!!input.value}
    onCheck={input.onChange}
    {...custom}
  />
);

export const renderSelectField = ({ input, label, meta: { touched, error }, children, ...custom }) => (
  <SelectField
    errorText={touched && error}
    {...input}
    onChange={(event, index, value) => input.onChange(value)}
    children={children}
    {...custom}
  />
);