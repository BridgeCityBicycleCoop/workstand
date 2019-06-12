import React, { PropTypes } from 'react';
import MenuItem from 'material-ui/MenuItem';
import SelectField from 'material-ui/SelectField';

const Purpose = ({ initialValue, handleChange }) => (
  <SelectField
    value={initialValue}
    onChange={handleChange}
    fullWidth
  >
    <MenuItem value={'VOLUNTEER'} primaryText="Volunteer" />
    <MenuItem value={'FIX'} primaryText="Fix" />
    <MenuItem value={'BUILD'} primaryText="Build" />
    <MenuItem value={'WORKSHOP'} primaryText="Workshop" />
    <MenuItem value={'DONATE'} primaryText="Donate" />
    <MenuItem value={'STAFF'} primaryText="Staff" />
    <MenuItem value={'PARTS'} primaryText="Parts" />
    <MenuItem value={'BUY_BIKE'} primaryText="Buy Bike" />
    <MenuItem value={'TOUR'} primaryText="Tour / Visit" />
  </SelectField>
);

Purpose.propTypes = {
  initialValue: PropTypes.string,
  handleChange: PropTypes.func,
};

export default Purpose;
