import MenuItem from 'material-ui/MenuItem';
import React from 'react';
import SelectField from 'material-ui/SelectField';
import TextField from 'material-ui/TextField';
import ValidatedCheckbox from './ValidatedCheckbox';

const sources = ['COS_BIKE_DIVERSION_PILOT', 'UOFS', 'DROP_OFF'];

const donationSourceMap = {
  COS_BIKE_DIVERSION_PILOT: 'City of Saskatoon Bike Diversion Pilot',
  UOFS: 'University of Saskatchewan',
  DROP_OFF: 'Drop Off',
};

export const sourceMenuItems = sources.map(s => (
  <MenuItem key={s} value={s} primaryText={donationSourceMap[s]} />
));

export const renderTextField = ({
  input,
  meta: { /* touched */ error },
  ...custom
}) => <TextField errorText={error} {...input} {...custom} />;

export const renderCheckbox = ({ input, meta, label, ...custom }) => (
  <ValidatedCheckbox
    label={label}
    checked={!!input.value}
    onCheck={input.onChange}
    meta={meta}
    {...custom}
  />
);

export const renderSelectField = ({
  input,
  label,
  meta: { touched, error },
  children,
  ...custom
}) => (
  <SelectField
    errorText={touched && error}
    {...input}
    onChange={(event, index, value) => input.onChange(value)}
    children={children}
    {...custom}
  />
);
