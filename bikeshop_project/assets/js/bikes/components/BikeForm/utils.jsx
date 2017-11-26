import moment from 'moment';
import React from 'react';
import Checkbox from 'material-ui/Checkbox';
import MenuItem from 'material-ui/MenuItem';
import SelectField from 'material-ui/SelectField';
import TextField from 'material-ui/TextField';

const sources = ['COS_BIKE_DIVERSION_PILOT', 'UOFS', 'DROP_OFF'];

const donationSourceMap = {
  COS_BIKE_DIVERSION_PILOT: 'City of Saskatoon Bike Diversion Pilot',
  UOFS: 'University of Saskatchewan',
  DROP_OFF: 'Drop Off',
};

const states = [
  'received',
  'assessed',
  'available',
  'claimed',
  'purchased',
  'scrapped',
  'transfer_to_police',
];
const friendlStates = s => {
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
    case 'transfer_to_police':
      return 'Transferred to police';
    default:
      throw Error(`${s} is not an allowed state.`);
  }
};

export const getRequiredFields = bikeState => {
  switch (bikeState) {
    case 'received':
      return ['make', 'colour', 'size', 'serial_number', 'donation_source'];
    case 'assessed':
      return [
        'make',
        'colour',
        'size',
        'serial_number',
        'donation_source',
        'price',
      ];
    case 'available':
      return [
        'make',
        'colour',
        'size',
        'serial_number',
        'donation_source',
        'price',
        'stolen',
        'cpic_searched',
      ];
    case 'claimed':
      return [
        'make',
        'colour',
        'size',
        'serial_number',
        'donation_source',
        'price',
        'stolen',
        'cpic_searched',
      ];
    case 'purchased':
      return [
        'make',
        'colour',
        'size',
        'serial_number',
        'donation_source',
        'price',
        'stolen',
        'cpic_searched',
      ];
    case 'scrapped':
      return [
        'make',
        'colour',
        'size',
        'serial_number',
        'donation_source',
        'cpic_searched',
      ];
    case 'transfer_to_police':
      return [
        'make',
        'colour',
        'size',
        'serial_number',
        'donation_source',
        'cpic_searched',
      ];
    default:
      throw new Error(`${bikeState} is an invalid state.`);
  }
};

const canAvailable = (stolen, cpicSearched) => !stolen && cpicSearched;
const canClaim = (claimedBy, lastWorkedOn) =>
  !claimedBy || lastWorkedOn.isAfter(moment().add(4, 'weeks'));
const canPurchase = canClaim;
const canScrap = (stripped, claim) => stripped && claim;
const canTransferToPolice = stolen => stolen;

const styles = {
  error: {
    color: 'red',
    fontSize: 'small',
  },
};
class ValidatedCheckbox extends Checkbox {
  render() {
    const { meta: { touched, error } } = this.props;
    return (
      <div>
        {super.render()}
        {error && <span style={styles.error}>{error}</span>}
      </div>
    );
  }
}

export const stateMenuItems = availableStates =>
  availableStates.map(s => (
    <MenuItem key={s} value={s} primaryText={friendlStates(s)} />
  ));

export const sourceMenuItems = sources.map(s => (
  <MenuItem key={s} value={s} primaryText={donationSourceMap[s]} />
));

export const renderTextField = ({
  input,
  meta: { touched, error },
  ...custom
}) => <TextField errorText={touched && error} {...input} {...custom} />;

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
