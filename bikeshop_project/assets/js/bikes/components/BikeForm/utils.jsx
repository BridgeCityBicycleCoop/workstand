import moment from 'moment';
import React from 'react';
import Checkbox from 'material-ui/Checkbox';
import MenuItem from 'material-ui/MenuItem';
import SelectField from 'material-ui/SelectField';
import TextField from 'material-ui/TextField';

const sources = ['COS_BIKE_DIVERSION_PILOT', 'UOFS', 'DROP_OFF'];

const friendlySources = (s) => {
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

const states = ['received', 'assessed', 'available', 'claimed', 'purchased', 'scrapped', 'transferred_to_police'];
const friendlStates = (s) => {
  switch (s) {
    case 'received':
      return 'Received';
    case 'assessed':
      return 'Assessed';
    case 'available':
      return 'Available';
    case 'claimed':
      return 'Claimed';
    case 'purchased':
      return 'Purchased';
    case 'scrapped':
      return 'Scrapped';
    case 'transferred_to_police':
      return 'Transferred to police';
    default:
      throw Error(`${s} is not an allowed state.`)
  }
};

export const getRequiredFields = (bikeState) => {
  switch (bikeState) {
    case 'received':
      return ['make', 'colour', 'size', 'serial_number', 'donation_source'];
    case 'assessed':
      return ['make', 'colour', 'size', 'serial_number', 'donation_source', 'price'];
    case 'available':
      return ['make', 'colour', 'size', 'serial_number', 'donation_source', 'price', 'stolen', 'cpic_searched'];
    case 'claimed':
      return ['make', 'colour', 'size', 'serial_number', 'donation_source', 'price', 'stolen', 'cpic_searched'];
    case 'purchased':
      return ['make', 'colour', 'size', 'serial_number', 'donation_source', 'price', 'stolen', 'cpic_searched'];
    case 'scrapped':
      return ['make', 'colour', 'size', 'serial_number', 'donation_source', 'cpic_searched'];
    case 'transferred_to_police':
      return ['make', 'colour', 'size', 'serial_number', 'donation_source', 'cpic_searched'];
    default:
      throw new Error(`${bikeState} is an invalid state.`);
  }
}

const canAvailable = (stolen, cpicSearched) => !stolen && cpicSearched;
const canClaim = (claimedBy, lastWorkedOn) => !claimedBy || lastWorkedOn.isAfter(moment().add(4, 'weeks'));
const canPurchase = canClaim;
const canScrap = (stripped, claim) => stripped && claim;
const canTransferToPolice = stolen => stolen;

export const stateMenuItems = availableStates => states
  .filter(s => availableStates.includes(s))
  .map(s => <MenuItem key={s} value={s} primaryText={friendlStates(s)} />);

export const sourceMenuItems = sources.map(s =>
  <MenuItem key={s} value={s} primaryText={friendlySources(s)} />,
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