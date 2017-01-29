import React, { PropTypes } from 'react';
import MenuItem from 'material-ui/MenuItem';
import SelectField from 'material-ui/SelectField';

const sources = ['COS_BIKE_DIVERSION_PILOT', 'UOFS', 'DROP_OFF'];

export const friendly = (s) => {
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

const Source = ({ source, onChange }) => {
  const items = sources.map(s =>
    <MenuItem value={s} primaryText={friendly(s)} />,
  );

  return (
    <div>
      <SelectField
        floatingLabelText="Source"
        value={source}
        onChange={onChange}
        fullWidth
      >
        <MenuItem value={null} primaryText="" />
        {items}
      </SelectField>
    </div>
  );
};

Source.propTypes = {
  source: PropTypes.string,
  onChange: PropTypes.function
};

export default Source;
